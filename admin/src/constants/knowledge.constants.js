export const ARTICLE_STATUS = {
    DRAFT: {
        value: "DRAFT",
        label: "Brouillon",
        class: "draft",
    },
    PUBLISHED: {
        value: "PUBLISHED",
        label: "Publié",
        class: "published",
    },
    ARCHIVED: {
        value: "ARCHIVED",
        label: "Archivé",
        class: "archived",
    },
};

export const STATUS_FILTERS = [
    { value: "ALL", label: "Tous les statuts", countKey: "all" },
    { value: "DRAFT", label: "Brouillons", countKey: "draft" },
    { value: "PUBLISHED", label: "Publiés", countKey: "published" },
    { value: "ARCHIVED", label: "Archivés", countKey: "archived" },
];

export function getStatusConfig(status) {
    return ARTICLE_STATUS[status] ?? {
        value: status,
        label: status ?? "Inconnu",
        class: "unknown",
    };
}

export function getStatusFilters() {
    return STATUS_FILTERS;
}