import React, { useState } from 'react';
import { User } from 'lucide-react';
import '../../styles/components/ui/Avatar.scss';

export default function Avatar({
    src,
    name,
    size = 'md',
    shape = 'circle',
    color = null,
    border = false,
    borderColor = '#6c63ff',
    status = null, // 'online', 'offline', 'busy', 'away'
    className = '',
    onClick = null,
    ...props
}) {
    const [hasError, setHasError] = useState(false);

    // Couleurs prédéfinies pour les avatars sans image
    const getColorFromName = (fullName) => {
        if (color) return color;

        const colors = [
            '#6c63ff', '#28a745', '#17a2b8', '#ffc107',
            '#dc3545', '#fd7e14', '#20c997', '#6c757d',
            '#e83e8c', '#6610f2', '#f8f9fa', '#343a40'
        ];

        if (!fullName) return colors[0];

        let hash = 0;
        for (let i = 0; i < fullName.length; i++) {
            hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Taille des classes
    const sizeClasses = {
        xs: 'avatar-xs',
        sm: 'avatar-sm',
        md: 'avatar-md',
        lg: 'avatar-lg',
        xl: 'avatar-xl',
        '2xl': 'avatar-2xl',
    };

    // Forme des classes
    const shapeClasses = {
        circle: 'avatar-circle',
        square: 'avatar-square',
        rounded: 'avatar-rounded',
    };

    // Statut des classes
    const statusClasses = {
        online: 'status-online',
        offline: 'status-offline',
        busy: 'status-busy',
        away: 'status-away',
    };

    // Récupérer les initiales
    const getInitials = (fullName) => {
        if (!fullName) return '?';
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // Couleur de fond
    const bgColor = getColorFromName(name);
    const textColor = '#ffffff';

    // Classes combinées
    const avatarClasses = [
        'avatar',
        sizeClasses[size] || sizeClasses.medium,
        shapeClasses[shape] || shapeClasses.circle,
        border ? 'avatar-border' : '',
        className,
        onClick ? 'avatar-clickable' : '',
    ].filter(Boolean).join(' ');

    // Styles inline
    const avatarStyle = {
        backgroundColor: !src || hasError ? bgColor : 'transparent',
        borderColor: border ? borderColor : 'transparent',
        color: !src || hasError ? textColor : 'inherit',
    };

    // Rendu du contenu
    const renderContent = () => {
        if (src && !hasError) {
            return (
                <img
                    src={src}
                    alt={name || 'Avatar'}
                    className="avatar-image"
                    onError={() => setHasError(true)}
                    loading="lazy"
                />
            );
        }

        if (name) {
            return (
                <span className="avatar-initials">
                    {getInitials(name)}
                </span>
            );
        }

        return (
            <User size={size === 'xs' ? 14 : size === 'sm' ? 18 : size === 'lg' ? 28 : 24} />
        );
    };

    return (
        <div
            className={avatarClasses}
            style={avatarStyle}
            onClick={onClick}
            role={onClick ? 'button' : 'img'}
            tabIndex={onClick ? 0 : -1}
            aria-label={name || 'Avatar'}
            {...props}
        >
            {renderContent()}

            {/* Badge de statut */}
            {status && (
                <span className={`avatar-status ${statusClasses[status] || ''}`} />
            )}
        </div>
    );
}