"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/app/actions/submitForms";
import Btn from "@/components/ui/Btn";
import FormField from "@/components/forms/FormField";
import FormSuccess from "@/components/forms/FormSuccess";

const initial: FormState = { success: false };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.success) {
    return (
      <FormSuccess
        heading="Messaggio ricevuto"
        body="Ti risponderemo il prima possibile."
      />
    );
  }

  return (
    <form
      action={action}
      className="bg-bg-elev border border-hair p-8 sm:p-10 flex flex-col gap-8"
    >
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <FormField
        id="c-nome"
        name="nome"
        label="Nome"
        required
        error={state.errors?.nome}
        defaultValue={state.values?.nome}
      />
      <FormField
        id="c-email"
        name="email"
        label="Email"
        type="email"
        required
        error={state.errors?.email}
        defaultValue={state.values?.email}
      />
      <FormField
        id="c-oggetto"
        name="oggetto"
        label="Oggetto"
        required
        error={state.errors?.oggetto}
        defaultValue={state.values?.oggetto}
      />
      <FormField
        id="c-messaggio"
        name="messaggio"
        label="Messaggio"
        rows={5}
        required
        error={state.errors?.messaggio}
        defaultValue={state.values?.messaggio}
      />

      {state.error && (
        <p className="body-sm text-accent" role="alert">
          {state.error}
        </p>
      )}

      <div>
        <Btn type="submit" variant="dark" disabled={pending}>
          {pending ? "Invio…" : "Invia messaggio"}
        </Btn>
      </div>
    </form>
  );
}
