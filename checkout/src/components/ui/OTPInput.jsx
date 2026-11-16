import React, { useEffect, useRef } from "react";
import "../../styles/components/ui/OTPInput.scss";

export default function OTPInput({
    name = "otp",
    label,
    value = "",
    length = 6,
    error,
    disabled = false,
    autoFocus = true,
    onChange,
    onBlur,
    onComplete,
}) {

    const inputRefs = useRef([]);

    // Synchronise la taille du tableau
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const values = value.padEnd(length, "").split("");

    const emitChange = (newValues) => {
        const code = newValues.join("");

        onChange?.({
            target: {
                name,
                value: code,
                type: "otp",
            },
        });

        if (
            code.length === length &&
            !code.includes("")
        ) {
            onComplete?.(code);
        }
    };

    const handleChange = (index, e) => {

        const input = e.target.value.replace(/\D/g, "");

        if (!input) {
            const newValues = [...values];
            newValues[index] = "";
            emitChange(newValues);
            return;
        }

        const chars = input.split("");

        const newValues = [...values];

        chars.forEach((char, i) => {

            if (index + i < length) {
                newValues[index + i] = char;
            }

        });

        emitChange(newValues);

        const nextIndex = Math.min(
            index + chars.length,
            length - 1
        );

        inputRefs.current[nextIndex]?.focus();
    };

    const handleKeyDown = (index, e) => {

        if (e.key === "Backspace") {

            if (values[index]) {

                const newValues = [...values];
                newValues[index] = "";
                emitChange(newValues);

                return;
            }

            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {

        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        if (!pasted) return;

        const newValues = pasted.padEnd(length, "").split("");

        emitChange(newValues);

        inputRefs.current[
            Math.min(pasted.length, length - 1)
        ]?.focus();
    };

    return (
        <div className="otp-input">
            {label && (
                <label className="otp-input__label">
                    {label}
                </label>
            )}

            <div className="otp-input__group">
                {Array.from({ length }).map((_, index) => (

                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={values[index]}
                        disabled={disabled}
                        autoFocus={autoFocus && index === 0}
                        className={`otp-input__field ${error ? "otp-input__field--error" : ""}`}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onBlur={onBlur}
                    />

                ))}

            </div>

            {error && (
                <small className="otp-input__error">
                    {error}
                </small>
            )}
        </div>
    );
}