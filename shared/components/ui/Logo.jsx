import React from 'react';
import { Gem } from 'lucide-react';
import '../../styles/components/ui/Logo.scss';

export default function Logo({
    size = 'medium', // small, medium, large, xl
    name = 'Shine & Pretty',
    showName = true,
    variant = 'full', // full, icon-only
    src = null,
    className = '',
    ...props
}) {
    // Taille des classes
    const sizeClasses = {
        small: 'logo-small',
        medium: 'logo-medium',
        large: 'logo-large',
        xl: 'logo-xl',
    };

    // Taille des icônes
    const iconSizes = {
        small: 20,
        medium: 28,
        large: 36,
        xl: 48,
    };

    // Taille des polices
    const fontSizes = {
        small: '14px',
        medium: '20px',
        large: '28px',
        xl: '36px',
    };

    const logoClasses = [
        'logo',
        sizeClasses[size] || sizeClasses.medium,
        variant === 'icon-only' ? 'logo-icon-only' : '',
        className,
    ].filter(Boolean).join(' ');

    const Icon = src ? 'img' : Gem;
    const iconSize = iconSizes[size] || iconSizes.medium;

    return (
        <div className={logoClasses} {...props}>
            <div className="logo-icon-wrapper">
                {src ? (
                    <img
                        src={src}
                        alt={name}
                        className="logo-image"
                        width={iconSize}
                        height={iconSize}
                    />
                ) : (
                    <Icon
                        size={iconSize}
                        className="logo-icon"
                    />
                )}
            </div>

            {showName && variant !== 'icon-only' && (
                <span
                    className="logo-text"
                    style={{ fontSize: fontSizes[size] || fontSizes.medium }}
                >
                    {name}
                </span>
            )}
        </div>
    );
}