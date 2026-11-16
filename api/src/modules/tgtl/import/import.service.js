const crypto = require("crypto");

const ApiError = require("../../../utils/ApiError");
const { parseWorkbook } = require("./import.parser");
const { validateWorkbook } = require("./import.validators");

const repository = require("./import.repository");

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

        /* ---------- 1. Ré-analyse serveur (jamais confiance au client) ---------- */

        const parsed = await parseWorkbook(file.buffer);
        const report = validateWorkbook(parsed);

        if (report.status === "ERROR") {
            throw new ApiError(
                422,
                "Le fichier contient des erreurs. Relancez l'analyse."
            );
        }

        const sheets = parsed.sheets;

        /* ---------- 2. Préparation des maps d'external_id ---------- */

        const citiesMap = buildIdMap(sheets.Villes?.data ?? []);
        const agenciesMap = buildIdMap(sheets.Agences?.data ?? []);
        const busesMap = buildIdMap(sheets.Bus?.data ?? []);
        const routesMap = buildIdMap(sheets.Lignes?.data ?? []);

        /* ---------- 3. Mappings Prisma : external_id → id réel ---------- */

        const prismaCityId = new Map();
        const prismaAgencyId = new Map();
        const prismaBusId = new Map();
        const prismaRouteId = new Map();

        /* ---------- 4. Transaction ---------- */

        const result = await repository.transaction(async (tx) => {
            const stats = {
                countries: 0,
                regions: 0,
                cities: 0,
                agencies: 0,
                buses: 0,
                seatLayouts: 0,
                seats: 0,
                routes: 0,
                schedules: 0,
                departures: 0,
                invitations: 0,
            };

            /* =================================================
               4.1 — Compagnie (mise à jour de celle de l'utilisateur)
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
               4.2 — Villes : Country + Region + City
            ================================================= */

            for (const { data: row } of sheets.Villes?.data ?? []) {
                const countryCode = String(row.country_code ?? "").trim().toUpperCase();
                if (!countryCode) continue;

                let country = await tx.country.findUnique({
                    where: { code: countryCode },
                });

                if (!country) {
                    country = await tx.country.create({
                        data: {
                            code: countryCode,
                            name: countryCode,
                            currency: "XOF",
                        },
                    });
                    stats.countries++;
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
                        stats.regions++;
                    }

                    regionId = region.id;
                }

                const cityName = String(row.city_name ?? "").trim();
                if (!cityName) continue;

                const city = await tx.city.upsert({
                    where: {
                        countryId_name: { countryId: country.id, name: cityName },
                    },
                    update: {},
                    create: {
                        countryId: country.id,
                        regionId,
                        name: cityName,
                        latitude: toFloat(row.latitude),
                        longitude: toFloat(row.longitude),
                    },
                });

                prismaCityId.set(
                    String(row.external_id).trim().toUpperCase(),
                    city.id
                );
                stats.cities++;
            }

            /* =================================================
               4.3 — Agences
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

                let agency = await tx.agency.findFirst({
                    where: { companyId, name: String(row.name).trim() },
                });

                if (!agency) {
                    agency = await tx.agency.create({
                        data: {
                            companyId,
                            cityId,
                            name: String(row.name).trim(),
                            address: row.address || null,
                            phone: row.phone || null,
                            status: row.status || "ACTIVE",
                        },
                    });
                    stats.agencies++;
                }

                prismaAgencyId.set(extId, agency.id);
            }

            /* =================================================
               4.4 — Bus + SeatLayout + Seats
            ================================================= */

            for (const { data: row } of sheets.Bus?.data ?? []) {
                const extId = String(row.external_id).trim().toUpperCase();

                const bus = await tx.bus.upsert({
                    where: {
                        companyId_registrationNumber: {
                            companyId,
                            registrationNumber: String(row.registration_number).trim(),
                        },
                    },
                    update: {},
                    create: {
                        companyId,
                        registrationNumber: String(row.registration_number).trim(),
                        fleetNumber: row.fleet_number || null,
                        name: row.name || null,
                        brand: row.brand_name || null,
                        capacity: toInt(row.capacity) ?? 0,
                        status: row.status || "ACTIVE",
                        amenities: splitList(row.amenities),
                    },
                });

                prismaBusId.set(extId, bus.id);
                stats.buses++;

                // SeatLayout (optionnel)
                if (row.seat_layout_type) {
                    const layout = await tx.seatLayout.upsert({
                        where: { busId: bus.id },
                        update: {},
                        create: {
                            busId: bus.id,
                            name: `${bus.name ?? "Bus"} layout`,
                            type: String(row.seat_layout_type).toUpperCase(),
                            rows: toInt(row.seat_layout_rows) ?? 0,
                            columns: toInt(row.seat_layout_columns) ?? 0,
                        },
                    });
                    stats.seatLayouts++;

                    // Seats
                    const seatRows = (sheets.Plans_Sieges?.data ?? []).filter(
                        ({ data }) =>
                            String(data.bus_external_id).trim().toUpperCase() === extId
                    );

                    if (seatRows.length > 0) {
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
                            skipDuplicates: true,
                        });
                        stats.seats += seatRows.length;
                    }
                }
            }

            /* =================================================
               4.5 — Routes
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
                    throw new ApiError(
                        422,
                        `Ligne "${extId}" : villes introuvables.`
                    );
                }

                const route = await tx.route.upsert({
                    where: {
                        companyId_originCityId_destinationCityId: {
                            companyId,
                            originCityId,
                            destinationCityId,
                        },
                    },
                    update: {},
                    create: {
                        companyId,
                        originCityId,
                        destinationCityId,
                        basePrice: toInt(row.base_price) ?? 0,
                        distanceKm: toFloat(row.distance_km),
                        durationMin: toInt(row.duration_min),
                        active: toBool(row.active) ?? true,
                    },
                });

                prismaRouteId.set(extId, route.id);
                stats.routes++;
            }

            /* =================================================
               4.6 — Programmation + Départs
            ================================================= */

            const scheduleRowById = new Map();

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

                const schedule = await tx.schedule.create({
                    data: {
                        companyId,
                        routeId,
                        departureAgencyId,
                        arrivalAgencyId,
                        price: toInt(row.price) ?? 0,
                        durationMinutes: toInt(row.duration_minutes),
                        daysOfWeek: splitList(row.days_of_week).map((d) =>
                            d.toUpperCase()
                        ),
                        startDate: toDate(row.start_date),
                        endDate: toDate(row.end_date),
                        active: toBool(row.active) ?? true,
                        autoGenerate: toBool(row.auto_generate) ?? true,
                    },
                });

                scheduleRowById.set(extId, schedule.id);
                stats.schedules++;
            }

            for (const { data: row } of sheets.Departs?.data ?? []) {
                const scheduleId = scheduleRowById.get(
                    String(row.schedule_external_id).trim().toUpperCase()
                );
                const busId = prismaBusId.get(
                    String(row.bus_external_id).trim().toUpperCase()
                );

                if (!scheduleId || !busId) continue;

                await tx.scheduleDeparture.create({
                    data: {
                        scheduleId,
                        busId,
                        departureTime: String(row.departure_time).trim(),
                        active: toBool(row.active) ?? true,
                    },
                });

                stats.departures++;
            }

            /* =================================================
               4.7 — Personnel : invitations
            ================================================= */

            for (const { data: row } of sheets.Personnel?.data ?? []) {
                const phone = String(row.phone ?? "").trim();
                if (!phone) continue;

                const existing = await tx.user.findUnique({
                    where: { phone },
                });

                if (existing) continue; // déjà inscrit

                const agencyId = row.agency_external_id
                    ? prismaAgencyId.get(
                        String(row.agency_external_id).trim().toUpperCase()
                    )
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

                stats.invitations++;

                // TODO : envoyer le lien d'invitation par SMS/email
                // await notificationService.sendInvitation({ phone, token, ... })
            }

            return stats;
        });

        /* ---------- 5. Rapport de confirmation ---------- */

        return {
            status: "SUCCESS",
            companyId,
            imported: result,
            file: {
                originalName: file.originalname,
                size: file.size,
            },
        };
    };
};

module.exports = new TgtlImportService();