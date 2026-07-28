"use server";

import { createClient } from "next-sanity";
import { z } from "zod";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export interface FormState {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
}

// Converts a Zod safeParse failure into a field -> first-message map.
function fieldErrors(error: z.ZodError): Record<string, string> {
  const flattened = error.flatten().fieldErrors;
  const out: Record<string, string> = {};
  for (const [field, messages] of Object.entries(flattened)) {
    if (messages && messages[0]) out[field] = messages[0];
  }
  return out;
}

const phoneRegex = /^[0-9+\-\s]{6,20}$/;

const contactSchema = z.object({
  nome: z.string().min(2, "Inserisci il tuo nome (almeno 2 caratteri)"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  oggetto: z.string().min(2, "Inserisci un oggetto (almeno 2 caratteri)"),
  messaggio: z.string().min(10, "Il messaggio deve avere almeno 10 caratteri"),
});

const volunteerSchema = z.object({
  nome: z.string().min(2, "Inserisci il tuo nome (almeno 2 caratteri)"),
  cognome: z.string().min(2, "Inserisci il tuo cognome (almeno 2 caratteri)"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  telefono: z
    .string()
    .regex(phoneRegex, "Numero di telefono non valido")
    .optional()
    .or(z.literal("")),
  disponibilita: z.string().optional(),
});

export async function submitContact(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("website")) return { success: false };

  const raw = {
    nome: String(formData.get("nome") ?? ""),
    email: String(formData.get("email") ?? ""),
    oggetto: String(formData.get("oggetto") ?? ""),
    messaggio: String(formData.get("messaggio") ?? ""),
  };
  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, errors: fieldErrors(result.error), values: raw };
  }

  try {
    await writeClient.create({
      _type: "contactSubmission",
      ...result.data,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Errore nell'invio. Riprova più tardi." };
  }
}

const scInterestSchema = z.object({
  nome: z.string().min(2, "Inserisci il tuo nome (almeno 2 caratteri)"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  eta: z.string().optional(),
  progetto: z.string().optional(),
  motivo: z.string().optional(),
});

export async function submitScInterest(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("website")) return { success: false };

  const result = scInterestSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    eta: formData.get("eta") || undefined,
    progetto: formData.get("progetto") || undefined,
    motivo: formData.get("motivo") || undefined,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Dati non validi",
      errors: fieldErrors(result.error),
    };
  }

  const { nome, email, eta, progetto, motivo } = result.data;
  const oggetto = progetto
    ? `Interesse SC – ${progetto}`
    : "Interesse Servizio Civile";
  const messageLines = [
    eta ? `Età: ${eta}` : null,
    progetto ? `Progetto: ${progetto}` : null,
    motivo ? `\nMotivazione:\n${motivo}` : null,
  ].filter((l): l is string => l !== null);

  try {
    await writeClient.create({
      _type: "contactSubmission",
      nome,
      email,
      oggetto,
      messaggio: messageLines.join("\n"),
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Errore nell'invio. Riprova più tardi." };
  }
}

export async function submitVolunteer(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("website")) return { success: false };

  const raw = {
    nome: String(formData.get("nome") ?? ""),
    cognome: String(formData.get("cognome") ?? ""),
    email: String(formData.get("email") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    disponibilita: String(formData.get("disponibilita") ?? ""),
  };
  const result = volunteerSchema.safeParse({
    ...raw,
    telefono: raw.telefono || undefined,
    disponibilita: raw.disponibilita || undefined,
  });

  if (!result.success) {
    return { success: false, errors: fieldErrors(result.error), values: raw };
  }

  const areeInteresse = formData
    .getAll("areeInteresse")
    .filter((a): a is string => typeof a === "string");

  try {
    await writeClient.create({
      _type: "volunteerSubmission",
      ...result.data,
      areeInteresse,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Errore nell'invio. Riprova più tardi." };
  }
}
