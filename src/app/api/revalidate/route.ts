import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import type { NextRequest } from 'next/server'

const TAG_MAP: Record<string, string[]> = {
  settings:       ['settings'],
  page:           ['page'],
  post:           ['post'],
  servizio:       ['servizio'],
  mezzo:          ['mezzo'],
  servizioCivile: ['servizioCivile'],
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook secret not configured', { status: 500 })

  const { body, isValidSignature } = await parseBody<{ _type?: string }>(req, secret, false)

  if (!isValidSignature) return new Response('Unauthorized', { status: 401 })
  if (!body) return new Response('Invalid JSON', { status: 400 })

  const tags = body._type ? TAG_MAP[body._type] : undefined
  if (tags) {
    for (const tag of tags) revalidateTag(tag, { expire: 0 })
  }

  return new Response('OK', { status: 200 })
}
