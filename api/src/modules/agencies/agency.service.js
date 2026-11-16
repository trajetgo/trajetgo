const prisma = require('../../config/database');
const ApiError = require('../../utils/ApiError');
const { hashPassword, CURRENT_ALGORITHM } = require('../../utils/password');
const companyRepository = require('../companies/company.repository');
const locationRepository = require('../locations/location.repository');
const routeRepository = require('../routes/route.repository');
const userRepository = require('../users/user.repository');
const repository = require('./agency.repository');

class AgencyService {
    getAgencies = async (filters, user) => {
        const query = {
            ...filters
        };

        if (user.role !== 'SUPER_ADMIN') {
            query.companyId = user.companyId;
        }

        return repository.findMany(query);
    };

    getAgencyById = async (id, user) => {
        const agency = await repository.findById(id);

        if (!agency) {
            throw new ApiError(
                404,
                'Agence introuvable'
            );
        }

        if (
            user.role !== 'SUPER_ADMIN' &&
            agency.companyId !== user.companyId
        ) {
            throw new ApiError(
                403,
                'Vous n’avez pas accès à cette agence'
            );
        }

        return agency;
    };

    createAgency = async (data, user) => {
        let companyId = data.companyId;

        // COMPANY_ADMIN → sa compagnie est imposée
        if (user.role !== 'SUPER_ADMIN') {
            if (!user.companyId) {
                throw new ApiError(
                    403,
                    'Aucune compagnie associée à cet utilisateur'
                );
            }

            companyId = user.companyId;
        }

        if (!companyId) {
            throw new ApiError(
                400,
                'La compagnie est obligatoire'
            );
        }

        // Vérifier la compagnie
        const company = await companyRepository.findById(
            companyId
        );

        if (!company) {
            throw new ApiError(
                404,
                'Compagnie introuvable'
            );
        }

        if (company.status !== 'ACTIVE') {
            throw new ApiError(
                400,
                'Impossible de créer une agence pour une compagnie inactive'
            );
        }

        // Vérifier la ville si fournie
        if (data.cityId) {
            const city = await locationRepository.findCityById(
                data.cityId
            );

            if (!city) {
                throw new ApiError(
                    404,
                    'Ville introuvable'
                );
            }
        }

        const createdAgency = await repository.create({
            ...data,
            companyId,
        });

        const password = "Password123!";
        const passwordHash = await hashPassword(password);

        await userRepository.create({
            firstName: createdAgency.name,
            lastName: "Agent",
            fullName: `${createdAgency.name} Agent`,
            phone: createdAgency.phone,
            email: createdAgency.email,
            role: "AGENCY_AGENT",
            status: "INVITED",
            phoneVerified: true,
            companyId: createdAgency.companyId,
            agencyId: createdAgency.id,
            password: {
                create: {
                    hash: passwordHash,
                    algorithm: CURRENT_ALGORITHM
                }
            }
        })
    };

    updateAgency = async (id, data, user) => {
        const agency =
            await this.getAgencyById(id, user);

        const updateData = {
            ...data
        };

        if (data.code !== undefined) {
            const code = data.code
                .trim()
                .toUpperCase();

            const existingAgency =
                await repository.findByCode(
                    agency.companyId,
                    code
                );

            if (
                existingAgency &&
                existingAgency.id !== id
            ) {
                throw new ApiError(
                    409,
                    'Une agence avec ce code existe déjà pour cette compagnie'
                );
            }

            updateData.code = code;
        }

        return repository.update(
            id,
            updateData
        );
    };

    activateAgency = async (id, user) => {
        await this.getAgencyById(id, user);

        return repository.update(
            id,
            {
                status: 'ACTIVE'
            }
        );
    };

    deactivateAgency = async (id, user) => {
        await this.getAgencyById(id, user);

        return repository.update(
            id,
            {
                status: 'INACTIVE'
            }
        );
    };

    closeAgency = async (id, user) => {
        await this.getAgencyById(id, user);

        return repository.update(
            id,
            {
                status: 'CLOSED'
            }
        );
    };
};

module.exports = new AgencyService();