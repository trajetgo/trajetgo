import { useEffect, useRef, useState } from "react";
import {
    Check,
    ChevronDown,
    LoaderCircle,
    Search,
    X,
} from "lucide-react";

import HighlightText from "./HighlightText";

import "../../styles/components/ui/SearchableSelect.scss";

export default function SearchableSelect({
    label,
    name,
    id,
    value,
    options = [],

    onChange,
    onBlur,

    error,

    placeholder = "Sélectionner...",
    searchPlaceholder = "Rechercher...",

    search = "",
    onSearchChange,

    loading = false,

    disabled = false,
    required = false,
}) {
    const [open, setOpen] = useState(false);

    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    const inputId = id || name;

    /* -------------------------------------------------------------- */
    /* Option sélectionnée                                            */
    /* -------------------------------------------------------------- */

    const selectedOption = options.find(
        (option) =>
            String(option.value) === String(value)
    );

    /* -------------------------------------------------------------- */
    /* Click extérieur                                                 */
    /* -------------------------------------------------------------- */

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /* -------------------------------------------------------------- */
    /* Focus recherche                                                 */
    /* -------------------------------------------------------------- */

    useEffect(() => {
        if (!open) return;

        requestAnimationFrame(() => {
            searchInputRef.current?.focus();
        });
    }, [open]);

    /* -------------------------------------------------------------- */
    /* Sélection                                                       */
    /* -------------------------------------------------------------- */

    const handleSelect = (option) => {
        onChange?.({
            target: {
                name,
                value: option.value,
                type: "select",
            },
        });

        setOpen(false);

        onSearchChange?.("");

        onBlur?.({
            target: {
                name,
                value: option.value,
            },
        });
    };

    /* -------------------------------------------------------------- */
    /* Effacer                                                         */
    /* -------------------------------------------------------------- */

    const handleClear = (event) => {
        event.stopPropagation();

        onChange?.({
            target: {
                name,
                value: "",
                type: "select",
            },
        });

        onSearchChange?.("");
    };

    /* -------------------------------------------------------------- */
    /* Recherche                                                       */
    /* -------------------------------------------------------------- */

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    return (
        <div
            ref={containerRef}
            className={`searchable-select ${error ? "has-error" : ""
                }`}
        >
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="searchable-select__label"
                >
                    {label}

                    {required && (
                        <span className="required-star">
                            *
                        </span>
                    )}
                </label>
            )}

            {/* Trigger */}
            <button
                type="button"
                id={inputId}
                className={`
                    searchable-select__trigger
                    ${open ? "is-open" : ""}
                    ${!selectedOption ? "is-placeholder" : ""}
                `}
                onClick={() => {
                    if (!disabled) {
                        setOpen((prev) => !prev);
                    }
                }}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-invalid={!!error}
            >
                <span className="searchable-select__value">
                    {selectedOption?.label || placeholder}
                </span>

                <ChevronDown
                    size={18}
                    className="searchable-select__chevron"
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="searchable-select__dropdown">
                    {/* Search */}
                    <div className="searchable-select__search">
                        <Search size={16} />

                        <input
                            ref={searchInputRef}
                            type="search"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder={searchPlaceholder}
                            autoComplete="off"
                        />

                        {search && !loading && (
                            <button
                                type="button"
                                onClick={() =>
                                    onSearchChange?.("")
                                }
                                aria-label="Effacer la recherche"
                            >
                                <X size={14} />
                            </button>
                        )}

                        {loading && (
                            <LoaderCircle
                                size={16}
                                className="searchable-select__loader"
                            />
                        )}
                    </div>

                    {/* Results */}
                    <div
                        className="searchable-select__options"
                        role="listbox"
                    >
                        {loading ? (
                            <div className="searchable-select__state">
                                Recherche en cours...
                            </div>
                        ) : options.length > 0 ? (
                            options.map((option) => {
                                const selected =
                                    String(option.value) ===
                                    String(value);

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        className={`
                                            searchable-select__option
                                            ${selected
                                                ? "is-selected"
                                                : ""
                                            }
                                        `}
                                        onClick={() =>
                                            handleSelect(option)
                                        }
                                    >
                                        <HighlightText
                                            text={option.label}
                                            search={search}
                                            as="span"
                                        />

                                        {selected && (
                                            <Check size={16} />
                                        )}
                                    </button>
                                );
                            })
                        ) : search.trim().length >= 2 ? (
                            <div className="searchable-select__state">
                                Aucune ville trouvée
                            </div>
                        ) : (
                            <div className="searchable-select__state">
                                Saisissez au moins 2 caractères
                            </div>
                        )}
                    </div>

                    {/* Clear */}
                    {selectedOption && (
                        <button
                            type="button"
                            className="searchable-select__clear"
                            onClick={handleClear}
                        >
                            Effacer la sélection
                        </button>
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <span
                    id={`${inputId}-error`}
                    className="error-text"
                    role="alert"
                >
                    {error}
                </span>
            )}
        </div>
    );
}