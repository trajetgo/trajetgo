export function timeToMinutes(time) {
    if (!time) return null;

    const [hours, minutes] = time
        .split(":")
        .map(Number);

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {
        return null;
    }

    return hours * 60 + minutes;
}

export function matchesTimeRange(time, range) {
    if (range === "all") {
        return true;
    }

    const minutes = timeToMinutes(time);

    if (minutes === null) {
        return false;
    }

    switch (range) {
        case "early":
            return minutes < 6 * 60;

        case "morning":
            return minutes >= 6 * 60 &&
                minutes < 12 * 60;

        case "afternoon":
            return minutes >= 12 * 60 &&
                minutes < 18 * 60;

        case "evening":
            return minutes >= 18 * 60;

        default:
            return true;
    }
}