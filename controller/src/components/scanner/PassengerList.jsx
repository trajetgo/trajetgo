
export default function PassengerList({ passengers, validatedIds }) {
    if (passengers.length === 0) {
        return (
            <div className="passenger-list passenger-list--empty">
                <p>Aucun passager trouvé.</p>
            </div>
        );
    }

    return (
        <div className="passenger-list">
            <table className="passenger-list__table">
                <thead>
                    <tr>
                        <th>Siège</th>
                        <th>Passager</th>
                        <th>Téléphone</th>
                        <th>Statut</th>
                    </tr>
                </thead>

                <tbody>
                    {passengers.map((p) => {
                        const boarded = validatedIds.has(p.id);

                        return (
                            <tr
                                key={p.id}
                                className={
                                    boarded
                                        ? "passenger-list__row--boarded"
                                        : ""
                                }
                            >
                                <td>
                                    <span className="passenger-list__seat">
                                        {p.seat ?? "—"}
                                    </span>
                                </td>

                                <td>
                                    <strong>
                                        {p.firstName} {p.lastName}
                                    </strong>
                                </td>

                                <td>{p.phone ?? "—"}</td>

                                <td>
                                    <span
                                        className={`passenger-list__status ${boarded
                                                ? "passenger-list__status--boarded"
                                                : "passenger-list__status--waiting"
                                            }`}
                                    >
                                        {boarded
                                            ? "✓ Embarqué"
                                            : "⏳ À quai"}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
