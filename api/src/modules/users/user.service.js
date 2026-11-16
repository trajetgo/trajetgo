const ApiError = require("../../utils/ApiError");
const authRepository = require("../auth/auth.repository");
const repository = require("./user.repository");

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const USER_ROLES = [
    "PASSENGER",
    "COMPANY_ADMIN",
    "AGENCY_AGENT",
    "CONTROLLER",
];

const USER_STATUSES = [
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
    "INVITED",
];

/* =========================================================
   Transitions autorisées
========================================================= */

const ALLOWED_STATUS_TRANSITIONS = {
    ACTIVE: ["INACTIVE", "SUSPENDED"],
    INACTIVE: ["ACTIVE", "SUSPENDED"],
    SUSPENDED: ["ACTIVE"],
    INVITED: ["ACTIVE", "INACTIVE"],
};

/* ------------------------------------------------------------------ */

class UserService {

    getUser = async (userId) => {
        return await repository.findById(userId);
    }

    /* =========================================================
       LIST
    ========================================================= */

    getUsers = async (filters, user, meta = {}) => {
        /* ---------- Multi-tenant ---------- */

        let companyId = null;
        let agencyId = null;

        if (user.role === "SUPER_ADMIN") {
            companyId = filters.companyId ?? null;
        } else if (user.role === "COMPANY_ADMIN") {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée.");
            }
            companyId = user.companyId;
        } else if (user.role === "AGENCY_AGENT") {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée.");
            }
            if (!user.agencyId) {
                throw new ApiError(403, "Aucune agence associée.");
            }
            companyId = user.companyId;
            agencyId = user.agencyId;
        } else {
            throw new ApiError(403, "Accès interdit.");
        }

        /* ---------- Pagination ---------- */

        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
        const skip = (page - 1) * limit;

        /* ---------- Repository ---------- */

        const { items, total } = await repository.findMany({
            companyId,
            agencyId,
            role: filters.role ?? null,
            status: filters.status ?? null,
            search: filters.search ?? null,
            skip,
            take: limit,
            sortBy: filters.sortBy ?? "createdAt",
            sortOrder: filters.sortOrder ?? "desc",
        });

        /* ---------- DTO ---------- */

        const users = items.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            fullName: `${u.firstName} ${u.lastName}`,
            email: u.email ?? null,
            phone: u.phone,

            role: u.role,
            status: u.status,

            company: u.company
                ? { id: u.company.id, name: u.company.name }
                : null,
            agency: u.agency
                ? { id: u.agency.id, name: u.agency.name }
                : null,

            createdAt: u.createdAt,
        }));

        /* ---------- Retour ---------- */

        return {
            items: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        };
    };

    /* =========================================================
       UPDATE STATUS
    ========================================================= */

    updateStatus = async ({ id }, { status }, user) => {
        /* ---------- Validation ---------- */

        if (!USER_STATUSES.includes(status)) {
            throw new ApiError(400, "Statut invalide.");
        }

        /* ---------- Fetch ---------- */

        const target = await repository.findById(id);

        if (!target) {
            throw new ApiError(404, "Utilisateur introuvable.");
        }

        /* ---------- Autorisation ---------- */

        this.ensureUserAccess(target, user);

        /* ---------- Transition autorisée ---------- */

        const allowed = ALLOWED_STATUS_TRANSITIONS[target.status] ?? [];

        if (!allowed.includes(status)) {
            throw new ApiError(
                400,
                `Transition ${target.status} → ${status} non autorisée.`
            );
        }

        /* ✅ Si suspension ou désactivation → révoquer toutes les sessions */
        if (["SUSPENDED", "INACTIVE"].includes(status)) {
            await authRepository.revokeSessions(id);
        }

        /* ---------- Update ---------- */

        return repository.updateStatus(id, status);
    };

    /* =========================================================
       UPDATE ROLE
    ========================================================= */

    updateRole = async ({ id }, { role }, user) => {
        /* ---------- Validation ---------- */

        if (!USER_ROLES.includes(role)) {
            throw new ApiError(400, "Rôle invalide.");
        }

        /* ---------- Fetch ---------- */

        const target = await repository.findById(id);

        if (!target) {
            throw new ApiError(404, "Utilisateur introuvable.");
        }

        /* ---------- Autorisation ---------- */

        this.ensureUserAccess(target, user);

        /* ---------- Seul un SUPER_ADMIN peut modifier les rôles sensibles ---------- */

        if (
            user.role !== "SUPER_ADMIN" &&
            ["COMPANY_ADMIN", "SUPER_ADMIN"].includes(role)
        ) {
            throw new ApiError(
                403,
                "Seul un super administrateur peut attribuer ce rôle."
            );
        }

        /* ---------- Update ---------- */

        return repository.updateRole(id, role);
    };

    inviteUser = async (data, user) => {
        const { firstName, lastName, phone, email, role, agencyId } = data;

        /* =========================================================
           1. Multi-tenant
        ========================================================= */

        let companyId;

        if (user.role === "SUPER_ADMIN") {
            companyId = data.companyId ?? null;
        } else {
            if (!user.companyId) {
                throw new ApiError(403, "Aucune compagnie associée.");
            }
            companyId = user.companyId;
        }

        if (!companyId) {
            throw new ApiError(400, "La compagnie est obligatoire.");
        }

        /* =========================================================
           2. Validation de l'agence
        ========================================================= */

        if (role !== "COMPANY_ADMIN") {
            const agency = await agencyRepository.findById(agencyId);

            if (!agency) {
                throw new ApiError(404, "Agence introuvable.");
            }

            if (agency.companyId !== companyId) {
                throw new ApiError(
                    400,
                    "L'agence n'appartient pas à votre compagnie."
                );
            }

            if (agency.status !== "ACTIVE") {
                throw new ApiError(400, "L'agence doit être active.");
            }
        }

        /* =========================================================
           3. Unicité téléphone / email
        ========================================================= */

        const existingPhone = await repository.findByPhone(phone);
        if (existingPhone) {
            throw new ApiError(409, "Ce numéro est déjà utilisé.");
        }

        if (email) {
            const existingEmail = await repository.findByEmail(email);
            if (existingEmail) {
                throw new ApiError(409, "Cet email est déjà utilisé.");
            }
        }

        /* =========================================================
           4. Création du compte (statut INVITED)
        ========================================================= */

        // Mot de passe temporaire aléatoire (le user devra le changer)
        const tempPassword = crypto.randomBytes(24).toString("hex");
        const passwordHash = await bcrypt.hash(tempPassword, 12);

        // Token d'invitation (JWT ou random)
        const inviteToken = crypto.randomBytes(32).toString("hex");
        const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

        const newUser = await repository.create({
            firstName,
            lastName,
            phone,
            email: email ?? null,
            password: passwordHash,
            role,
            status: "INVITED",
            companyId,
            agencyId: role === "COMPANY_ADMIN" ? null : agencyId,
            inviteToken,
            inviteExpiresAt,
        });

        /* =========================================================
           5. Envoi du SMS
        ========================================================= */

        const inviteUrl = `${process.env.PASSENGER_URL}/accept-invite?token=${inviteToken}`;

        const message = `Bonjour ${firstName}, vous êtes invité(e) à rejoindre Trajet Go en tant que ${getRoleLabel(role)}. Activez votre compte : ${inviteUrl} (valable 7 jours).`;

        try {
            await smsService.send({
                to: phone,
                message,
            });
        } catch (err) {
            console.error("[inviteUser] SMS send failed:", err.message);
            // ⚠️ On ne throw pas : l'utilisateur est créé, on peut renvoyer le SMS plus tard
        }

        /* =========================================================
           6. DTO
        ========================================================= */

        return {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phone: newUser.phone,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            inviteUrl,       // ✅ utile en dev pour tester
            expiresAt: inviteExpiresAt,
        };
    };

    updateProfile = async (data, userId, meta = {}) => {
        const { firstName, lastName } = data;

        const user = await this.getUser(userId);

        if (["INACTIVE", "SUSPENDED"].includes(user.status)) {
            return new ApiError(
                401,
                "Compte inactif ou suspendu"
            )
        }

        return repository.updateProfile({
            id: userId,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            updatedAt: new Date(),
        });
    }

    getSessions = async (userId, meta = {}) => {
        const user = await this.getUser(userId);

        if (["INACTIVE", "SUSPENDED"].includes(user.status)) {
            return new ApiError(
                401,
                "Compte inactif ou suspendu"
            )
        }

        return await repository.findSessions(userId);
    }

    /* =========================================================
       HELPERS
    ========================================================= */

    /**
     * Vérifie que l'utilisateur cible appartient au même tenant
     * que l'utilisateur courant.
     */
    ensureUserAccess = (target, user) => {
        if (user.role === "SUPER_ADMIN") return;

        if (!user.companyId) {
            throw new ApiError(403, "Aucune compagnie associée.");
        }

        if (target.companyId !== user.companyId) {
            throw new ApiError(
                403,
                "Cet utilisateur n'appartient pas à votre compagnie."
            );
        }

        /* Un AGENCY_AGENT ne peut modifier que son agence */
        if (user.role === "AGENCY_AGENT") {
            if (!user.agencyId) {
                throw new ApiError(403, "Aucune agence associée.");
            }

            if (target.agencyId !== user.agencyId) {
                throw new ApiError(
                    403,
                    "Cet utilisateur n'appartient pas à votre agence."
                );
            }
        }
    };

}

module.exports = new UserService();