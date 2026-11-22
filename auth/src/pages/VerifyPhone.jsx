import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@shared/contexts/toast.context';

import useVerifyPhone from '../hooks/useVerifyPhone';
import VerifyPhoneForm from '../components/auth/VerifyPhoneForm';
import VerifyPhoneHeader from '../components/auth/VerifyPhoneHeader';

import '../styles/pages/VerifyPhone.scss';

export default function VerifyPhone() {

    const {
        formData,
        errors,
        touched,
        isSubmitting,
        codeSent,
        phone,
        countdown,
        devOtp,
        serverError,
        handleChange,
        handleBlur,
        handleSendCode,
        handleVerify,
    } = useVerifyPhone();

    const { showToast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Auth Verify Phone | Kilo Go"
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await handleVerify(e);

            if (result?.success) {
                const responseData =
                    result.data?.data ?? result.data ?? result;


                showToast(
                    "success",
                    "Compte créé",
                    "Votre compte est créé. Vérifiez votre numéro de téléphone.",
                    { duration: 3000 }
                );

                navigate("/login", {
                    state: {
                        registeredPhone: phone,
                        devOtp: responseData.devOtp ?? null,
                    },
                });
            }
        } catch (error) {

        }
    };

    return (
        <section className="verify-phone-page">
            <div className="verify-phone-container">

                <VerifyPhoneHeader
                    phone={phone}
                    formData={formData}
                    devOtp={devOtp}
                />

                <VerifyPhoneForm
                    formData={formData}
                    handleVerify={handleFormSubmit}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    errors={errors}
                    touched={touched}
                    codeSent={codeSent}
                    handleSendCode={handleSendCode}
                    phone={phone}
                    countdown={countdown}
                    isSubmitting={isSubmitting}
                    serverError={serverError}
                />

                {phone && (
                    <p className="verify-phone__info">
                        Code envoyé au <strong>{phone}</strong>
                    </p>
                )}

            </div>

        </section>
    )
}
