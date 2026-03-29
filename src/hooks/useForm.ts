import { useState, useCallback } from 'react';
import { parseFieldErrors } from '@/utils/errors';

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  handleSubmit: (
    onSubmit: (values: T) => Promise<void>,
    validate?: (values: T) => Partial<Record<keyof T, string>>,
  ) => (e: React.FormEvent) => void;
  reset: () => void;
}

export default function useForm<T extends Record<string, unknown>>(
  initialValues: T,
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    (
      onSubmit: (values: T) => Promise<void>,
      validate?: (values: T) => Partial<Record<keyof T, string>>,
    ) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (validate) {
          const validationErrors = validate(values);
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
          }
        }

        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (err) {
          const fieldErrors = parseFieldErrors(err) as Partial<
            Record<keyof T, string>
          >;
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            throw err;
          }
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    setErrors,
    handleSubmit,
    reset,
  };
}
