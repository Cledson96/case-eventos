import type { HTMLInputTypeAttribute } from "react";

import { Typography } from "@/components/ui/Typography";
import { fieldControlClass, fieldLabel } from "@/components/ui/styles";

type CommonProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
};

type TextFieldProps = CommonProps &
  (
    | { multiline: true; rows?: number }
    | {
        multiline?: false;
        type?: HTMLInputTypeAttribute;
        inputMode?: "text" | "email" | "tel" | "numeric";
        autoComplete?: string;
      }
  );

export function TextField(props: TextFieldProps) {
  const { id, label, value, onChange, onBlur, error, required, maxLength, placeholder } = props;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>

      {props.multiline ? (
        <textarea
          id={id}
          name={id}
          value={value}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={props.rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={fieldControlClass(Boolean(error))}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={props.type ?? "text"}
          inputMode={props.inputMode}
          autoComplete={props.autoComplete}
          value={value}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={fieldControlClass(Boolean(error))}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      )}

      {error ? (
        <Typography as="p" variant="error" id={errorId} role="alert" className="mt-1">
          {error}
        </Typography>
      ) : null}
    </div>
  );
}
