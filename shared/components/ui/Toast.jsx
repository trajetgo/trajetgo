import React, { useEffect, useState } from 'react';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react';
import '../../styles/components/ui/Toast.scss';


// Icônes par type
const ICONS = {
    success: CircleCheck,
    error: CircleX,
    warning: TriangleAlert,
    info: Info,
};


export default function Toast({
    type = 'info',
    message,
    show,
    onClose,
    duration = 3000,
    title = '',
    position = 'top-right',
}) {
    const [progress, setProgress] = useState(100);

    const IconComponent = ICONS[type] || ICONS.info;

    useEffect(() => {
        if (show) {
            let interval = null;

            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(duration - elapsedTime, 0);
                setProgress((remainingTime / duration) * 100);

                if (remainingTime <= 0) {
                    clearInterval(interval);
                    onClose();
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [show, onClose, duration]);

    // Gérer la fermeture
    const handleClose = () => onClose();

    if (!show) return null;


    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <span className="toast-icon">
                    <IconComponent size={24} />
                </span>

                <div className="toast-body">
                    {title && <div className="toast-title">{title}</div>}
                    <div className="toast-message">{message}</div>
                </div>

                <button
                    className="toast-close"
                    onClick={handleClose}
                    aria-label="Fermer la notification"
                >
                    <X size={18} />
                </button>

            </div>

            {duration > 0 && (
                <div className="toast-progress">
                    <div
                        className="toast-progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    )
}
