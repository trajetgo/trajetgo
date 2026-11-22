const crypto = require("crypto");

const ApiError = require("../../../utils/ApiError");
const { parseWorkbook } = require("./import.parser");
const { validateWorkbook } = require("./import.validators");

const repository = require("./import.repository");
const tgtlRepository = require("../tgtl.repository");

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function requireUserCompany(user) {
    if (!user?.companyId) {
        throw new ApiError(403, "Aucune compagnie associée à cet utilisateur.");
    }
    return user.companyId;
}

function buildIdMap(records) {
    const map = new Map();

    for (const { data } of records) {
        const id = data.external_id;
        if (id) map.set(String(id).trim().toUpperCase(), data);
    }

    return map;
}

function toDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;

    const [y, m, d] = String(value).split("-").map(Number);
    return new Date(y, m - 1, d);
}

function toInt(value) {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toFloat(value) {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function toBool(value) {
    if (value === null || value === undefined || value === "") return null;
    return value === true || String(value).toLowerCase() === "true";
}

function splitList(value) {
    if (!value) return [];
    return String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

/**
 * Normalise une valeur de temps vers "HH:MM".
 *
 * Accepte :
 *   - "07:00", "7:00", "07:00:00" (chaînes)
 *   - Date (cellule Excel formatée en heure)
 *   - number entre 0 et 1 (fraction de journée Excel)
 *
 * Retourne null si la valeur est vide ou invalide.
 */
function normalizeTime(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    // Date Excel (ex. 1899-12-31T07:00:00.000Z)
    if (value instanceof Date) {
        const hours = value.getHours();
        const minutes = value.getMinutes();

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    // Fraction de journée Excel (0.291666 = 07:00)
    if (typeof value === "number") {
        const totalMinutes = Math.round(value * 24 * 60);
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    // Chaîne "H:MM", "HH:MM", "HH:MM:SS"
    const str = String(value).trim();
    const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(str);

    if (!match) return null;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function computeDurationMinutes(departureTime, arrivalTime) {
    const dep = normalizeTime(departureTime);
    const arr = normalizeTime(arrivalTime);

    if (!dep || !arr) return null;

    const [depH, depM] = dep.split(":").map(Number);
    const [arrH, arrM] = arr.split(":").map(Number);

    let diff = (arrH * 60 + arrM) - (depH * 60 + depM);
    if (diff < 0) diff += 24 * 60;   // passage de minuit

    return diff;
}

/* ------------------------------------------------------------------ */

class TgtlImportService {
    analyze = async (file) => {
        if (!file || !file.buffer) {
            throw new Error("Aucun fichier Excel reçu.");
        }

        const parsedWorkbook = await parseWorkbook(file.buffer);

        const report = validateWorkbook(parsedWorkbook);

        return {
            ...report,
            file: {
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype
            }
        };
    };

    confirm = async (file, user, meta = {}) => {
        if (!file?.buffer) {
            throw new ApiError(400, "Aucun fichier Excel reçu.");
        }

        const companyId = requireUserCompany(user);

        /* ---------- 1. Ré-analyse serveur ---------- */

        const parsed = await parseWorkbook(file.buffer);
        const report = validateWorkbook(parsed);

        if (report.status === "ERROR") {
            throw new ApiError(
                422,
                "Le fichier contient des erreurs. Relancez l'analyse."
            );
        }

        const sheets = parsed.sheets;

        /* ---------- 2. Maps d'external_id ---------- */

        const prismaCityId = new Map();
        const prismaAgencyId = new Map();
        const prismaBusId = new Map();
        const prismaRouteId = new Map();
        const prismaDriverId = new Map();
        const scheduleRowById = new Map();

        /* ---------- 3. Transaction ---------- */

        const result = await repository.transaction(async (tx) => {
            const stats = {
                countries: { created: 0, updated: 0 },
                regions: { created: 0, updated: 0 },
                cities: { created: 0, updated: 0 },
                agencies: { created: 0, updated: 0 },
                buses: { created: 0, updated: 0 },
                seatLayouts: { created: 0, updated: 0 },
                seats: { created: 0, updated: 0 },
                routes: { created: 0, updated: 0 },
                drivers: { created: 0, updated: 0 },
                schedules: { created: 0, updated: 0 },
                departures: { created: 0, updated: 0 },
                invitations: { created: 0, skipped: 0 },
            };

            /* =================================================
               3.1 — Compagnie
            ================================================= */

            const companyRow = sheets.Compagnie?.data?.[0]?.data;

            if (companyRow) {
                await tx.company.update({
                    where: { id: companyId },
                    data: {
                        legalName: companyRow.legal_name || undefined,
                        registrationNumber: companyRow.registration_number || undefined,
                        taxId: companyRow.tax_id || undefined,
                        phone: companyRow.phone || undefined,
                        email: companyRow.email || undefined,
                        website: companyRow.website || undefined,
                        address: companyRow.address || undefined,
                        logo: companyRow.logo || undefined,
                    },
                });
            }

            /* =================================================
               3.2 — Villes : Country + Region + City
            ================================================= */

            for (const { data: row } of sheets.Villes?.data ?? []) {
                const countryCode = String(row.country_code ?? "").trim().toUpperCase();
                if (!countryCode) continue;

                let country = await tx.country.findUnique({
                    where: { code: countryCode },
                });

                if (!country) {
                    country = await tx.country.create({
                        data: { code: countryCode, name: countryCode, currency: "XOF" },
                    });
                    stats.countries.created++;
                }

                let regionId = null;

                if (row.region_name) {
                    const regionName = String(row.region_name).trim();

                    let region = await tx.region.findFirst({
                        where: { countryId: country.id, name: regionName },
                    });

                    if (!region) {
                        region = await tx.region.create({
                            data: { countryId: country.id, name: regionName },
                        });
                        stats.regions.created++;
                    } else {
                        stats.regions.updated++;
                    }

                    regionId = region.id;
                }

                const cityName = String(row.city_name ?? "").trim();
                if (!cityName) continue;

                const existingCity = await tx.city.findUnique({
                    where: { countryId_name: { countryId: country.id, name: cityName } },
                });

                const city = await tx.city.upsert({
                    where: { countryId_name: { countryId: country.id, name: cityName } },
                    update: {
                        regionId,
                        latitude: toFloat(row.latitude),
                        longitude: toFloat(row.longitude),
                    },
                    create: {
                        countryId: country.id,
                        regionId,
                        name: cityName,
                        latitude: toFloat(row.latitude),
                        longitude: toFloat(row.longitude),
                    },
                });

                if (existingCity) stats.cities.updated++;
                else stats.cities.created++;

                prismaCityId.set(
                    String(row.external_id).trim().toUpperCase(),
                    city.id
                );
            }

            /* =================================================
               3.3 — Agences
            ================================================= */

            for (const { data: row } of sheets.Agences?.data ?? []) {
                const extId = String(row.external_id).trim().toUpperCase();
                const cityExtId = String(row.city_external_id ?? "").trim().toUpperCase();
                const cityId = prismaCityId.get(cityExtId);

                if (!cityId) {
                    throw new ApiError(
                        422,
                        `Agence "${extId}" : ville "${cityExtId}" introuvable.`
                    );
                }

                const name = String(row.name).trim();

                const existing = await tx.agency.findUnique({
                    where: { companyId_name: { companyId, name } },
                });

                const agency = await tx.agency.upsert({
                    where: { companyId_name: { companyId, name } },
                    update: {
                        cityId,
                        address: row.address || null,
                        phone: row.phone || null,
                        status: row.status || "ACTIVE",
                    },
                    create: {
                        companyId,
                        cityId,
                        name,
                        address: row.address || null,
                        phone: row.phone || null,
                        status: row.status || "ACTIVE",
                    },
                });

                if (existing) stats.agencies.updated++;
                else stats.agencies.created++;

                prismaAgencyId.set(extId, agency.id);
            }

            /* =================================================
               3.4 — Bus + SeatLayout + Seats
            ================================================= */

            for (const { data: row } of sheets.Bus?.data ?? []) {
                const extId = String(row.external_id).trim().toUpperCase();
                const registrationNumber = String(row.registration_number).trim();

                const existingBus = await tx.bus.findUnique({
                    where: {
                        companyId_registrationNumber: { companyId, registrationNumber },
                    },
                });

                const bus = await tx.bus.upsert({
                    where: {
                        companyId_registrationNumber: { companyId, registrationNumber },
                    },
                    update: {
                        fleetNumber: row.fleet_number || null,
                        name: row.name || null,
                        brand: row.brand_name || null,
                        capacity: toInt(row.capacity) ?? 0,
                        status: row.status || "ACTIVE",
                        amenities: splitList(row.amenities),
                    },
                    create: {
                        companyId,
                        registrationNumber,
                        fleetNumber: row.fleet_number || null,
                        name: row.name || null,
                        brand: row.brand_name || null,
                        capacity: toInt(row.capacity) ?? 0,
                        status: row.status || "ACTIVE",
                        amenities: splitList(row.amenities),
                    },
                });

                if (existingBus) stats.buses.updated++;
                else stats.buses.created++;

                prismaBusId.set(extId, bus.id);

                if (row.seat_layout_type) {
                    const existingLayout = await tx.seatLayout.findUnique({
                        where: { busId: bus.id },
                    });

                    const layout = await tx.seatLayout.upsert({
                        where: { busId: bus.id },
                        update: {
                            name: `${bus.name ?? "Bus"} layout`,
                            type: String(row.seat_layout_type).toUpperCase(),
                            rows: toInt(row.seat_layout_rows) ?? 0,
                            columns: toInt(row.seat_layout_columns) ?? 0,
                        },
                        create: {
                            busId: bus.id,
                            name: `${bus.name ?? "Bus"} layout`,
                            type: String(row.seat_layout_type).toUpperCase(),
                            rows: toInt(row.seat_layout_rows) ?? 0,
                            columns: toInt(row.seat_layout_columns) ?? 0,
                        },
                    });

                    if (existingLayout) stats.seatLayouts.updated++;
                    else stats.seatLayouts.created++;

                    const seatRows = (sheets.Plans_Sieges?.data ?? []).filter(
                        ({ data }) =>
                            String(data.bus_external_id).trim().toUpperCase() === extId
                    );

                    if (seatRows.length > 0) {
                        // Remplacement complet : on supprime puis recrée
                        await tx.seat.deleteMany({ where: { layoutId: layout.id } });

                        await tx.seat.createMany({
                            data: seatRows.map(({ data: seat }) => ({
                                layoutId: layout.id,
                                number: String(seat.seat_number).trim(),
                                row: toInt(seat.row_number),
                                column: toInt(seat.column_number),
                                position: seat.position
                                    ? String(seat.position).toUpperCase()
                                    : null,
                                status: seat.status || "ACTIVE",
                            })),
                        });

                        stats.seats.created += seatRows.length;
                    }
                }
            }

            /* =================================================
   3.4bis — Chauffeurs
================================================= */

            for (const { data: row } of sheets.Chauffeurs?.data ?? []) {
                const extId = String(row.external_id).trim().toUpperCase();
                const firstName = String(row.first_name ?? "").trim();
                const lastName = String(row.last_name ?? "").trim();

                if (!firstName || !lastName) continue;

                const fullName = `${firstName} ${lastName}`;
                const licenseNumber = row.license_number
                    ? String(row.license_number).trim()
                    : null;

                // Unicité : (companyId, licenseNumber) si fourni, sinon (companyId, phone) ou (companyId, fullName)
                let existing = null;

                if (licenseNumber) {
                    existing = await tx.driver.findUnique({
                        where: { companyId_licenseNumber: { companyId, licenseNumber } },
                    });
                } else if (row.phone) {
                    existing = await tx.driver.findFirst({
                        where: { companyId, phone: String(row.phone).trim() },
                    });
                } else {
                    existing = await tx.driver.findFirst({
                        where: { companyId, fullName },
                    });
                }

                let driver;

                if (existing) {
                    driver = await tx.driver.update({
                        where: { id: existing.id },
                        data: {
                            firstName,
                            lastName,
                            fullName,
                            phone: row.phone ? String(row.phone).trim() : null,
                            email: row.email ? String(row.email).trim() : null,
                            licenseNumber,
                            licenseCategory: row.license_category
                                ? String(row.license_category).toUpperCase()
                                : null,
                            status: row.status || "ACTIVE",
                        },
                    });
                    stats.drivers.updated++;
                } else {
                    driver = await tx.driver.create({
                        data: {
                            companyId,
                            firstName,
                            lastName,
                            fullName,
                            phone: row.phone ? String(row.phone).trim() : null,
                            email: row.email ? String(row.email).trim() : null,
                            licenseNumber,
                            licenseCategory: row.license_category
                                ? String(row.license_category).toUpperCase()
                                : null,
                            status: row.status || "ACTIVE",
                        },
                    });
                    stats.drivers.created++;
                }

                prismaDriverId.set(extId, driver.id);
            }

            /* =================================================
               3.5 — Routes
            ================================================= */

            for (const { data: row } of sheets.Lignes?.data ?? []) {
                const extId = String(row.external_id).trim().toUpperCase();
                const originCityId = prismaCityId.get(
                    String(row.origin_city_external_id).trim().toUpperCase()
                );
                const destinationCityId = prismaCityId.get(
                    String(row.destination_city_external_id).trim().toUpperCase()
                );

                if (!originCityId || !destinationCityId) {
                    throw new ApiError(422, `Ligne "${extId}" : villes introuvables.`);
                }

                const existing = await tx.route.findUnique({
                    where: {
                        companyId_originCityId_destinationCityId: {
                            companyId, originCityId, destinationCityId,
                        },
                    },
                });

                const route = await tx.route.upsert({
                    where: {
                        companyId_originCityId_destinationCityId: {
                            companyId, originCityId, destinationCityId,
                        },
                    },
                    update: {
                        basePrice: toInt(row.base_price) ?? 0,
                        distanceKm: toFloat(row.distance) ?? 0,
                        durationMin: toInt(row.duration) ?? 0,
                        active: toBool(row.active) ?? true,
                    },
                    create: {
                        companyId,
                        originCityId,
                        destinationCityId,
                        basePrice: toInt(row.base_price) ?? 0,
                        distanceKm: toFloat(row.distance) ?? 0,
                        durationMin: toInt(row.duration) ?? 0,
                        active: toBool(row.active) ?? true,
                    },
                });

                if (existing) stats.routes.updated++;
                else stats.routes.created++;

                prismaRouteId.set(extId, route.id);
            }

            /* =================================================
               3.6 — Programmations + Départs
            ================================================= */

            for (const { data: row } of sheets.Programmations?.data ?? []) {
                const extId = String(row.external_id).trim().toUpperCase();
                const routeId = prismaRouteId.get(
                    String(row.route_external_id).trim().toUpperCase()
                );
                const departureAgencyId = prismaAgencyId.get(
                    String(row.departure_agency_external_id).trim().toUpperCase()
                );
                const arrivalAgencyId = prismaAgencyId.get(
                    String(row.arrival_agency_external_id).trim().toUpperCase()
                );

                if (!routeId || !departureAgencyId || !arrivalAgencyId) {
                    throw new ApiError(
                        422,
                        `Programmation "${extId}" : références introuvables.`
                    );
                }

                const durationMinutes = computeDurationMinutes(
                    row.departure_time,
                    row.arrival_time
                );

                const startDate = toDate(row.start_date);

                const existing = await tx.schedule.findUnique({
                    where: {
                        companyId_routeId_departureAgencyId_arrivalAgencyId_startDate: {
                            companyId,
                            routeId,
                            departureAgencyId,
                            arrivalAgencyId,
                            startDate,
                        },
                    },
                });

                const schedule = await tx.schedule.upsert({
                    where: {
                        companyId_routeId_departureAgencyId_arrivalAgencyId_startDate: {
                            companyId,
                            routeId,
                            departureAgencyId,
                            arrivalAgencyId,
                            startDate,
                        },
                    },
                    update: {
                        price: toInt(row.price) ?? 0,
                        durationMinutes: durationMinutes,
                        daysOfWeek: splitList(row.days_of_week).map((d) => d.toUpperCase()),
                        endDate: toDate(row.end_date),
                        active: toBool(row.active) ?? true,
                        autoGenerate: toBool(row.auto_generate) ?? true,
                    },
                    create: {
                        companyId,
                        routeId,
                        departureAgencyId,
                        arrivalAgencyId,
                        price: toInt(row.price) ?? 0,
                        durationMinutes: durationMinutes,
                        daysOfWeek: splitList(row.days_of_week).map((d) => d.toUpperCase()),
                        startDate,
                        endDate: toDate(row.end_date),
                        active: toBool(row.active) ?? true,
                        autoGenerate: toBool(row.auto_generate) ?? true,
                    },
                });

                if (existing) stats.schedules.updated++;
                else stats.schedules.created++;

                scheduleRowById.set(extId, schedule.id);

                /* ---------- Départ intégré (format V1) ---------- */

                const busExtId = String(row.bus_external_id ?? "").trim().toUpperCase();
                const busId = prismaBusId.get(busExtId);

                if (busId && row.departure_time) {
                    const departureTime = normalizeTime(row.departure_time);

                    const existingDeparture = await tx.scheduleDeparture.findUnique({
                        where: {
                            scheduleId_departureTime_busId: {
                                scheduleId: schedule.id,
                                departureTime,
                                busId,
                            },
                        },
                    });

                    /* ---------- Résolution du chauffeur ---------- */

                    const driverExtId = String(row.driver_external_id ?? "").trim().toUpperCase();
                    const driverId = driverExtId ? prismaDriverId.get(driverExtId) : null;

                    if (driverExtId && !driverId) {
                        throw new ApiError(
                            422,
                            `Programmation "${extId}" : chauffeur "${driverExtId}" introuvable.`
                        );
                    }

                    await tx.scheduleDeparture.upsert({
                        where: {
                            scheduleId_departureTime_busId: {
                                scheduleId: schedule.id,
                                departureTime,
                                busId,
                            },
                        },
                        update: {
                            active: toBool(row.status === "ACTIVE") ?? true,
                            driverId,                         // ← ajout
                        },
                        create: {
                            scheduleId: schedule.id,
                            busId,
                            departureTime,
                            active: toBool(row.status === "ACTIVE") ?? true,
                            driverId,                         // ← ajout
                        },
                    });

                    if (existingDeparture) stats.departures.updated++;
                    else stats.departures.created++;
                } else if (busExtId) {
                    // Le bus est référencé mais introuvable → erreur explicite
                    throw new ApiError(
                        422,
                        `Programmation "${extId}" : bus "${busExtId}" introuvable.`
                    );
                }
            }

            for (const { data: row } of sheets.Departs?.data ?? []) {
                const scheduleId = scheduleRowById.get(
                    String(row.schedule_external_id).trim().toUpperCase()
                );
                const busId = prismaBusId.get(
                    String(row.bus_external_id).trim().toUpperCase()
                );

                if (!scheduleId || !busId) continue;

                const departureTime = normalizeTime(row.departure_time);

                const existing = await tx.scheduleDeparture.findUnique({
                    where: {
                        scheduleId_departureTime_busId: {
                            scheduleId,
                            departureTime,
                            busId,
                        },
                    },
                });

                await tx.scheduleDeparture.upsert({
                    where: {
                        scheduleId_departureTime_busId: {
                            scheduleId,
                            departureTime,
                            busId,
                        },
                    },
                    update: { active: toBool(row.active) ?? true },
                    create: {
                        scheduleId,
                        busId,
                        departureTime,
                        active: toBool(row.active) ?? true,
                    },
                });

                if (existing) stats.departures.updated++;
                else stats.departures.created++;
            }

            /* =================================================
               3.7 — Personnel : invitations
            ================================================= */

            for (const { data: row } of sheets.Personnel?.data ?? []) {
                const phone = String(row.phone ?? "").trim();
                if (!phone) continue;

                const existing = await tx.user.findUnique({ where: { phone } });

                if (existing) {
                    stats.invitations.skipped++;
                    continue;
                }

                const agencyId = row.agency_external_id
                    ? prismaAgencyId.get(String(row.agency_external_id).trim().toUpperCase())
                    : null;

                const token = crypto.randomBytes(32).toString("hex");
                const tokenHash = crypto
                    .createHash("sha256")
                    .update(token)
                    .digest("hex");

                await tx.companyInvitation.create({
                    data: {
                        companyId,
                        agencyId,
                        email: row.email || null,
                        phone,
                        role: String(row.role).toUpperCase(),
                        tokenHash,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        invitedById: user.id,
                    },
                });

                stats.invitations.created++;
            }

            /* =================================================
               3.8 — Totaux réels en base (dans la transaction)
            ================================================= */

            const totals = {
                agencies: await tx.agency.count({ where: { companyId } }),
                buses: await tx.bus.count({ where: { companyId } }),
                routes: await tx.route.count({ where: { companyId } }),
                schedules: await tx.schedule.count({ where: { companyId } }),
                drivers: await tx.driver.count({ where: { companyId } }),   // ← ajout
                staff: await tx.user.count({ where: { companyId } }),
            };

            return { stats, totals };
        });

        /* ---------- 4. État de l'intégration ---------- */

        const { stats, totals } = result;

        await tgtlRepository.upsert(companyId, {
            lastSyncAt: new Date(),
            lastSyncType: "import",
            lastSyncVersion: "1.2",
            resourcesImported:
                totals.agencies +
                totals.buses +
                totals.routes +
                totals.schedules +
                totals.drivers,                                         // ← ajout
            agenciesCount: totals.agencies,
            busesCount: totals.buses,
            routesCount: totals.routes,
            schedulesCount: totals.schedules,
            driversCount: totals.drivers,                               // ← ajout (si la colonne existe)
            staffCount: totals.staff,
        });

        return {
            status: "SUCCESS",
            companyId,
            stats,
            totals,
            file: {
                originalName: file.originalname,
                size: file.size,
            },
        };
    };
};

module.exports = new TgtlImportService();