const BREVO_API = 'https://api.brevo.com/v3'

export interface BrevoEmailPayload {
  to: Array<{ email: string; name?: string }>
  subject: string
  htmlContent: string
  attachment?: Array<{ content: string; name: string }>
}

export async function sendEmail(payload: BrevoEmailPayload): Promise<void> {
  const key = process.env.BREVO_API_KEY
  if (!key) throw new Error('BREVO_API_KEY not set')

  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL ?? 'noreply@diteka.lt',
        name: process.env.BREVO_SENDER_NAME ?? 'Diteka',
      },
      ...payload,
    }),
  })

  if (!res.ok) throw new Error(`Brevo sendEmail failed: ${res.status}`)
}

export async function upsertContact(
  email: string,
  attributes: Record<string, unknown>,
  listIds?: number[],
): Promise<void> {
  const key = process.env.BREVO_API_KEY
  if (!key) throw new Error('BREVO_API_KEY not set')

  const res = await fetch(`${BREVO_API}/contacts`, {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, attributes, listIds, updateEnabled: true }),
  })

  if (!res.ok) throw new Error(`Brevo upsertContact failed: ${res.status}`)
}
