'use client'

import styles from './questionnaire.module.css'

interface ProgressBarProps {
  currentStep: number
  stage1Label: string
  stage2Label: string
}

// Steps 1–2 = Stage 1 (2 steps), steps 3–7 = Stage 2 (5 steps)
const STAGE1_STEPS = 2
const STAGE2_STEPS = 5

export function ProgressBar({ currentStep, stage1Label, stage2Label }: ProgressBarProps) {
  const stage1Pct = currentStep <= STAGE1_STEPS
    ? Math.round((currentStep / STAGE1_STEPS) * 100)
    : 100

  const stage2Pct = currentStep > STAGE1_STEPS
    ? Math.round(((currentStep - STAGE1_STEPS) / STAGE2_STEPS) * 100)
    : 0

  const inStage2 = currentStep > STAGE1_STEPS

  return (
    <div className="w-full px-4 pt-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={7}>
      <div className="flex gap-3">
        {/* Stage 1 segment */}
        <div className="flex flex-1 flex-col gap-1">
          <span className={`text-xs font-medium ${!inStage2 ? 'text-[#37322F]' : 'text-[#9ca3af]'}`}>
            {stage1Label}
          </span>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#E0DEDB]">
            <div
              className={styles.progressFill}
              style={{ width: `${stage1Pct}%`, height: '100%', background: '#37322F', borderRadius: '9999px' }}
            />
          </div>
        </div>

        {/* Stage 2 segment */}
        <div className="flex flex-1 flex-col gap-1">
          <span className={`text-xs font-medium ${inStage2 ? 'text-[#37322F]' : 'text-[#9ca3af]'}`}>
            {stage2Label}
          </span>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#E0DEDB]">
            <div
              className={styles.progressFill}
              style={{ width: `${stage2Pct}%`, height: '100%', background: '#37322F', borderRadius: '9999px' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
