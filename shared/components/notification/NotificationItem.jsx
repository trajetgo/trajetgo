
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    DEFAULT_NOTIFICATION_CONFIG,
    NOTIFICATION_CONFIG,
    mapNotification,
} from "../../utils/notification.utils";

import '../../styles/components/notifications/NotificationItem.scss'

function formatTimeAgo(date) {
    if (!date) return "";

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) return "";

    const diff = Math.max(0, Date.now() - timestamp);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} h`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `Il y a ${days} j`;

    return new Date(date).toLocaleDateString("fr-FR");
}

export default function NotificationItem({
    notification: rawNotification,
    onRead,
}) {
    const navigate = useNavigate();

    const notification = mapNotification(rawNotification);

    const config =
        NOTIFICATION_CONFIG[notification.category] ||
        DEFAULT_NOTIFICATION_CONFIG;

    const Icon = config.icon;

    const handleClick = () => {
        if (!notification.isRead) {
            onRead?.(notification.id);
        }

        if (notification.data?.url) {
            navigate(notification.data.url);
        }
    };

    return (
        <button
            type="button"
            className={`nb-item ${!notification.isRead ? "unread" : ""}`}
            onClick={handleClick}
        >
            <div
                className="nb-item__icon"
                style={{
                    background: config.bg,
                    color: config.color,
                }}
            >
                <Icon size={15} />
            </div>

            <div className="nb-item__body">
                <p className="nb-item__title">
                    {notification.title}
                </p>

                <p className="nb-item__message">
                    {notification.message}
                </p>

                <span className="nb-item__time">
                    {formatTimeAgo(notification.createdAt)}
                </span>
            </div>

            {!notification.isRead && (
                <div className="nb-item__dot" />
            )}

            {notification.data?.url && (
                <ChevronRight
                    size={13}
                    className="nb-item__arrow"
                />
            )}
        </button>
    );
}
