import Modal from "@shared/components/ui/Modal";

import useArticleEditor from "../../hooks/useArticleEditor";
import ArticleEditor from "./ArticleEditor";

export default function CreateArticleModal({
    isOpen,
    onClose,
    onCreated,
}) {
    const {
        formData,
        errors,
        touched,
        isSubmitting,
        serverError,
        categories,
        categoriesLoading,
        onChange,
        onBlur,
        submit,
        resetForm,
    } = useArticleEditor();

    const handleSubmit = async () => {
        const result = await submit();

        if (!result.success) return;

        onCreated?.(result.data);
        resetForm();
        onClose?.();
    };

    const handleClose = () => {
        if (isSubmitting) return;
        resetForm();
        onClose?.();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Nouvel article"
            size="lg"
        >
            <ArticleEditor
                formData={formData}
                errors={errors}
                touched={touched}
                isSubmitting={isSubmitting}
                serverError={serverError}
                categories={categories}
                categoriesLoading={categoriesLoading}
                onChange={onChange}
                onBlur={onBlur}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel="Créer l'article"
            />
        </Modal>
    );
}