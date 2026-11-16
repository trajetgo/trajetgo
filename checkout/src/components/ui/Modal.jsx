import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import '../../styles/components/ui/Modal.scss';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium', // 'small' | 'medium' | 'large' | 'full'
    variant = 'default', // 'default' | 'danger' | 'success' | 'warning'
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className = '',
    ...props
}) {
    const modalRef = useRef(null);

    // Close the modal when the Escape key is pressed
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
            // Focus trap
            modalRef.current?.focus();
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, closeOnEscape]);

    // Handle overlay click
    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    // Render nothing if the modal is hidden
    if (!isOpen) return null;

    // Size classes
    const sizeClasses = {
        small: 'modal-small',
        medium: 'modal-medium',
        large: 'modal-large',
        full: 'modal-full',
    };

    // Variant classes
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
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && (
                            <h2 id="modal-title" className="modal-title">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                className="modal-close-btn"
                                onClick={onClose}
                                aria-label="Fermer"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="modal-body">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}