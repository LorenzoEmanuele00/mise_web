"use client";

import { useActionState } from "react";
import { submitVolunteer, type FormState } from "@/app/actions/submitForms";
import Btn from "@/components/ui/Btn";
import HoneypotFields from "@/components/forms/HoneypotFields";
import FormField from "@/components/forms/FormField";
import FormSuccess from "@/components/forms/FormSuccess";
import { VOLUNTEER_AREAS } from "@/lib/forms";

const initial: FormState = { success: false };

export default function VolunteerForm() {
  const [state, action, pending] = useActionState(submitVolunteer, initial);

  if (state.success) {
    return (
      <FormSuccess
        heading="Candidatura ricevuta"
        body="Ti contatteremo al più presto per i prossimi passi."
      />
    );
  }

  return (
    <form
      action={action}
      className="bg-bg-elev border border-hair p-8 sm:p-10 flex flex-col gap-8"
    >
      <HoneypotFields />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField
          id="v-nome"
          name="nome"
          autoComplete="given-name"
          label="Nome"
          required
          error={state.errors?.nome}
          defaultValue={state.values?.nome}
        />
        <FormField
          id="v-cognome"
          name="cognome"
          autoComplete="family-name"
          label="Cognome"
          required
          error={state.errors?.cognome}
          defaultValue={state.values?.cognome}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField
          id="v-email"
          name="email"
          autoComplete="email"
          label="Email"
          type="email"
          required
          error={state.errors?.email}
          defaultValue={state.values?.email}
        />
        <FormField
          id="v-telefono"
          name="telefono"
          autoComplete="tel"
          label="Telefono"
          type="tel"
          error={state.errors?.telefono}
          defaultValue={state.values?.telefono}
        />
      </div>

      <fieldset className="flex flex-col gap-3 border-none p-0 m-0 min-w-0">
        <legend className="input-label">Aree di interesse</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {VOLUNTEER_AREAS.map((area) => (
            <label
              key={area}
              className="flex items-center gap-2 body-sm text-ink cursor-pointer"
            >
              <input type="checkbox" name="areeInteresse" value={area} />
              {area}
            </label>
          ))}
        </div>
      </fieldset>

      <FormField
        id="v-disponibilita"
        name="disponibilita"
        label="Disponibilità"
        rows={3}
        placeholder="Es. week-end, serate nei giorni feriali…"
        error={state.errors?.disponibilita}
        defaultValue={state.values?.disponibilita}
      />

      {state.error && (
        <p className="body-sm text-accent" role="alert">
          {state.error}
        </p>
      )}

      <div>
        <Btn type="submit" variant="dark" disabled={pending}>
          {pending ? "Invio…" : "Invia candidatura"}
        </Btn>
      </div>
    </form>
  );
}
