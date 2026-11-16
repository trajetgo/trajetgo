import React from 'react';
import { ChevronDown } from 'lucide-react';
import '../../styles/components/ui/Select.scss';

export default function Select({
    label,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder = 'Sélectionner une option',
    error = '',
    required = false,
    disabled = false,
    className = '',
    helperText = '',
    icon = null,
    ...props
}) {
    const selectId = `select-${name}`;

    return (
        <div className={`select-container ${className} ${error ? 'has-error' : ''}`}>
            {label && (
                <label htmlFor={selectId} className="select-label">
                    {label}
                    {required && <span className="required-star">*</span>}
                </label>
            )}

            <div className="select-wrapper">
                {icon && (
                    <span className="select-icon left-icon">
                        {icon}
                    </span>
                )}

                <select
                    id={selectId}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`select-input ${icon ? 'with-icon' : ''} ${error ? 'error' : ''}`}
                    required={required}
                    {...props}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled || false}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <span className="select-chevron">
                    <ChevronDown size={18} />
                </span>
            </div>

            {error && (
                <span className="select-error" role="alert">
                    {error}
                </span>
            )}

            {helperText && !error && (
                <span className="select-helper">{helperText}</span>
            )}
        </div>
    );
}