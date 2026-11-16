const ApiError = require('../../utils/ApiError');
const { hashPassword, CURRENT_ALGORITHM } = require('../../utils/password');
const auditService = require('../audit/audit.service');
const userRepository = require('../users/user.repository');
const repository = require('./company.repository');

class CompanyService {
    getCompanies = async (filters, user) => {
        if (user.role === 'SUPER_ADMIN') {
            return repository.findMany(filters);
        }

        if (!user.companyId) {
            throw new ApiError(
                403,
                'Aucune compagnie associée à cet utilisateur'
            );
        }

        return repository.findById(
            user.companyId
        );
    };

    getTeams = async (filters, user, meta = {}) => {
        if (!user) {
            throw new ApiError(
                401,
                "Authentification requise"
            );
        }

        const {
            status,
            role,
            search,
            page = 1,
            limit = 20
        } = filters;

        const normalizedPage = Math.max(
            Number(page) || 1,
            1
        );

        const normalizedLimit = Math.min(
            Math.max(Number(limit) || 20, 1),
            100
        );

        let companyId = null;
        let agencyId = null;

        // =====================================================
        // SUPER ADMIN
        // =====================================================

        if (user.role === "SUPER_ADMIN") {
            companyId = filters.companyId || null;
            agencyId = filters.agencyId || null;
        }

        // =====================================================
        // COMPANY ADMIN
        // =====================================================

        else if (user.role === "COMPANY_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    "Aucune compagnie associée à cet utilisateur"
                );
            }

            companyId = user.companyId;

            // Le COMPANY_ADMIN peut filtrer
            // une agence de sa propre compagnie.
            agencyId = filters.agencyId || null;
        }

        // =====================================================
        // AGENCY AGENT / CHEF DE GARE
        // =====================================================

        else if (user.role === "AGENCY_AGENT") {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    "Aucune compagnie associée à cet utilisateur"
                );
            }

            if (!user.agencyId) {
                throw new ApiError(
                    403,
                    "Aucune agence associée à cet utilisateur"
                );
            }

            companyId = user.companyId;

            // IMPORTANT :
            // on ignore complètement filters.agencyId
            agencyId = user.agencyId;
        }

        else {
            throw new ApiError(
                403,
                "Accès non autorisé"
            );
        }

        return repository.findMembers({
            companyId,
            agencyId,
            status,
            role,
            search,
            page: normalizedPage,
            limit: normalizedLimit
        });
    };

    getCompanyById = async (id, user) => {
        if (
            user.role !== 'SUPER_ADMIN' &&
            user.companyId !== id
        ) {
            throw new ApiError(
                403,
                'Vous n’avez pas accès à cette compagnie'
            );
        }

        const company = await repository.findById(id);

        if (!company) {
            throw new ApiError(
                404,
                'Compagnie introuvable'
            );
        }

        return company;
    };

    createCompany = async (data, meta = {}) => {
        if (data.registrationNumber) {
            const existingCompany =
                await repository.findByRegistrationNumber(
                    data.registrationNumber
                );

            if (existingCompany) {
                throw new ApiError(
                    409,
                    "Une compagnie avec ce numéro RCCM existe déjà"
                );
            }
        }

        const createdCompany = await repository.create({
            name: data.name,
            legalName: data.legalName || null,
            registrationNumber:
                data.registrationNumber || null,
            cityId: data.cityId,
            taxId: data.taxId,
            email: data.email || null,
            phone: data.phone,
            website: data.website || null,
            logo: data.logoUrl || null,
            address: data.address || null,
        });

        const password = "Password123!";
        const passwordHash = await hashPassword(password);

        await userRepository.create({
            firstName: createdCompany.name,
            lastName: "Admin",
            fullName: `${createdCompany.name} Admin`,
            phone: createdCompany.phone,
            email: createdCompany.email,
            role: "COMPANY_ADMIN",
            status: "ACTIVE",
            phoneVerified: true,
            companyId: createdCompany.id,
            password: {
                create: {
                    hash: passwordHash,
                    algorithm: CURRENT_ALGORITHM
                }
            }
        });

        auditService.log({
            userId: createdCompany.id,
            event: "company.create",
            ip: meta.ip,
            userAgent: meta.userAgent,
            metadata: {},
        })

        return createdCompany;
    };

    updateCompany = async (id, data) => {
        await this.getCompanyById(id);

        const updateData = {
            ...data
        };

        if (data.code !== undefined) {
            const code = data.code
                .trim()
                .toUpperCase();

            const existingCompany =
                await repository.findByCode(code);

            if (
                existingCompany &&
                existingCompany.id !== id
            ) {
                throw new ApiError(
                    409,
                    'Une compagnie avec ce code existe déjà'
                );
            }

            updateData.code = code;
        }

        return repository.update(
            id,
            updateData
        );
    };

    deactivateCompany = async (id) => {
        await this.getCompanyById(id);

        return repository.update(
            id,
            {
                status: 'INACTIVE'
            }
        );
    };
};

module.exports = new CompanyService();