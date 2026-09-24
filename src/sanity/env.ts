// Fails loudly instead of silently falling back: a forgotten dataset variable
// must not point a staging or preview build at production data.
function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Variabile d'ambiente mancante: ${name} (vedi .env.example)`);
  }
  return value;
}

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

// process.env.NEXT_PUBLIC_* must be referenced literally to be inlined
// into the client bundle.
export const dataset = requireEnv(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);
export const projectId = requireEnv(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);
