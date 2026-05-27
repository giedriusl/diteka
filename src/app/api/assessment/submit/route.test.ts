import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { WebhookPayload } from '@/lib/assessment/types'

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
  // Dynamically import after env is set so the module picks up the env var
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/assessment/submit', () => {
  const WEBHOOK = 'https://n8n.example.com/webhook/test'

  beforeEach(() => {
    delete process.env.N8N_WEBHOOK_URL
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
    delete process.env.N8N_WEBHOOK_URL
  })

  it('returns 400 for missing email', async () => {
    const res = await callRoute(makePayload({ email: '' }), { N8N_WEBHOOK_URL: WEBHOOK })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/email/i)
  })

  it('returns 400 for malformed email', async () => {
    const res = await callRoute(makePayload({ email: 'not-an-email' }), { N8N_WEBHOOK_URL: WEBHOOK })
    expect(res.status).toBe(400)
  })

  it('returns 400 for empty processes array', async () => {
    const res = await callRoute(makePayload({ processes: [] }), { N8N_WEBHOOK_URL: WEBHOOK })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON body', async () => {
    vi.resetModules()
    process.env.N8N_WEBHOOK_URL = WEBHOOK
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

  it('returns 200 ok when N8N_WEBHOOK_URL is not set (graceful degradation)', async () => {
    const res = await callRoute(makePayload())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  it('forwards payload to n8n and returns { ok: true }', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }))
    const res = await callRoute(makePayload(), { N8N_WEBHOOK_URL: WEBHOOK })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(fetch).toHaveBeenCalledWith(WEBHOOK, expect.objectContaining({ method: 'POST' }))
  })

  it('returns 502 when upstream returns non-OK status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('', { status: 503 }))
    const res = await callRoute(makePayload(), { N8N_WEBHOOK_URL: WEBHOOK })
    expect(res.status).toBe(502)
  })

  it('returns 502 when upstream fetch throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('ECONNREFUSED'))
    const res = await callRoute(makePayload(), { N8N_WEBHOOK_URL: WEBHOOK })
    expect(res.status).toBe(502)
  })

  it('does not include internal error details in response body', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('secret internal path /home/app'))
    const res = await callRoute(makePayload(), { N8N_WEBHOOK_URL: WEBHOOK })
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('secret')
    expect(JSON.stringify(body)).not.toContain('/home')
  })

  it('forwards the correct Content-Type header to n8n', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }))
    await callRoute(makePayload(), { N8N_WEBHOOK_URL: WEBHOOK })
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect((init as RequestInit).headers).toMatchObject({ 'Content-Type': 'application/json' })
  })
})
