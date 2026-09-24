// Shared between the form components (client) and the server actions.

export const HONEYPOT_FIELD = "website";
export const FILL_TIME_FIELD = "formFillMs";

// Humans need more than this to fill any of our forms; bots post instantly.
export const MIN_FILL_MS = 3000;

export const VOLUNTEER_AREAS = [
  "Emergenza",
  "Assistenza anziani",
  "Trasporti",
  "Gestione mezzi",
  "Ufficio",
  "Formazione",
] as const;

export type SpamVerdict = "ok" | "honeypot" | "too-fast";

// Classifies a submission using the honeypot field and the fill time added
// by <HoneypotFields />. A missing or malformed fill time counts as
// "too-fast": it means the form was posted without running our client code.
export function checkSpam(formData: FormData): SpamVerdict {
  if (formData.get(HONEYPOT_FIELD)) return "honeypot";

  const fillMs = Number(formData.get(FILL_TIME_FIELD) ?? NaN);
  if (!Number.isFinite(fillMs) || fillMs < MIN_FILL_MS) return "too-fast";

  return "ok";
}
