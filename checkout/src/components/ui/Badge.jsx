import React from 'react';
import '../../styles/components/ui/Badge.scss';

export default function Badge({
    children,
    variant = 'primary', // 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light'
    size = 'medium', // 'small' | 'medium' | 'large'
    rounded = false,
    outline = false,
    dot = false,
    className = '',
    icon = null,
    onClick = null,
    ...props
}) {
    const badgeClasses = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        rounded ? 'badge-rounded' : '',
        outline ? 'badge-outline' : '',
        dot ? 'badge-dot' : '',
        onClick ? 'badge-clickable' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <span
            className={badgeClasses}
            onClick={onClick}
            role={onClick ? 'button' : 'status'}
            tabIndex={onClick ? 0 : -1}
            {...props}
        >
            {dot && <span className="badge-dot-indicator" />}
            {icon && <span className="badge-icon">{icon}</span>}
            {children}
        </span>
    );
}