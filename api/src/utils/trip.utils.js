const formatDuration = (start, end) => {
    const durationMs = end - start;

    const totalMinutes = Math.floor(
        durationMs / (1000 * 60)
    );

    const hours = Math.floor(
        totalMinutes / 60
    );

    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes} min`;
    }

    if (minutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h${String(minutes).padStart(2, "0")}`;
};

module.exports = formatDuration;