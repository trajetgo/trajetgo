import {
    Mail,
    Phone,
    MapPin,
    MoreVertical,
} from "lucide-react";

import Avatar from "@shared/components/ui/Avatar";
import HighlightText from "@shared/components/ui/HighlightText";

import TeamActions from "./TeamActions";

import { formatRole, formatStatus } from "../../constants/team.constants";

import "../../styles/components/team/TeamGrid.scss";

/* ------------------------------------------------------------------ */

export default function TeamGrid({
    teams,
    search,
    setSelectedAction,
    setSelectedMember,
}) {
    if (!teams || teams.length === 0) return null;

    return (
        <ul className="team-grid">
            {teams.map((member) => (
                <TeamGridCard
                    key={member.id}
                    member={member}
                    search={search}
                    setSelectedAction={setSelectedAction}
                    setSelectedMember={setSelectedMember}
                />
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */

function TeamGridCard({
    member,
    search,
    setSelectedAction,
    setSelectedMember,
}) {
    const roleConfig = formatRole(member.role);
    const statusConfig = formatStatus(member.status);

    const handleView = () => {
        setSelectedMember?.(member);
        setSelectedAction?.("VIEW");
    };

    return (
        <li className="team-grid__item">
            <article className="team-card">

                {/* ---------- En-tête ---------- */}

                <header className="team-card__header">
                    <Avatar
                        name={member.fullName}
                        src={member.avatarUrl}
                        size="lg"
                    />

                    <span
                        className={`team-card__status team-card__status--${statusConfig.class}`}
                    >
                        {statusConfig.label}
                    </span>
                </header>

                {/* ---------- Identité ---------- */}

                <div className="team-card__identity">
                    <h3 className="team-card__name">
                        <HighlightText
                            text={member.fullName || "—"}
                            search={search}
                            as="span"
                        />
                    </h3>

                    <span
                        className={`team-card__role team-card__role--${roleConfig.class}`}
                    >
                        {roleConfig.label}
                    </span>
                </div>

                {/* ---------- Contact ---------- */}

                <ul className="team-card__meta">
                    {member.email && (
                        <li>
                            <Mail size={14} aria-hidden="true" />
                            <HighlightText
                                text={member.email}
                                search={search}
                                as="span"
                            />
                        </li>
                    )}

                    {member.phone && (
                        <li>
                            <Phone size={14} aria-hidden="true" />
                            <HighlightText
                                text={member.phone}
                                search={search}
                                as="span"
                            />
                        </li>
                    )}

                    <li>
                        <MapPin size={14} aria-hidden="true" />
                        <span>{member.agency?.name ?? "Compagnie"}</span>
                    </li>
                </ul>

                {/* ---------- Actions ---------- */}

                <footer className="team-card__footer">
                    <button
                        type="button"
                        className="team-card__view"
                        onClick={handleView}
                    >
                        Voir les détails
                    </button>

                    <TeamActions
                        member={member}
                        onView={handleView}
                        setSelectedAction={setSelectedAction}
                        setSelectedMember={setSelectedMember}
                    />
                </footer>

            </article>
        </li>
    );
}