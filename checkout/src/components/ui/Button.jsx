import React from 'react';
import '../../styles/components/ui/Button.scss';

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    ...rest
}) {
    // Construction des classes
    const buttonClasses = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        disabled && 'btn-disabled',
        loading && 'btn-loading',
        fullWidth && 'btn-full-width',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            {...rest}
        >
            <span className="btn-content">{children}</span>
        </button>
    );
} 