import { NextRequest } from 'next/server'
import { createElement, type ReactElement } from 'react'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import { ReportDocument } from '@/lib/assessment/report-pdf'
import type { WebhookPayload } from '@/lib/assessment/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let payload: WebhookPayload

  try {
    payload = await request.json() as WebhookPayload
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload.email || typeof payload.company_score !== 'number' || !Array.isArray(payload.processes)) {
    return Response.json({ error: 'Missing required fields: email, company_score, processes' }, { status: 400 })
  }

  const element = createElement(ReportDocument, { payload }) as ReactElement<DocumentProps>
  const buffer = await renderToBuffer(element)

  const username = payload.email
    .split('@')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
  const date = new Date(payload.submitted_at ?? Date.now()).toISOString().split('T')[0]
  const filename = `Diteka_Automation_Report_${username}_${date}.pdf`

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
