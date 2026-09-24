import type { ReactNode } from "react";
import Section from "@/components/layout/Section";
import Kicker from "@/components/ui/Kicker";

interface StatusMessageProps {
  kicker: string;
  title: string;
  body: string;
  children?: ReactNode;
}

// Full-width message used by the 404 and error pages.
export default function StatusMessage({
  kicker,
  title,
  body,
  children,
}: StatusMessageProps) {
  return (
    <Section loose>
      <Kicker className="text-accent">{kicker}</Kicker>
      <h1 className="heading-01 text-ink mt-6 max-w-3xl">{title}</h1>
      <p className="body-lg mt-8 max-w-xl text-ink-soft">{body}</p>
      {children && <div className="mt-10 flex flex-wrap gap-4">{children}</div>}
    </Section>
  );
}
