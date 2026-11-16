import { useState } from "react";
import service from "../services/tickets.service";
import {
   // PAYMENT_METHOD_VALUES,
   normalizePhoneCI,
   validatePhone,
   validateEmail,
   validateRequired,
} from "../utils/validation.utils";

import { 
   CREATE_TICKET_STEP_FIELDS, 
   CREATE_TICKET_STEPS, 
   TICKET_INITAL_FORM 
} from "../utils/ticket.utils";

const makeInitial = () => ({ ...TICKET_INITAL_FORM });

export default function useSellTicket() {
   const [formData, setFormData] = useState(makeInitial());
   const [errors, setErrors] = useState({});
   const [touched, setTouched] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [serverError, setServerError] = useState("");
   const [currentStep, setCurrentStep] = useState(0);
   const [receipt, setReceipt] = useState(null); // ← nouveau

   const step = CREATE_TICKET_STEPS[currentStep];
   const isFirstStep = currentStep === 0;
   const isLastStep = currentStep === CREATE_TICKET_STEPS.length - 1;

   const validateField = (name, value) => {
      switch (name) {
         case "tripId":
            return validateRequired(value, "Le voyage");
         case "seatId":
            return validateRequired(value, "Le siège");
         case "firstName":
            return validateRequired(value, "Le prénom");
         case "lastName":
            return validateRequired(value, "Le nom");
         case "phone":
            return validatePhone(value);
         case "email":
            return validateEmail(value);
         // case "paymentMethod":
         //    if (!value) return "Le mode de paiement est obligatoire.";
         //    if (!PAYMENT_METHOD_VALUES.includes(value))
         //       return "Mode de paiement invalide.";
         //    return "";
         default:
            return "";
      }
   };

   const validateFields = (fields) => {
      const nextErrors = {};
      fields.forEach((name) => {
         const error = validateField(name, formData[name]);
         if (error) nextErrors[name] = error;
      });
      return nextErrors;
   };

   const validateStep = (index = currentStep) => {
      const fields = CREATE_TICKET_STEP_FIELDS[CREATE_TICKET_STEPS[index].key] ?? [];
      setTouched((prev) => ({
         ...prev,
         ...Object.fromEntries(fields.map((f) => [f, true])),
      }));
      const nextErrors = validateFields(fields);
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return Object.keys(nextErrors).length === 0;
   };

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const nextValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({ ...prev, [name]: nextValue }));
      setServerError("");

      if (touched[name]) {
         const error = validateField(name, nextValue);
         setErrors((prev) => ({ ...prev, [name]: error }));
      }
   };

   const handleBlur = (e) => {
      const { name, value, type, checked } = e.target;
      const nextValue = type === "checkbox" ? checked : value;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, nextValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
   };

   /* ---------- Navigation ---------- */

   const goNext = () => {
      if (!validateStep()) return false;
      setCurrentStep((s) => Math.min(s + 1, CREATE_TICKET_STEPS.length - 1));
      return true;
   };

   const goPrev = () =>
      setCurrentStep((s) => Math.max(s - 1, 0));

   const goTo = (index) => {
      if (index < 0 || index >= CREATE_TICKET_STEPS.length) return false;
      if (index > currentStep) {
         // valider toutes les étapes intermédiaires
         for (let i = currentStep; i < index; i++) {
            const fields = CREATE_TICKET_STEP_FIELDS[CREATE_TICKET_STEPS[i].key] ?? [];
            setTouched((prev) => ({
               ...prev,
               ...Object.fromEntries(fields.map((f) => [f, true])),
            }));
            const nextErrors = validateFields(fields);
            if (Object.keys(nextErrors).length > 0) {
               setErrors((prev) => ({ ...prev, ...nextErrors }));
               return false;
            }
         }
      }
      setCurrentStep(index);
      return true;
   };

   /* ---------- Submit ---------- */

   const handleSubmit = async (e) => {
      e?.preventDefault?.();

      setServerError("");

      // valider toutes les étapes
      const allFields = CREATE_TICKET_STEPS.flatMap((s) => CREATE_TICKET_STEP_FIELDS[s.key] ?? []);
      setTouched((prev) => ({
         ...prev,
         ...Object.fromEntries(allFields.map((f) => [f, true])),
      }));
      const validationErrors = validateFields(allFields);
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         return { success: false, validationError: true };
      }

      setIsSubmitting(true);

      try {
         const payload = {
            tripId: formData.tripId,
            seatId: formData.seatId,
            passenger: {
               firstName: formData.firstName.trim(),
               lastName: formData.lastName.trim(),
               phone: normalizePhoneCI(formData.phone),
               email: formData.email.trim() || null,
            },
            paymentMethod: formData.paymentMethod,
         };

         const result = await service.sellTicket(payload);

         if (!result.success) {
            throw Object.assign(
               new Error(result.message || "Impossible de vendre le billet."),
               { status: result.status }
            );
         }

         setReceipt(result.data); // ← on garde le billet
         return result;
      } catch (error) {
         const message =
            error.message || "Impossible de vendre le billet.";

         if (
            error.status === 409 ||
            /si[eè]ge|seat/i.test(message)
         ) {
            setErrors((prev) => ({
               ...prev,
               seatId: "Ce siège est déjà réservé.",
            }));
            setCurrentStep(1); // retour étape siège
            return { success: false, validationError: true };
         }

         setServerError(message);
         return { success: false, message };
      } finally {
         setIsSubmitting(false);
      }
   };

   const resetForm = () => {
      setFormData(makeInitial());
      setErrors({});
      setTouched({});
      setServerError("");
      setCurrentStep(0);
      setReceipt(null);
   };

   return {
      formData,
      errors,
      touched,
      isSubmitting,
      serverError,

      currentStep,
      step,
      steps: CREATE_TICKET_STEPS,
      isFirstStep,
      isLastStep,

      receipt, // ← pour afficher le reçu

      handleChange,
      handleBlur,
      goNext,
      goPrev,
      goTo,
      handleSubmit,
      resetForm,
      setFormData,
   };
}