'use client'

import { useState } from 'react'
import { useAssessmentSession } from '@/hooks/useAssessmentSession'
import { getT } from '@/lib/assessment/translations'
import { ProgressBar } from './ProgressBar'
import { LanguageToggle } from './LanguageToggle'
import { Step0Language } from './steps/Step0Language'
import { Step1Context } from './steps/Step1Context'
import { Step2DirectionalScore } from './steps/Step2DirectionalScore'
import { Step3Process } from './steps/Step3Process'
import { Step4ProcessScore } from './steps/Step4ProcessScore'
import { Step5DbModule } from './steps/Step5DbModule'
import { Step6EmailGate } from './steps/Step6EmailGate'
import { Step7ThankYou } from './steps/Step7ThankYou'
import styles from './questionnaire.module.css'

export function AssessmentQuestionnaire() {
  const { state, dispatch } = useAssessmentSession()
  const t = getT(state.language)
  const [confirmReset, setConfirmReset] = useState(false)

  const stepProps = { state, dispatch }

  function renderStep() {
    switch (state.step) {
      case 0: return <Step0Language {...stepProps} />
      case 1: return <Step1Context {...stepProps} />
      case 2: return <Step2DirectionalScore {...stepProps} />
      case 3: return <Step3Process {...stepProps} />
      case 4: return <Step4ProcessScore {...stepProps} />
      case 5: return <Step5DbModule {...stepProps} />
      case 6: return <Step6EmailGate {...stepProps} />
      case 7: return <Step7ThankYou {...stepProps} />
      default: return null
    }
  }

  function handleReset() {
    dispatch({ type: 'RESET' })
    setConfirmReset(false)
  }

  const showReset = state.step >= 1
  const needsConfirm = state.step < 7

  return (
    <div className="relative w-full">
      {state.step > 0 && (
        <div className="flex items-start justify-between">
          <LanguageToggle
            language={state.language}
            onToggle={() =>
              dispatch({
                type: 'SET_LANGUAGE',
                language: state.language === 'en' ? 'lt' : 'en',
              })
            }
          />
          {showReset && (
            <div className="px-4 pt-4 text-right">
              {confirmReset ? (
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs text-[#605A57]">{t.reset.confirm}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="text-xs text-[#605A57] underline underline-offset-2 hover:text-[#37322F]"
                    >
                      {t.reset.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs font-medium text-[#ea580c] underline underline-offset-2 hover:text-[#c2410c]"
                    >
                      {t.reset.yes}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => needsConfirm ? setConfirmReset(true) : handleReset()}
                  className="text-xs text-[#605A57] underline underline-offset-2 hover:text-[#37322F]"
                >
                  {t.reset.link}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {state.step > 0 && (
        <ProgressBar
          currentStep={state.step}
          stage1Label={t.progress.stage1Label}
          stage2Label={t.progress.stage2Label}
        />
      )}

      <div className="px-4 py-6 sm:px-6">
        <div key={state.step} className={styles.stepEnter}>
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
