import React from 'react';
import '../../styles/components/ui/Checkbox.scss';

export default function Checkbox({
    label,
    id,
    name,
    checked,
    value,
    error,
    helperText,
    className = '',
    required = false,
    onChange,
    onBlur,
    disabled = false,
    size = 'medium', // 'small' | 'medium' | 'large'
    variant = 'primary', // 'primary' | 'success' | 'danger' | 'warning'
    indeterminate = false,
    ...props
}) {
    const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const isChecked = checked || false;

    // Référence pour l'état indeterminate
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    const handleBlur = (e) => {
        if (onBlur) {
            onBlur(e);
        }
    };

    // Classes
    const containerClasses = [
        'checkbox-container',
        `checkbox-${size}`,
        `checkbox-${variant}`,
        error ? 'has-error' : '',
        disabled ? 'is-disabled' : '',
        isChecked ? 'is-checked' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <label htmlFor={checkboxId} className="checkbox-label">
                <div className="checkbox-wrapper">
                    <input
                        ref={inputRef}
                        id={checkboxId}
                        type="checkbox"
                        name={name}
                        checked={isChecked}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={disabled}
                        required={required}
                        className="checkbox-input"
                        {...props}
                    />
                    <span className="checkbox-custom">
                        <svg
                            className="checkbox-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                </div>

                {label && (
                    <span className="checkbox-text">
                        {label}
                        {required && <span className="required-star">*</span>}
                    </span>
                )}
            </label>

            {error && (
                <span className="checkbox-error" role="alert">
                    {error}
                </span>
            )}

            {helperText && !error && (
                <span className="checkbox-helper">{helperText}</span>
            )}
        </div>
    );
}