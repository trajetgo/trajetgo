import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import '../../styles/components/ui/Modal.scss';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium',
    variant = 'default',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className = '',
    ...props
}) {
    const modalRef = useRef(null);

    // Gestion ouverture / fermeture + Escape
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = 'unset';
            return;
        }

        document.body.style.overflow = 'hidden';

        const handleEscape = (e) => {
            if (e.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, closeOnEscape]);

    // Focus uniquement à l'ouverture du modal
    useEffect(() => {
        if (isOpen) {
            modalRef.current?.focus();
        }
    }, [isOpen]);

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizeClasses = {
        small: 'modal-small',
        medium: 'modal-medium',
        large: 'modal-large',
        full: 'modal-full',
    };

    const variantClasses = {
        default: 'modal-default',
        danger: 'modal-danger',
        success: 'modal-success',
        warning: 'modal-warning',
    };

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div
                ref={modalRef}
                className={`modal-content ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
                tabIndex={-1}
                {...props}
            >
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && (
                            <h2 id="modal-title" className="modal-title">
                                {title}
                            </h2>
                        )}

                        {showCloseButton && (
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={onClose}
                                aria-label="Fermer"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}