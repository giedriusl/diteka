import { createElement, type ReactElement } from 'react'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import { ReportDocument } from './report-pdf'
import type { WebhookPayload } from './types'

export async function generatePdf(payload: WebhookPayload): Promise<Buffer> {
  const element = createElement(ReportDocument, { payload }) as ReactElement<DocumentProps>
  return renderToBuffer(element)
}
