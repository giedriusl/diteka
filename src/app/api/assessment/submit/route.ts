import { NextRequest, NextResponse } from 'next/server'
import type { WebhookPayload } from '@/lib/assessment/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let payload: WebhookPayload

  try {
    payload = (await request.json()) as WebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!payload.email || !EMAIL_RE.test(payload.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  if (!payload.processes || payload.processes.length === 0) {
    return NextResponse.json({ error: 'At least one process required' }, { status: 400 })
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[assessment/submit] N8N_WEBHOOK_URL not set — skipping webhook forward')
    return NextResponse.json({ ok: true })
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!upstream.ok) {
      console.error('[assessment/submit] Upstream returned', upstream.status)
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
    }
  } catch (err) {
    console.error('[assessment/submit] Upstream unreachable', err)
    return NextResponse.json({ error: 'Upstream unreachable' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
