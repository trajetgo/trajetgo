import Input from "@shared/components/ui/Input";
import OTPInput from "@shared/components/ui/OTPInput";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

export default function VerifyPhoneForm({
    formData,
    handleVerify,
    handleBlur,
    handleChange,
    errors,
    touched,
    codeSent,
    handleSendCode,
    phone,
    countdown,
    isSubmitting,
    serverError
}) {
    return (
        <form
            onSubmit={handleVerify}
            className="verify-phone__form"
        >

            {/* Afficher l'erreur générale */}
            {serverError && (
                <div className="server-error" role="alert">
                    <span className="error-icon">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <Input
                label="Numéro de téléphone"
                name="phone"
                placeholder="+225 07 00 00 00 00"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone}
                disabled={Boolean(phone)}
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
    )
}
