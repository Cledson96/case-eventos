import { useRef, useState, type SyntheticEvent } from "react";

type Validator = (value: string) => string | null;

type FormErrors<T> = Partial<Record<keyof T, string | null>>;

type UseFormOptions<T extends Record<string, string>> = {
  initialValues: T;
  validators: Record<keyof T, Validator>;
  transforms?: Partial<Record<keyof T, (value: string) => string>>;
  onSubmit: (values: T, helpers: { reset: () => void }) => Promise<void>;
};

export function useForm<T extends Record<string, string>>({
  initialValues,
  validators,
  transforms,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  function setField(field: keyof T, raw: string) {
    const transform = transforms?.[field];
    const value = transform ? transform(raw) : raw;

    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      current[field] !== undefined ? { ...current, [field]: validators[field](value) } : current
    );
  }

  function handleBlur(field: keyof T) {
    setErrors((current) => ({ ...current, [field]: validators[field](values[field]) }));
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const nextErrors: FormErrors<T> = {};
    let valid = true;

    for (const field of Object.keys(validators) as Array<keyof T>) {
      const error = validators[field](values[field]);
      nextErrors[field] = error;

      if (error) {
        valid = false;
      }
    }

    setErrors(nextErrors);

    if (!valid) {
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      await onSubmit(values, { reset });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return { values, errors, submitting, setField, handleBlur, handleSubmit, reset };
}
