'use server'

import { createClient } from 'next-sanity'
import { z } from 'zod'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export interface FormState {
  success: boolean
  error?: string
}

const contactSchema = z.object({
  nome: z.string().min(2, 'Nome troppo corto'),
  email: z.string().email('Email non valida'),
  oggetto: z.string().min(2, 'Oggetto troppo corto'),
  messaggio: z.string().min(10, 'Messaggio troppo corto'),
})

const volunteerSchema = z.object({
  nome: z.string().min(2, 'Nome troppo corto'),
  cognome: z.string().min(2, 'Cognome troppo corto'),
  email: z.string().email('Email non valida'),
  telefono: z.string().optional(),
  disponibilita: z.string().optional(),
})

export async function submitContact(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get('website')) return { success: false }

  const result = contactSchema.safeParse({
    nome: formData.get('nome'),
    email: formData.get('email'),
    oggetto: formData.get('oggetto'),
    messaggio: formData.get('messaggio'),
  })

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Dati non validi' }
  }

  try {
    await writeClient.create({
      _type: 'contactSubmission',
      ...result.data,
      createdAt: new Date().toISOString(),
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Errore nell\'invio. Riprova più tardi.' }
  }
}

export async function submitVolunteer(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get('website')) return { success: false }

  const result = volunteerSchema.safeParse({
    nome: formData.get('nome'),
    cognome: formData.get('cognome'),
    email: formData.get('email'),
    telefono: formData.get('telefono') || undefined,
    disponibilita: formData.get('disponibilita') || undefined,
  })

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Dati non validi' }
  }

  const areeInteresse = formData
    .getAll('areeInteresse')
    .filter((a): a is string => typeof a === 'string')

  try {
    await writeClient.create({
      _type: 'volunteerSubmission',
      ...result.data,
      areeInteresse,
      createdAt: new Date().toISOString(),
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Errore nell\'invio. Riprova più tardi.' }
  }
}
