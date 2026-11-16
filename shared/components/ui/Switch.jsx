import React from 'react';
import '../../styles/components/ui/Switch.scss';

export default function Switch({
    name,
    checked = false,
    value,
    onChange,
    onBlur,

    error = "",
    required = false,
    disabled = false,

    className = "",
    helperText = "",
    icon = null,

    ...props
}) {
    const handleClick = () => {
        if (disabled) return;

        onChange?.(!checked);
    };

    const handleKeyDown = (e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange?.(!checked);
        }
    };

    return (
        <div
            className={`switch ${checked ? "switch--checked" : ""} ${disabled ? "switch--disabled" : ""
                } ${error ? "switch--error" : ""} ${className}`}
        >
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-required={required}
                aria-disabled={disabled}
                name={name}
                value={value}
                disabled={disabled}
                className="switch__control"
                onClick={handleClick}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                {...props}
            >
                <span className="switch__thumb">
                    {icon}
                </span>
            </button>

            {helperText && (
                <small className="switch__helper">
                    {helperText}
                </small>
            )}

            {error && (
                <small className="switch__error">
                    {error}
                </small>
            )}
        </div>
    )
}
