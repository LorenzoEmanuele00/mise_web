import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

const TAG_MAP: Record<string, string[]> = {
  settings: ["settings"],
  page: ["page"],
  post: ["post"],
  servizio: ["servizio"],
  mezzo: ["mezzo"],
  servizioCivile: ["servizioCivile"],
  galleria: ["galleria"],
};

// Form submissions are not rendered on the site: nothing to refresh.
const IGNORED_TYPES = new Set(["contactSubmission", "volunteerSubmission"]);

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret)
    return new Response("Webhook secret not configured", { status: 500 });

  const { body, isValidSignature } = await parseBody<{ _type?: string }>(
    req,
    secret,
    false,
  );

  if (!isValidSignature) return new Response("Unauthorized", { status: 401 });
  if (!body) return new Response("Invalid JSON", { status: 400 });

  const type = body._type;
  if (!type) return new Response("Missing _type", { status: 400 });

  if (IGNORED_TYPES.has(type)) {
    return new Response(`Ignored: ${type}`, { status: 200 });
  }

  const tags = TAG_MAP[type];
  if (!tags) {
    // Still 200 so Sanity does not retry, but visible in the Vercel logs:
    // a new document type needs an entry in TAG_MAP to refresh the site.
    console.warn(`[revalidate] Nessun tag per il tipo "${type}": niente da invalidare`);
    return new Response(`No tags for type: ${type}`, { status: 200 });
  }

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return new Response(`Revalidated: ${tags.join(", ")}`, { status: 200 });
}
