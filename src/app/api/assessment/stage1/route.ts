import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, upsertContact } from '@/lib/assessment/brevo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Stage1Payload {
  email: string
  language: string
  company_name: string
  sector: string
  company_size: string
  pain_point: string
  directional_score: number
}

export async function POST(request: NextRequest) {
  let body: Stage1Payload

  try {
    body = (await request.json()) as Stage1Payload
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  if (!process.env.BREVO_API_KEY) {
    console.warn('[assessment/stage1] BREVO_API_KEY not set — skipping')
    return NextResponse.json({ ok: true })
  }

  try {
    const isLt = body.language === 'lt'
    await sendEmail({
      to: [{ email: body.email }],
      subject: isLt
        ? `Jūsų automatizavimo potencialas: ~${body.directional_score}%`
        : `Your automation potential: ~${body.directional_score}%`,
      htmlContent: buildStage1Html(body),
    })

    await upsertContact(body.email, {
      COMPANY_NAME: body.company_name,
      SECTOR: body.sector,
      COMPANY_SIZE: body.company_size,
      PAIN_POINT: body.pain_point,
      DIRECTIONAL_SCORE: body.directional_score,
      LEAD_TAG: 'STAGE_1_ONLY',
    })
  } catch (err) {
    console.error('[assessment/stage1] Brevo error', err)
  }

  return NextResponse.json({ ok: true })
}

function buildStage1Html(body: Stage1Payload): string {
  const en = body.language !== 'lt'
  const score = Number(body.directional_score)
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#37322F">
  <h1 style="font-size:28px">~${score}% ${en ? 'Automation Potential' : 'Automatizavimo potencialas'}</h1>
  <p>${en
    ? 'This is a directional estimate based on your company-wide signals.'
    : 'Tai kryptinis įvertis, pagrįstas jūsų įmonės signalais.'}</p>
  <p>${en
    ? 'To get your accurate score, assess a specific process at'
    : 'Norėdami gauti tikslų balą, įvertinkite konkretų procesą:'}
    <a href="https://diteka.lt/assessment" style="color:#37322F">diteka.lt/assessment</a>
  </p>
  <hr style="border:none;border-top:1px solid #E0DEDB;margin:24px 0"/>
  <p style="font-size:12px;color:#9ca3af">Diteka · ${en ? 'AI Consulting' : 'Dirbtinio intelekto konsultacijos'}</p>
</div>`.trim()
}
