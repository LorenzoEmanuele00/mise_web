'use client'

import { useActionState } from 'react'
import { submitVolunteer, type FormState } from '@/app/actions/submitForms'
import Btn from '@/components/ui/Btn'

const AREE = ['Emergenza', 'Assistenza anziani', 'Trasporti', 'Gestione mezzi', 'Ufficio', 'Formazione']
const initial: FormState = { success: false }

export default function VolunteerForm() {
  const [state, action, pending] = useActionState(submitVolunteer, initial)

  if (state.success) {
    return (
      <div className="p-8" style={{ backgroundColor: 'var(--color-bg-elev)', border: '1px solid var(--color-hair)' }}>
        <p className="h-3 text-ink mb-2">Candidatura ricevuta</p>
        <p className="body" style={{ color: 'var(--color-ink-soft)' }}>Ti contatteremo al più presto per i prossimi passi.</p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-8">
      {/* honeypot — nascosto ai visitatori reali */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-1">
          <label className="input-label" htmlFor="v-nome">Nome *</label>
          <input id="v-nome" name="nome" type="text" className="input" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="input-label" htmlFor="v-cognome">Cognome *</label>
          <input id="v-cognome" name="cognome" type="text" className="input" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-1">
          <label className="input-label" htmlFor="v-email">Email *</label>
          <input id="v-email" name="email" type="email" className="input" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="input-label" htmlFor="v-telefono">Telefono</label>
          <input id="v-telefono" name="telefono" type="tel" className="input" />
        </div>
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

      <div className="flex flex-col gap-1">
        <label className="input-label" htmlFor="v-disponibilita">Disponibilità</label>
        <textarea
          id="v-disponibilita"
          name="disponibilita"
          className="input"
          rows={3}
          placeholder="Es. week-end, serate nei giorni feriali…"
          style={{ resize: 'none' }}
        />
      </div>

      {state.error && (
        <p className="body-sm" style={{ color: 'var(--color-accent)' }}>{state.error}</p>
      )}

      <div>
        <Btn type="submit" variant="dark" disabled={pending}>
          {pending ? 'Invio…' : 'Invia candidatura'}
        </Btn>
      </div>
    </form>
  )
}
