"use client";

import { useEffect, useRef } from "react";
import { FILL_TIME_FIELD, HONEYPOT_FIELD } from "@/lib/forms";

// Anti-spam fields checked by checkSpam() in the server actions: a hidden text
// input that only bots fill, and how long the form has been on screen.
// The fill time is a client-side duration (never compared with the server
// clock), added whenever FormData is built from the form, which React does
// on every action submit.
export default function HoneypotFields() {
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = honeypotRef.current?.form;
    if (!form) return;

    const mountedAt = performance.now();
    const addFillTime = (event: FormDataEvent) => {
      const elapsed = Math.round(performance.now() - mountedAt);
      event.formData.set(FILL_TIME_FIELD, String(elapsed));
    };

    form.addEventListener("formdata", addFillTime);
    return () => form.removeEventListener("formdata", addFillTime);
  }, []);

  return (
    <input
      ref={honeypotRef}
      type="text"
      name={HONEYPOT_FIELD}
      className="hidden"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
    />
  );
}
