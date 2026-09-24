"use server";

import { createClient } from "next-sanity";
import { z } from "zod";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { checkSpam, VOLUNTEER_AREAS } from "@/lib/forms";

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

const SEND_ERROR = "Errore nell'invio. Riprova più tardi.";
const TOO_FAST_ERROR = "Invio non riuscito. Attendi qualche secondo e riprova.";

// Upper bounds keep a single submission from writing oversized documents.
const MAX = {
  name: 100,
  email: 254,
  subject: 200,
  longText: 5000,
  age: 20,
  project: 100,
} as const;

// Converts a Zod safeParse failure into a field -> first-message map.
function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !out[field]) out[field] = issue.message;
  }
  return out;
}

// Returns the early response for spam, or null when the submission may proceed.
// Honeypot hits get a silent failure so bots learn nothing.
function rejectSpam(formData: FormData): FormState | null {
  const verdict = checkSpam(formData);
  if (verdict === "honeypot") return { success: false };
  if (verdict === "too-fast") return { success: false, error: TOO_FAST_ERROR };
  return null;
}

// Logs a failed Sanity write without the submitted personal data.
function logWriteError(action: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[${action}] Sanity write failed: ${detail}`);
}

const phoneRegex = /^[0-9+\-\s]{6,20}$/;

const nameField = (label: string) =>
  z
    .string()
    .min(2, `Inserisci il tuo ${label} (almeno 2 caratteri)`)
    .max(MAX.name, `Il ${label} può avere al massimo ${MAX.name} caratteri`);

const emailField = z
  .string()
  .max(MAX.email, "Indirizzo email troppo lungo")
  .email("Inserisci un indirizzo email valido");

const longTextField = (label: string) =>
  z
    .string()
    .max(MAX.longText, `${label}: massimo ${MAX.longText} caratteri`);

const contactSchema = z.object({
  nome: nameField("nome"),
  email: emailField,
  oggetto: z
    .string()
    .min(2, "Inserisci un oggetto (almeno 2 caratteri)")
    .max(MAX.subject, `L'oggetto può avere al massimo ${MAX.subject} caratteri`),
  messaggio: longTextField("Messaggio").min(
    10,
    "Il messaggio deve avere almeno 10 caratteri",
  ),
});

const volunteerSchema = z.object({
  nome: nameField("nome"),
  cognome: nameField("cognome"),
  email: emailField,
  telefono: z
    .string()
    .regex(phoneRegex, "Numero di telefono non valido")
    .optional()
    .or(z.literal("")),
  disponibilita: longTextField("Disponibilità").optional(),
  areeInteresse: z.array(z.enum(VOLUNTEER_AREAS)).max(VOLUNTEER_AREAS.length),
});

export async function submitContact(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const spam = rejectSpam(formData);
  if (spam) return spam;

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
  } catch (error) {
    logWriteError("submitContact", error);
    return { success: false, error: SEND_ERROR };
  }
}

const scInterestSchema = z.object({
  nome: nameField("nome"),
  email: emailField,
  eta: z.string().max(MAX.age, "Età: massimo 20 caratteri").optional(),
  progetto: z.string().max(MAX.project, "Progetto non valido").optional(),
  motivo: longTextField("Motivazione").optional(),
});

export async function submitScInterest(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const spam = rejectSpam(formData);
  if (spam) return spam;

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
  } catch (error) {
    logWriteError("submitScInterest", error);
    return { success: false, error: SEND_ERROR };
  }
}

export async function submitVolunteer(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const spam = rejectSpam(formData);
  if (spam) return spam;

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
    areeInteresse: formData.getAll("areeInteresse"),
  });

  if (!result.success) {
    return { success: false, errors: fieldErrors(result.error), values: raw };
  }

  try {
    await writeClient.create({
      _type: "volunteerSubmission",
      ...result.data,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    logWriteError("submitVolunteer", error);
    return { success: false, error: SEND_ERROR };
  }
}
