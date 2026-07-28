interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  error?: string;
  defaultValue?: string;
}

export default function FormField({
  id,
  name,
  label,
  type = "text",
  required,
  rows,
  placeholder,
  error,
  defaultValue,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label className="input-label" htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          className="input resize-none"
          rows={rows}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          className="input"
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      {error && (
        <p id={errorId} className="body-sm text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
