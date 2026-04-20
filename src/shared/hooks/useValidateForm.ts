import { useState } from "react";
import { z } from "zod";
import type { Form } from "@base-ui/react/form";

type FormData = Record<string, unknown>;
type Errors<T> = Partial<Record<keyof T, Array<string> | undefined>>;

export const useValidateForm = <T extends FormData>(schema: z.ZodType<T>) => {
 const [errors, setErrors] = useState<Errors<T>>({});

 const validateForm = (formValues: Form.Values<T>): { errors: Errors<T> } => {
  const result = schema.safeParse(formValues);

  if (!result.success) {
   const flattenErrors = z.flattenError(result.error).fieldErrors;
   setErrors(flattenErrors);
   return {
    errors: flattenErrors,
   };
  } else {
   setErrors({});

   return {
    errors: {},
   };
  }
 };

 const validateField = (fieldName: keyof T, formValues: Form.Values<T>) => {
  const result = schema.safeParse(formValues);

  const targetFieldErrors = result.success
   ? null
   : z.flattenError(result.error).fieldErrors[fieldName];

  if (targetFieldErrors === null || targetFieldErrors === undefined) {
   setErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors[fieldName];
    return newErrors;
   });
   return null;
  } else {
   setErrors((prev) => ({ ...prev, [fieldName]: targetFieldErrors }));
   return targetFieldErrors;
  }
 };

 return { errors, validateField, validateForm };
};
