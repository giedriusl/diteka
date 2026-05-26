'use client'

import { useCountUp } from '@/hooks/useCountUp'
import type { BandLabel } from '@/lib/assessment/types'

const BAND_COLORS: Record<BandLabel, string> = {
  strong:       '#16a34a',
  good:         '#0d9488',
  moderate:     '#ca8a04',
  low:          '#ea580c',
  not_suitable: '#9ca3af',
}

const BAND_BG: Record<BandLabel, string> = {
  strong:       '#f0fdf4',
  good:         '#f0fdfa',
  moderate:     '#fefce8',
  low:          '#fff7ed',
  not_suitable: '#f9fafb',
}

interface ScoreArcProps {
  score: number
  band: BandLabel
  size?: number
  strokeWidth?: number
  animationDurationMs?: number
  bandLabel?: string
}

export function ScoreArc({
  score,
  band,
  size = 200,
  strokeWidth = 16,
  animationDurationMs = 1500,
  bandLabel,
}: ScoreArcProps) {
  const animated = useCountUp(score, animationDurationMs)

  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - animated / 100)
  const color = BAND_COLORS[band]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#E0DEDB"
            fill="none"
          />
          {/* Fill */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Score label centred over the SVG */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-live="polite"
          aria-label={`Score: ${score}%`}
        >
          <span
            className="font-serif text-4xl font-semibold leading-none tabular-nums"
            style={{ color }}
          >
            {Math.round(animated)}
            <span className="text-2xl">%</span>
          </span>
        </div>
      </div>

      {/* Band pill */}
      {bandLabel !== undefined && (
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: BAND_BG[band], color }}
        >
          {bandLabel}
        </span>
      )}
    </div>
  )
}
