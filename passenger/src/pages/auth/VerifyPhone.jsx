import React, { useEffect } from 'react';
import useVerifyPhone from '../../hooks/useVerifyPhone';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Smartphone } from 'lucide-react';
import OTPInput from '../../components/ui/OTPInput';
import '../../styles/pages/auth/VerifyPhone.scss';

export default function VerifyPhone() {
    const {
        formData,
        errors,
        touched,
        isSubmitting,
        codeSent,
        phone,
        countdown,
        handleChange,
        handleBlur,
        handleSendCode,
        handleVerify,
    } = useVerifyPhone();

    useEffect(() => {
        document.title = "Auth Verify Phone | Kilo Go"
    }, []);

    return (
        <section className="verify-phone">

            <div className="verify-phone__card">

                <span className="verify-phone__badge">
                    <Smartphone />
                    Vérification du téléphone
                </span>

                <h1>
                    Confirmez votre numéro
                </h1>

                <p>
                    Nous allons envoyer un code à 6 chiffres sur votre numéro
                    de téléphone afin de vérifier votre identité.
                </p>

                <form
                    onSubmit={handleVerify}
                    className="verify-phone__form"
                >

                    <Input
                        label="Numéro de téléphone"
                        name="phone"
                        placeholder="+225 07 00 00 00 00"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && errors.phone}
                    />

                    {codeSent && (

                        <OTPInput
                            label="Code de vérification"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.code && errors.code}
                        />

                    )}

                    {!codeSent ? (

                        <Button
                            type="button"
                            fullWidth
                            onClick={handleSendCode}
                        >
                            Envoyer le code
                        </Button>

                    ) : (

                        <>
                            <Button
                                type="submit"
                                size="medium"
                                fullWidth
                                loading={isSubmitting}
                            >
                                {isSubmitting
                                    ? <ActivityIndicator size={14} />
                                    : "Vérifier le téléphone"}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                className="verify-phone__resend"
                                disabled={countdown > 0}
                                onClick={handleSendCode}
                            >
                                {countdown > 0
                                    ? `Renvoyer dans ${countdown}s`
                                    : "Renvoyer le code"}
                            </Button>
                        </>

                    )}

                </form>

                {phone && (
                    <p className="verify-phone__info">
                        Code envoyé au <strong>{phone}</strong>
                    </p>
                )}

            </div>

        </section>
    )
}
