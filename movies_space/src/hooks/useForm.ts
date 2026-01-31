import { useState, useCallback } from 'react';

export interface FormErrors {
  [key: string]: string;
}

interface UseFormOptions {
  onSubmit?: (values: any) => Promise<void> | void;
  validate?: (values: any) => FormErrors;
  initialValues?: any;
}

/**
 * Hook for managing form state, validation, and submission
 */
export const useForm = (options: UseFormOptions = {}) => {
  const { onSubmit, validate, initialValues = {} } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Handle field value change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues((prev: any) => ({
        ...prev,
        [name]: newValue,
      }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev: any) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [errors]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));

      // Validate on blur if validate function provided
      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);
      }
    },
    [validate, values]
  );

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Set field error
   */
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        // Validate if validator provided
        if (validate) {
          const newErrors = validate(values);
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
          }
        }

        // Call onSubmit handler
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values, onSubmit]
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };
};
