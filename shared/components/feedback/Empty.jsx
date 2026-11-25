import '../../styles/components/feedback/Empty.scss';

export default function Empty({
    className="",
    title="Aucun élément trouvé",
    text="Commencez par ajouter un élément.",
    icon
}) {
    const Icon = icon;
    
    return (
        <section className={`empty ${className}`}>
            <Icon size={42} aria-hidden="true" />
            <h2>{title}</h2>
            <p>
                {text}
            </p>
        </section>
    )
}
