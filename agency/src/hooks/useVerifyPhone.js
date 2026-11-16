import { useState } from "react";
import { useAuth } from "../contexts/auth.context";
import service from "../services/auth.service";
import { useNavigate } from "react-router-dom";

export default function useVerifyPhone() {
    const navigate = useNavigate();

    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState({
        phone: user?.phone || "",
        code: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const validateField = (name, value) => {

        switch (name) {

            case "phone":

                if (!value)
                    return "Le numéro est obligatoire.";

                return "";

            case "code":

                if (!value)
                    return "Le code est obligatoire.";

                if (value.length !== 6)
                    return "Le code doit contenir 6 chiffres.";

                return "";

            default:
                return "";

        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleSendCode = async () => {
        const error = validateField("phone", formData.phone);

        if (error) {
            setErrors({ phone: error });
            return;
        }

        await service.sendPhoneVerification(formData.phone);

        setCodeSent(true);
        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;
            });

        }, 1000);

    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await service.verifyPhone({
                phone: formData.phone,
                code: formData.code,
            });

            setUser(result.data);

            navigate("/app/profile/identity");

            resetForm();

        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            phone: "",
            code: ""
        })
    }

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        codeSent,
        countdown,
        phone: formData.phone,

        handleChange,
        handleBlur,
        handleSendCode,
        handleVerify,
        resetForm,
    };
}