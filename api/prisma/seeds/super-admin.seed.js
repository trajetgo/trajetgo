const { logSeed, prisma, logSuccess } = require("./helpers");
const { hashPassword, CURRENT_ALGORITHM } = require('../../src/utils/password');

const superAdminSeed = async () => {
    logSeed('Seed SUPER ADMIN');


    /*
     * Mot de passe de développement uniquement.
     *
     * Ne jamais utiliser ce mot de passe
     * pour un environnement de production.
     */
    const password = 'Password123!';

    const passwordHash = await hashPassword(password);

    const data = {
        key: 'super-admin',

        firstName: 'Péniel',
        lastName: 'Nicolas',

        phone: '+2250700000100',
        email: 'superadmin@trajetgo.test',

        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        phoneVerified: true,

        companyId: null,
        agencyId: null
    };

    const user = await prisma.user.upsert({
        where: {
            phone: data.phone
        },

        update: {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: {
                create: { hash: passwordHash, algorithm: CURRENT_ALGORITHM },
            },
            role: data.role,
            status: data.status,
            phoneVerified: data.phoneVerified,
            companyId: data.companyId,
            agencyId: data.agencyId
        },

        create: {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
            email: data.email,
            password: {
                create: { hash: passwordHash, algorithm: CURRENT_ALGORITHM },
            },
            role: data.role,
            status: data.status,
            phoneVerified: data.phoneVerified,
            companyId: data.companyId,
            agencyId: data.agencyId
        }
    });

    logSuccess(
        `${user.role} → ${user.firstName} ${user.lastName}`
    );

    return user;
};

module.exports = superAdminSeed;