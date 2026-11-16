import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/components/ui/Input.scss';

export default function Input({
    label,
    type = 'text',
    id,
    name,
    value,
    error,
    helperText,
    className = '',
    required = false,
    placeholder = '',
    onChange,
    onBlur,
    disabled = false,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name;

    // Déterminer le type d'input
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`input-container ${error ? 'has-error' : ''} ${className}`.trim()}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="required-star">*</span>}
                </label>
            )}

            <div className="input-wrapper">
                <input
                    id={inputId}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`base-input ${error ? 'input-error' : ''}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        tabIndex="-1"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {error ? (
                <span id={`${inputId}-error`} className="error-text" role="alert">
                    {error}
                </span>
            ) : (
                helperText && <span id={`${inputId}-helper`} className="helper-text">{helperText}</span>
            )}
        </div>
    );
}