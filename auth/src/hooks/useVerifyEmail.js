import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import service from "../services/auth.service";

export default function useVerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const verificationId = searchParams.get("vid");

    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);

    const [resendStatus, setResendStatus] = useState("idle"); // idle | loading | success | error
    const [resendMessage, setResendMessage] = useState("");

    const hasFired = useRef(false);

    useEffect(() => {
        if (hasFired.current) return;
        hasFired.current = true;

        if (!token) {
            setStatus("error");
            setMessage("Lien invalide : aucun token fourni.");
            return;
        }

        const verify = async () => {
            setStatus("loading");
            setMessage("");

            try {
                const result = await service.verifyEmail(
                    token,
                    verificationId
                );
                setUser(result.data ?? null);
                setStatus("success");
                setMessage("Votre adresse e-mail a été vérifiée avec succès.");
            } catch (error) {
                setStatus("error");
                setMessage(
                    error.message ||
                    "Lien invalide ou expiré. Demandez un nouvel email."
                );
            }
        };

        verify();
    }, [token, verificationId]);

    const canResend = Boolean(verificationId) && status === "error";

    const resend = async () => {
        if (!canResend) return;

        setResendStatus("loading");
        setResendMessage("");

        try {
            await service.resendVerificationEmail(verificationId);

            setResendStatus("success");
            setResendMessage(
                "Un nouveau lien vient de vous être envoyé. Vérifiez votre boîte de réception."
            );
        } catch (error) {
            setResendStatus("error");
            setResendMessage(
                error.message ||
                "Impossible d'envoyer un nouveau lien. Réessayez plus tard."
            );
        }
    };

    return {
        token,
        verificationId,
        status,
        message,
        user,
        isSuccess: status === "success",
        isError: status === "error",
        isLoading: status === "loading",
        resend,
        resendStatus,
        resendMessage,
        canResend,
    };
}