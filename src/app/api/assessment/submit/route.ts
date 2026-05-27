import { NextRequest, NextResponse } from 'next/server'
import type { WebhookPayload } from '@/lib/assessment/types'
import { sendEmail, upsertContact } from '@/lib/assessment/brevo'
import { computeLeadTag, isMigrationLead } from '@/lib/assessment/leadRouting'
import { generatePdf } from '@/lib/assessment/generatePdf'

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

  if (!process.env.BREVO_API_KEY) {
    console.warn('[assessment/submit] BREVO_API_KEY not set — skipping')
    return NextResponse.json({ ok: true })
  }

  const leadTag = computeLeadTag(payload.company_score, payload.processes)
  const migrationLead = isMigrationLead(payload.migration_score)

  let pdfBase64: string | null = null
  try {
    const buf = await generatePdf(payload)
    pdfBase64 = buf.toString('base64')
  } catch (err) {
    console.error('[assessment/submit] PDF generation failed', err)
  }

  try {
    await sendEmail({
      to: [{ email: payload.email }],
      subject: buildReportSubject(payload),
      htmlContent: buildReportHtml(payload, leadTag),
      ...(pdfBase64
        ? { attachment: [{ content: pdfBase64, name: 'Diteka_Automation_Report.pdf' }] }
        : {}),
    })

    const tags = [leadTag, ...(migrationLead ? ['MIGRATION_LEAD'] : [])]
    await upsertContact(payload.email, {
      COMPANY_NAME: payload.company_name,
      SECTOR: payload.sector,
      COMPANY_SIZE: payload.company_size,
      PAIN_POINT: payload.pain_point,
      COMPANY_SCORE: payload.company_score,
      LEAD_TAG: tags.join(','),
    })

    if ((leadTag === 'HOT' || leadTag === 'WARM') && process.env.HOT_LEAD_ALERT_EMAIL) {
      await sendEmail({
        to: [{ email: process.env.HOT_LEAD_ALERT_EMAIL }],
        subject: `[${leadTag}] New lead: ${payload.email} — ${payload.company_score}%`,
        htmlContent: `<p><strong>${leadTag}</strong> lead from ${payload.email}<br>
          Company: ${payload.company_name}<br>
          Score: ${payload.company_score}%<br>
          Sector: ${payload.sector}</p>`,
      })
    }
  } catch (err) {
    console.error('[assessment/submit] Brevo error', err)
  }

  return NextResponse.json({ ok: true })
}

function buildReportSubject(payload: WebhookPayload): string {
  const en = payload.language !== 'lt'
  return en
    ? `Your Diteka Automation Report — ${payload.company_score}% potential`
    : `Jūsų Diteka automatizavimo ataskaita — ${payload.company_score}% potencialas`
}

function buildReportHtml(payload: WebhookPayload, leadTag: string): string {
  const en = payload.language !== 'lt'
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#37322F">
  <h1 style="font-size:28px">${payload.company_score}% ${en ? 'Automation Potential' : 'Automatizavimo potencialas'}</h1>
  <p>${en
    ? 'Your full report is attached as a PDF.'
    : 'Pilna ataskaita pridėta kaip PDF.'}</p>
  <p>${en
    ? "We'll be in touch within 2 working days to discuss your results."
    : 'Susisieksime per 2 darbo dienas aptarti jūsų rezultatų.'}</p>
  ${leadTag === 'HOT' || leadTag === 'WARM'
    ? `<p><strong>${en ? "You're a strong automation candidate." : 'Jūs esate stiprus automatizavimo kandidatas.'}</strong></p>`
    : ''}
  <hr style="border:none;border-top:1px solid #E0DEDB;margin:24px 0"/>
  <p style="font-size:12px;color:#9ca3af">Diteka · ${en ? 'AI Consulting' : 'Dirbtinio intelekto konsultacijos'}</p>
</div>`.trim()
}
