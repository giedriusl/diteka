import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { WebhookPayload } from '@/lib/assessment/types'

// Mock PDF generation so tests don't need @react-pdf/renderer
vi.mock('@/lib/assessment/generatePdf', () => ({
  generatePdf: vi.fn().mockResolvedValue(Buffer.from('fake-pdf')),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePayload(overrides: Partial<WebhookPayload> = {}): WebhookPayload {
  return {
    email: 'user@example.com',
    language: 'en',
    company_name: 'UAB Test',
    sector: 'manufacturing',
    company_size: 's',
    pain_point: 'staff',
    company_score: 74,
    processes: [
      {
        name: 'Invoice processing',
        scores: { D1: 4, D2: 3, D3: 2, D4: 3, D5: 4, D6: 2, D7: 3, D8: 5 },
        process_score: 68,
        hours_per_week: 10,
        annual_hours_saved: 354,
        knockout: null,
      },
    ],
    db_module_completed: false,
    db_scores: null,
    migration_score: null,
    submitted_at: '2026-05-26T10:00:00Z',
    ...overrides,
  }
}

async function callRoute(payload: unknown, env: Record<string, string> = {}) {
  vi.resetModules()
  for (const [k, v] of Object.entries(env)) {
    process.env[k] = v
  }

  const { POST } = await import('./route')
  const { NextRequest } = await import('next/server')

  const req = new NextRequest('http://localhost/api/assessment/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return POST(req)
}

const BREVO_KEY = 'test-brevo-key'

function mockBrevoSuccess() {
  vi.mocked(fetch)
    .mockResolvedValueOnce(new Response('{}', { status: 201 })) // sendEmail
    .mockResolvedValueOnce(new Response('{}', { status: 201 })) // upsertContact
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/assessment/submit', () => {
  beforeEach(() => {
    delete process.env.BREVO_API_KEY
    delete process.env.HOT_LEAD_ALERT_EMAIL
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
    delete process.env.BREVO_API_KEY
    delete process.env.HOT_LEAD_ALERT_EMAIL
  })

  // ─── Validation ────────────────────────────────────────────────────────────

  it('returns 400 for missing email', async () => {
    const res = await callRoute(makePayload({ email: '' }), { BREVO_API_KEY: BREVO_KEY })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/email/i)
  })

  it('returns 400 for malformed email', async () => {
    const res = await callRoute(makePayload({ email: 'not-an-email' }), { BREVO_API_KEY: BREVO_KEY })
    expect(res.status).toBe(400)
  })

  it('returns 400 for empty processes array', async () => {
    const res = await callRoute(makePayload({ processes: [] }), { BREVO_API_KEY: BREVO_KEY })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON body', async () => {
    vi.resetModules()
    process.env.BREVO_API_KEY = BREVO_KEY
    const { POST } = await import('./route')
    const { NextRequest } = await import('next/server')
    const req = new NextRequest('http://localhost/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json{{',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  // ─── Graceful degradation ──────────────────────────────────────────────────

  it('returns 200 ok when BREVO_API_KEY is not set', async () => {
    const res = await callRoute(makePayload())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(fetch).not.toHaveBeenCalled()
  })

  // ─── Brevo integration ─────────────────────────────────────────────────────

  it('sends email and upserts contact via Brevo', async () => {
    mockBrevoSuccess()
    const res = await callRoute(makePayload(), { BREVO_API_KEY: BREVO_KEY })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)

    const calls = vi.mocked(fetch).mock.calls
    expect(calls.length).toBe(2)
    expect(calls[0][0]).toBe('https://api.brevo.com/v3/smtp/email')
    expect(calls[1][0]).toBe('https://api.brevo.com/v3/contacts')
  })

  it('sends correct Content-Type header to Brevo', async () => {
    mockBrevoSuccess()
    await callRoute(makePayload(), { BREVO_API_KEY: BREVO_KEY })
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect((init as RequestInit).headers).toMatchObject({ 'Content-Type': 'application/json' })
  })

  it('HOT lead (score >= 70) triggers alert email', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('{}', { status: 201 })) // report email
      .mockResolvedValueOnce(new Response('{}', { status: 201 })) // upsertContact
      .mockResolvedValueOnce(new Response('{}', { status: 201 })) // alert email

    const res = await callRoute(
      makePayload({ company_score: 75 }),
      { BREVO_API_KEY: BREVO_KEY, HOT_LEAD_ALERT_EMAIL: 'sales@diteka.lt' },
    )
    expect(res.status).toBe(200)
    expect(vi.mocked(fetch).mock.calls.length).toBe(3)
  })

  it('WARM lead does not trigger alert when HOT_LEAD_ALERT_EMAIL unset', async () => {
    mockBrevoSuccess()
    const res = await callRoute(
      makePayload({ company_score: 60 }),
      { BREVO_API_KEY: BREVO_KEY },
    )
    expect(res.status).toBe(200)
    expect(vi.mocked(fetch).mock.calls.length).toBe(2)
  })

  it('non-HOT/WARM lead never triggers alert even with alert email set', async () => {
    mockBrevoSuccess()
    const res = await callRoute(
      makePayload({ company_score: 25 }),
      { BREVO_API_KEY: BREVO_KEY, HOT_LEAD_ALERT_EMAIL: 'sales@diteka.lt' },
    )
    expect(res.status).toBe(200)
    expect(vi.mocked(fetch).mock.calls.length).toBe(2)
  })

  // ─── Error resilience ──────────────────────────────────────────────────────

  it('returns 200 ok when Brevo email call throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('ECONNREFUSED'))
    const res = await callRoute(makePayload(), { BREVO_API_KEY: BREVO_KEY })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  it('does not leak internal error details in response body', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('secret internal path /home/app'))
    const res = await callRoute(makePayload(), { BREVO_API_KEY: BREVO_KEY })
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('secret')
    expect(JSON.stringify(body)).not.toContain('/home')
  })
})
