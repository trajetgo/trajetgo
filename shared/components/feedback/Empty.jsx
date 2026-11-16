
export default function Empty({
    className="",
    title="",
    text="",
    Icon
}) {
    return (
        <section className={className}>
            <Icon size={42} />
            <h2>{title}</h2>
            <p>
                {text}
            </p>
        </section>
    )
}
