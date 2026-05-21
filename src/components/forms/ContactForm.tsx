'use client'

import { useActionState } from 'react'
import { submitContact, type FormState } from '@/app/actions/submitForms'
import Btn from '@/components/ui/Btn'
import FormField from '@/components/forms/FormField'
import FormSuccess from '@/components/forms/FormSuccess'

const initial: FormState = { success: false }

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.success) {
    return <FormSuccess heading="Messaggio ricevuto" body="Ti risponderemo il prima possibile." />
  }

  return (
    <form action={action} className="flex flex-col gap-8">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <FormField id="c-nome" name="nome" label="Nome" required />
      <FormField id="c-email" name="email" label="Email" type="email" required />
      <FormField id="c-oggetto" name="oggetto" label="Oggetto" required />
      <FormField id="c-messaggio" name="messaggio" label="Messaggio" rows={5} required />

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
