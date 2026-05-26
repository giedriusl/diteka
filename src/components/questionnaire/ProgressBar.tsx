'use client'

import styles from './questionnaire.module.css'

interface ProgressBarProps {
  currentStep: number   // 0–7
  totalSteps: number    // 8
  label: string         // pre-translated "Step X of 8"
}

export function ProgressBar({ currentStep, totalSteps, label }: ProgressBarProps) {
  // Step 0 (language splash) shows 0%; step 1 starts counting
  const percent = totalSteps <= 1 ? 0 : Math.round((currentStep / (totalSteps - 1)) * 100)

  return (
    <div className="w-full px-4 pt-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={0} aria-valuemax={totalSteps - 1} aria-label={label}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-[#605A57]">{label}</span>
        <span className="text-xs font-medium text-[#605A57]" aria-hidden="true">{percent}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[#E0DEDB]">
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%`, height: '100%', background: '#37322F', borderRadius: '9999px' }}
        />
      </div>
    </div>
  )
}
