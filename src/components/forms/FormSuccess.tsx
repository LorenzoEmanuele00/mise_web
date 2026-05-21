interface FormSuccessProps {
  heading: string
  body: string
}

export default function FormSuccess({ heading, body }: FormSuccessProps) {
  return (
    <div className="p-8 bg-bg-elev border border-hair">
      <p className="h-3 text-ink mb-2">{heading}</p>
      <p className="body text-ink-soft">{body}</p>
    </div>
  )
}
