
export default function Empty({
    Icon,
    title = "",
    text = "",
    hasFilter = false,
    onClick,
    btnLabel = "",
    className=""
}) {
    return (
        <section className={`section__empty ${className}`}>
            <Icon size={42} />
            <h3>{title}</h3>   
            <p>
                {text}
            </p>

            {hasFilter && (
                <button
                    type="button"
                    className="section__reset-button"
                    onClick={onClick}
                >
                    {btnLabel}
                </button>
            )}
        </section>
    )
}
