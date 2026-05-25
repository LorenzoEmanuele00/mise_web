'use client'

import { useActionState } from 'react'
import { submitVolunteer, type FormState } from '@/app/actions/submitForms'
import Btn from '@/components/ui/Btn'
import FormField from '@/components/forms/FormField'
import FormSuccess from '@/components/forms/FormSuccess'

const AREE = ['Emergenza', 'Assistenza anziani', 'Trasporti', 'Gestione mezzi', 'Ufficio', 'Formazione']
const initial: FormState = { success: false }

export default function VolunteerForm() {
  const [state, action, pending] = useActionState(submitVolunteer, initial)

  if (state.success) {
    return <FormSuccess heading="Candidatura ricevuta" body="Ti contatteremo al più presto per i prossimi passi." />
  }

  return (
    <form action={action} className="flex flex-col gap-8">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField id="v-nome" name="nome" label="Nome" required />
        <FormField id="v-cognome" name="cognome" label="Cognome" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField id="v-email" name="email" label="Email" type="email" required />
        <FormField id="v-telefono" name="telefono" label="Telefono" type="tel" />
      </div>

      <div className="flex flex-col gap-3">
        <span className="input-label">Aree di interesse</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AREE.map((area) => (
            <label key={area} className="flex items-center gap-2 body-sm text-ink cursor-pointer">
              <input type="checkbox" name="areeInteresse" value={area} />
              {area}
            </label>
          ))}
        </div>
      </div>

      <FormField id="v-disponibilita" name="disponibilita" label="Disponibilità" rows={3} placeholder="Es. week-end, serate nei giorni feriali…" />

      {state.error && (
        <p className="body-sm text-accent">{state.error}</p>
      )}

      <div>
        <Btn type="submit" variant="dark" disabled={pending}>
          {pending ? 'Invio…' : 'Invia candidatura'}
        </Btn>
      </div>
    </form>
  )
}
