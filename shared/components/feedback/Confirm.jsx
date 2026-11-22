import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ActivityIndicator from '../ui/ActivityIndicator';
import '../../styles/components/feedback/Confirm.scss';

export default function Confirm({
    open,
    title = 'Confirmation',
    message = 'Êtes-vous sûr de vouloir continuer ?',
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    confirmVariant = 'danger',
    loading = false,
    onConfirm,
    onClose,
}) {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={title}
            size="small"
        >
            <div className="confirm-modal">
                <div className="confirm-modal__icon">
                    <AlertTriangle size={28} />
                </div>

                <p className="confirm-modal__message">
                    {message}
                </p>

                <div className="confirm-modal__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        type="button"
                        variant={confirmVariant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {loading && <ActivityIndicator color="white" type="digital" size={16} />}
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
