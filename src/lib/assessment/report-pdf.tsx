import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  Circle,
  Path,
} from '@react-pdf/renderer'
import type { WebhookPayload, SectorKey, BandLabel } from './types'
import { getScoreBand, getAutomationBenchmark } from './scoring'

// ─── Brand constants ──────────────────────────────────────────────────────────

const BAND_COLORS: Record<BandLabel, string> = {
  strong: '#16a34a',
  good: '#0d9488',
  moderate: '#ca8a04',
  low: '#ea580c',
  not_suitable: '#9ca3af',
}

const BAND_LABELS: Record<BandLabel, string> = {
  strong: 'Strong Candidate',
  good: 'Good Candidate',
  moderate: 'Moderate Potential',
  low: 'Low Suitability',
  not_suitable: 'Not Suitable',
}

const SECTOR_LABELS: Record<SectorKey, string> = {
  manufacturing: 'Manufacturing',
  logistics: 'Logistics / Transport',
  wholesale: 'Wholesale / Distribution',
  services: 'Professional Services',
  retail: 'Retail',
  other: 'Other',
}

const SIZE_LABELS: Record<string, string> = {
  xs: '1–10 employees',
  s: '11–50 employees',
  m: '51–200 employees',
  l: '200+ employees',
}

const DIM_META: Record<string, { label: string; weight: number }> = {
  D1: { label: 'Rule-Basedness', weight: 25 },
  D2: { label: 'Volume', weight: 8 },
  D3: { label: 'Input Digitisation', weight: 20 },
  D4: { label: 'Data Structure', weight: 15 },
  D5: { label: 'Standardisation', weight: 15 },
  D6: { label: 'System Complexity', weight: 2 },
  D7: { label: 'Error Rate', weight: 5 },
  D8: { label: 'Process Stability', weight: 10 },
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#37322F',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1pt solid #E0DEDB',
  },
  brand: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#37322F' },
  headerMeta: { fontSize: 8, color: '#9ca3af', textAlign: 'right' },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 12,
  },
  scoreText: { flex: 1 },
  scoreNumber: { fontSize: 36, fontFamily: 'Helvetica-Bold', lineHeight: 1 },
  scoreBand: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 3 },
  benchmarkLine: { fontSize: 9, color: '#605A57', marginTop: 5, lineHeight: 1.5 },
  contextRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#F7F5F3',
    borderRadius: 3,
    fontSize: 8,
    color: '#605A57',
  },
  divider: { borderBottom: '0.5pt solid #E0DEDB', marginVertical: 12 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  processCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F7F5F3',
    borderRadius: 4,
  },
  processHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  processName: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  processScore: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  barTrack: {
    height: 4,
    backgroundColor: '#E0DEDB',
    borderRadius: 2,
    marginBottom: 8,
  },
  barFill: { height: 4, borderRadius: 2 },
  dimTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingBottom: 2,
    borderBottom: '0.5pt solid #E0DEDB',
  },
  dimRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dimLabel: { fontSize: 8, color: '#605A57', flex: 1 },
  dimVal: { fontSize: 8, color: '#37322F', width: 24, textAlign: 'right' },
  dimWeight: { fontSize: 8, color: '#9ca3af', width: 28, textAlign: 'right' },
  savingsNote: { fontSize: 8, color: '#605A57', marginTop: 5 },
  knockoutBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FEF2F2',
    borderRadius: 3,
  },
  knockoutText: { fontSize: 8, color: '#dc2626' },
  migrationCard: {
    padding: 10,
    backgroundColor: '#F0FDFA',
    borderRadius: 4,
    marginBottom: 12,
  },
  ctaBlock: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTop: '0.5pt solid #E0DEDB',
  },
  ctaLine: { fontSize: 9, color: '#605A57' },
  ctaCallout: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#37322F', marginTop: 3 },
  footerNote: { fontSize: 7, color: '#9ca3af', marginTop: 6 },
})

// ─── Score arc SVG ────────────────────────────────────────────────────────────

function arcPath(cx: number, cy: number, r: number, score: number): string {
  const pct = Math.min(Math.max(score, 0.1), 99.9) / 100
  const startRad = -Math.PI / 2
  const endRad = startRad + pct * 2 * Math.PI
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  const large = pct > 0.5 ? 1 : 0
  return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`
}

function ScoreArc({
  score,
  color,
  size = 90,
}: {
  score: number
  color: string
  size?: number
}) {
  const cx = size / 2
  const cy = size / 2
  const r = (size - 14) / 2

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cx} cy={cy} r={r} stroke="#E0DEDB" strokeWidth={7} fill="none" />
      <Path d={arcPath(cx, cy, r, score)} stroke={color} strokeWidth={7} fill="none" />
    </Svg>
  )
}

// ─── Report document ──────────────────────────────────────────────────────────

export function ReportDocument({ payload }: { payload: WebhookPayload }) {
  const band = getScoreBand(payload.company_score)
  const benchmark = getAutomationBenchmark(payload.sector)
  const color = BAND_COLORS[band]

  const totalHours = payload.processes.reduce((acc, p) => acc + p.annual_hours_saved, 0)
  const topProcess = [...payload.processes]
    .filter(p => p.knockout === null)
    .sort((a, b) => b.annual_hours_saved - a.annual_hours_saved)[0]

  const reportDate = new Date(payload.submitted_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document title="Automation Readiness Report" author="Diteka">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.brand}>Diteka</Text>
          <View style={s.headerMeta}>
            <Text>Automation Readiness Report</Text>
            <Text>{reportDate}</Text>
          </View>
        </View>

        {/* Score */}
        <View style={s.scoreRow}>
          <ScoreArc score={payload.company_score} color={color} />
          <View style={s.scoreText}>
            <Text style={[s.scoreNumber, { color }]}>{payload.company_score}%</Text>
            <Text style={[s.scoreBand, { color }]}>{BAND_LABELS[band]}</Text>
            <Text style={s.benchmarkLine}>
              Companies in {SECTOR_LABELS[payload.sector]} average {benchmark}% automation potential. You scored {payload.company_score}%. (McKinsey MGI, 2017)
            </Text>
            {totalHours > 0 && (
              <Text style={s.benchmarkLine}>
                {topProcess
                  ? `Your top process (${topProcess.name}) could save ~${topProcess.annual_hours_saved} hours/year (≈ ${Math.round(topProcess.annual_hours_saved / 8)} person-days).`
                  : `Combined savings potential: ~${totalHours} hours/year.`}
              </Text>
            )}
          </View>
        </View>

        {/* Company context tags */}
        <View style={s.contextRow}>
          <View style={s.tag}><Text>{SECTOR_LABELS[payload.sector]}</Text></View>
          <View style={s.tag}><Text>{SIZE_LABELS[payload.company_size] ?? payload.company_size}</Text></View>
        </View>

        <View style={s.divider} />

        {/* Process breakdown */}
        <Text style={s.sectionTitle}>Process Analysis</Text>

        {payload.processes.map((proc, i) => {
          const pBand = proc.knockout === null ? getScoreBand(proc.process_score) : 'not_suitable'
          const pColor = BAND_COLORS[pBand]
          const dims = Object.entries(proc.scores) as [string, number][]

          return (
            <View key={i} style={s.processCard} wrap={false}>
              <View style={s.processHeader}>
                <Text style={s.processName}>{proc.name || `Process ${i + 1}`}</Text>
                {proc.knockout !== null ? (
                  <View style={s.knockoutBadge}>
                    <Text style={s.knockoutText}>
                      {proc.knockout === 'no_compliance' ? 'Redesign in progress' : 'Needs AI augmentation'}
                    </Text>
                  </View>
                ) : (
                  <Text style={[s.processScore, { color: pColor }]}>{proc.process_score}%</Text>
                )}
              </View>

              {proc.knockout === null && (
                <>
                  <View style={s.barTrack}>
                    <View style={[s.barFill, { width: `${proc.process_score}%`, backgroundColor: pColor }]} />
                  </View>

                  <View style={s.dimTableHeader}>
                    <Text style={[s.dimLabel, { fontFamily: 'Helvetica-Bold' }]}>Dimension</Text>
                    <Text style={[s.dimVal, { fontFamily: 'Helvetica-Bold' }]}>Score</Text>
                    <Text style={[s.dimWeight, { fontFamily: 'Helvetica-Bold' }]}>Weight</Text>
                  </View>

                  {dims.map(([key, val]) => (
                    <View key={key} style={s.dimRow}>
                      <Text style={s.dimLabel}>{DIM_META[key]?.label ?? key}</Text>
                      <Text style={s.dimVal}>{val}/5</Text>
                      <Text style={s.dimWeight}>{DIM_META[key]?.weight ?? 0}%</Text>
                    </View>
                  ))}

                  {proc.annual_hours_saved > 0 && (
                    <Text style={s.savingsNote}>
                      Estimated savings: ~{proc.annual_hours_saved} hrs/year (≈ {Math.round(proc.annual_hours_saved / 8)} person-days)
                    </Text>
                  )}
                </>
              )}
            </View>
          )
        })}

        {/* Migration readiness */}
        {payload.db_module_completed && payload.migration_score !== null && (
          <>
            <View style={s.divider} />
            <Text style={s.sectionTitle}>Database Migration Readiness</Text>
            <View style={s.migrationCard}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#0d9488' }}>
                Migration readiness score: {payload.migration_score}%
              </Text>
              <Text style={{ fontSize: 8, color: '#605A57', marginTop: 3 }}>
                {payload.migration_score >= 60
                  ? 'Your data infrastructure is ready for migration. We recommend starting with a phased approach.'
                  : payload.migration_score >= 40
                    ? 'Some preparation is needed before migration. Data quality and integration planning are key first steps.'
                    : 'Migration complexity is high. A discovery workshop is recommended before committing to a timeline.'}
              </Text>
            </View>
          </>
        )}

        {/* CTA */}
        <View style={s.ctaBlock}>
          <Text style={s.ctaLine}>Ready to take the next step?</Text>
          <Text style={s.ctaCallout}>Book a free 30-minute discovery call → diteka.lt</Text>
          <Text style={s.footerNote}>
            Report prepared for {payload.email} · {reportDate} · Diteka — DI be streso
          </Text>
        </View>

      </Page>
    </Document>
  )
}
