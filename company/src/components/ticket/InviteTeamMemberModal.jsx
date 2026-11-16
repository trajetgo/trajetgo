import Modal from "@shared/components/ui/Modal";
import { useToast } from "@shared/contexts/toast.context";

import useInviteTeamMember from "../../hooks/useInviteTeamMember";
import useAgencies from "../../hooks/useAgencies";

import InviteTeamMemberForm from "./InviteTeamMemberForm";

export default function InviteTeamMemberModal({
    open,
    onClose,
    onInvited,
}) {
    const { showToast } = useToast();

    /* ---------- Form ---------- */

    const {
        formData,
        errors,
        touched,

        isSubmitting,
        serverError,

        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    } = useInviteTeamMember();

    /* ---------- Agences ---------- */

    const {
        agencies,
        loading: agenciesLoading,
    } = useAgencies();

    /* ---------- Submit ---------- */

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const result = await handleSubmit(e);

        if (result?.success) {
            showToast(
                "success",
                "Invitation envoyée",
                "Le membre recevra une invitation par SMS.",
                { duration: 4000 }
            );

            resetForm();
            onClose?.();
            onInvited?.(result.data);
        }
    };

    /* ---------- Reset à la fermeture ---------- */

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    /* ---------- Rendu ---------- */

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Nouveau membre d'équipe"
            size="md"
        >
            <InviteTeamMemberForm
                handleFormSubmit={handleFormSubmit}

                formData={formData}
                errors={errors}
                touched={touched}

                handleChange={handleChange}
                handleBlur={handleBlur}

                isSubmitting={isSubmitting}
                serverError={serverError}

                agencies={agencies}
                agenciesLoading={agenciesLoading}
            />
        </Modal>
    );
}