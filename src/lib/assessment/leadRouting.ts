import type { WebhookProcessPayload } from './types'

export type LeadTag = 'HOT' | 'WARM' | 'NURTURE' | 'DISQUALIFIED'

export function computeLeadTag(
  companyScore: number,
  processes: WebhookProcessPayload[],
): LeadTag {
  const hasHighProcess = processes.some(p => p.process_score >= 80)
  if (companyScore >= 70 || hasHighProcess) return 'HOT'
  if (companyScore >= 50) return 'WARM'
  if (companyScore >= 30) return 'NURTURE'
  return 'DISQUALIFIED'
}

export function isMigrationLead(migrationScore: number | null): boolean {
  return migrationScore !== null && migrationScore >= 60
}
