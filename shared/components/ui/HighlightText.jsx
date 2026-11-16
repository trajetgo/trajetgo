import React from 'react';

export default function HighlightText({
    text = "",
    search = "",
    as: Tag = "span",
    className = "",
    highlightClassName = "",
}) {
    // Aucun terme recherché
    if (!search.trim()) {
        return <Tag className={className}>{text}</Tag>;
    }

    // Échapper les caractères spéciaux pour éviter les erreurs regex
    const escapedSearch = search.replace(
        /[-/\\\\^$*+?.()|[\\]{}]/g,
        "\\\\$&"
    );

    const regex = new RegExp(`(${escapedSearch})`, "gi");
    const parts = text.split(regex);

    return (
        <Tag className={className}>
            {parts.map((part, index) =>
                part.toLowerCase() === search.toLowerCase() ? (
                    <mark
                        key={index}
                        className={highlightClassName}
                        style={{
                            backgroundColor: "#fef08a",
                            color: "inherit",
                            padding: "0 2px",
                            borderRadius: "3px",
                        }}
                    >
                        {part}
                    </mark>
                ) : (
                    <React.Fragment key={index}>
                        {part}
                    </React.Fragment>
                )
            )}
        </Tag>
    );
}