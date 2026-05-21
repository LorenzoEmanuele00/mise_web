'use client'

import { useActionState } from 'react'
import { submitContact, type FormState } from '@/app/actions/submitForms'
import Btn from '@/components/ui/Btn'

const initial: FormState = { success: false }

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.success) {
    return (
      <div className="p-8" style={{ backgroundColor: 'var(--color-bg-elev)', border: '1px solid var(--color-hair)' }}>
        <p className="h-3 text-ink mb-2">Messaggio ricevuto</p>
        <p className="body" style={{ color: 'var(--color-ink-soft)' }}>Ti risponderemo il prima possibile.</p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-8">
      {/* honeypot — nascosto ai visitatori reali */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="flex flex-col gap-1">
        <label className="input-label" htmlFor="c-nome">Nome *</label>
        <input id="c-nome" name="nome" type="text" className="input" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="input-label" htmlFor="c-email">Email *</label>
        <input id="c-email" name="email" type="email" className="input" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="input-label" htmlFor="c-oggetto">Oggetto *</label>
        <input id="c-oggetto" name="oggetto" type="text" className="input" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="input-label" htmlFor="c-messaggio">Messaggio *</label>
        <textarea
          id="c-messaggio"
          name="messaggio"
          className="input"
          rows={5}
          required
          style={{ resize: 'none' }}
        />
      </div>

      {state.error && (
        <p className="body-sm" style={{ color: 'var(--color-accent)' }}>{state.error}</p>
      )}

      <div>
        <Btn type="submit" variant="dark" disabled={pending}>
          {pending ? 'Invio…' : 'Invia messaggio'}
        </Btn>
      </div>
    </form>
  )
}
