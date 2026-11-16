import React from 'react';
import '../../styles/components/ui/FloatingActionButton.scss';

export default function FloatingActionButton({
    icon: Icon,
    onClick,
    color = "#2563eb",
    size = "medium",
    shape = "circle",
    position = "bottom-right",
    title,
    children,
}) {
    return (
        <button
            type="button"
            className={`
                floating-button
                floating-button--${size}
                floating-button--${shape}
                floating-button--${position}
            `}
            style={{ backgroundColor: color }}
            onClick={onClick}
            aria-label={title}
            title={title}
        >
            {Icon && (
                <Icon
                    size={
                        size === "small"
                            ? 18
                            : size === "large"
                                ? 28
                                : 22
                    }
                />
            )}

            {children && (
                <span className="floating-button__label">
                    {children}
                </span>
            )}
        </button>
    );
}