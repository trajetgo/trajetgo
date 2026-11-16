import React from 'react';
import '../../styles/components/ui/Textarea.scss';

export default function Textarea({
    label,
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
    return (
        <div className={`textarea-container ${error ? 'has-error' : ''} ${className}`.trim()}>
            {label && (
                <label htmlFor="textarea" className="textarea-label">
                    {label}
                    {required && <span className="required-star">*</span>}
                </label>
            )}

            <textarea
                name={name}
                id={id}
                required
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className={`base-textarea ${error ? 'textarea-error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `textarea-error` : helperText ? `textarea-helper` : undefined}
                {...props}
            >

            </textarea>

            {error ? (
                <span id={`textarea-error`} className="error-text" role="alert">
                    {error}
                </span>
            ) : (
                helperText && <span id={`textarea-helper`} className="helper-text">{helperText}</span>
            )}
        </div>
    )
}
