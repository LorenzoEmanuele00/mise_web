interface FormSuccessProps {
  heading: string;
  body: string;
}

export default function FormSuccess({ heading, body }: FormSuccessProps) {
  return (
    <div
      role="status"
      tabIndex={-1}
      ref={(el) => el?.focus()}
      className="p-8 bg-bg-elev border border-hair outline-none"
    >
      <p className="heading-03 text-ink mb-2">{heading}</p>
      <p className="body text-ink-soft">{body}</p>
    </div>
  );
}
