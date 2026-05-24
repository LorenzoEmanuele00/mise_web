import { revalidateTag } from 'next/cache'
import { createHmac, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'

const TAG_MAP: Record<string, string[]> = {
  settings:        ['settings'],
  page:            ['page'],
  post:            ['post'],
  servizio:        ['servizio'],
  mezzo:           ['mezzo'],
  servizioCivile:  ['servizioCivile'],
}

// Sanity signature header: "t=<unixTs>,v1=<hmac-sha256(secret, '<ts>.<body>')>"
function verifySignature(rawBody: string, header: string, secret: string): boolean {
  const match = header.match(/^t=(\d+),v1=([a-f0-9]+)$/)
  if (!match) return false
  const timestamp = match[1]!
  const received  = match[2]!
  const expected  = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')
  try {
    return timingSafeEqual(Buffer.from(received, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook secret not configured', { status: 500 })

  const rawBody = await req.text()
  const signature = req.headers.get('sanity-webhook-signature') ?? ''

  if (!verifySignature(rawBody, signature, secret)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { _type?: string }
  try {
    body = JSON.parse(rawBody) as { _type?: string }
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const tags = body._type ? TAG_MAP[body._type] : undefined
  if (tags) {
    for (const tag of tags) revalidateTag(tag, { expire: 0 })
  }

  return new Response('OK', { status: 200 })
}
