interface FormFieldProps {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
  rows?: number
  placeholder?: string
}

export default function FormField({ id, name, label, type = 'text', required, rows, placeholder }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="input-label" htmlFor={id}>
        {label}{required && ' *'}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          className="input resize-none"
          rows={rows}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          className="input"
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
