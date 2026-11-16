
const {
    prisma,
    logSeed,
    logSuccess
} = require('./helpers');
const { hashPassword } = require('../../src/utils/password');

const seedUsers = async (companies, agencies) => {
    logSeed('Seed users');

    /*
     * Mot de passe de développement uniquement.
     *
     * Ne jamais utiliser ce mot de passe
     * pour un environnement de production.
     */
    const password = 'Password123!';

    const passwordHash = await hashPassword(password);

    /*
     * Récupération des agences nécessaires.
     */
    const utbAdjamé = agencies[
        `${companies.UTB.id}_ADJ`
    ];

    const utbYamoussoukro = agencies[
        `${companies.UTB.id}_YAM`
    ];

    /*
     * Données utilisateurs.
     */
    const usersData = [
        {
            key: 'superAdmin',

            firstName: 'Super',
            lastName: 'Admin',

            phone: '+2250700000100',
            email: 'superadmin@trajetgo.test',

            role: 'SUPER_ADMIN',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: null,
            agencyId: null
        },

        {
            key: 'utbAdmin',

            firstName: 'Admin',
            lastName: 'UTB',

            phone: '+2250700000101',
            email: 'admin.utb@trajetgo.test',

            role: 'COMPANY_ADMIN',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: companies.UTB.id,
            agencyId: null
        },

        {
            key: 'stcAdmin',

            firstName: 'Admin',
            lastName: 'STC',

            phone: '+2250700000102',
            email: 'admin.stc@trajetgo.test',

            role: 'COMPANY_ADMIN',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: companies.STC.id,
            agencyId: null
        },

        {
            key: 'utbAgentAdjamé',

            firstName: 'Agent',
            lastName: 'Adjamé',

            phone: '+2250700000110',
            email: 'agent.adjame@trajetgo.test',

            role: 'AGENCY_AGENT',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: companies.UTB.id,
            agencyId: utbAdjamé.id
        },

        {
            key: 'utbAgentYamoussoukro',

            firstName: 'Agent',
            lastName: 'Yamoussoukro',

            phone: '+2250700000111',
            email: 'agent.yamoussoukro@trajetgo.test',

            role: 'AGENCY_AGENT',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: companies.UTB.id,
            agencyId: utbYamoussoukro.id
        },

        {
            key: 'utbController',

            firstName: 'Contrôleur',
            lastName: 'UTB',

            phone: '+2250700000120',
            email: 'controller.utb@trajetgo.test',

            role: 'CONTROLLER',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: companies.UTB.id,
            agencyId: null
        },

        {
            key: 'passengerOne',

            firstName: 'Jean',
            lastName: 'Kouassi',

            phone: '+2250700000130',
            email: 'jean.kouassi@trajetgo.test',

            role: 'PASSENGER',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: null,
            agencyId: null
        },

        {
            key: 'passengerTwo',

            firstName: 'Marie',
            lastName: 'Konan',

            phone: '+2250700000131',
            email: 'marie.konan@trajetgo.test',

            role: 'PASSENGER',
            status: 'ACTIVE',
            phoneVerified: true,

            companyId: null,
            agencyId: null
        }
    ];

    const users = {};

    for (const data of usersData) {
        const user = await prisma.user.upsert({
            where: {
                phone: data.phone
            },

            update: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: passwordHash,
                role: data.role,
                status: data.status,
                phoneVerified: data.phoneVerified,
                companyId: data.companyId,
                agencyId: data.agencyId
            },

            create: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                password: passwordHash,
                role: data.role,
                status: data.status,
                phoneVerified: data.phoneVerified,
                companyId: data.companyId,
                agencyId: data.agencyId
            }
        });

        users[data.key] = user;

        logSuccess(
            `${user.role} → ${user.firstName} ${user.lastName}`
        );
    }

    return users;
};

module.exports = seedUsers;