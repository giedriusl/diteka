'use client'

import { useAssessmentSession } from '@/hooks/useAssessmentSession'
import { getT, tmpl } from '@/lib/assessment/translations'
import { ProgressBar } from './ProgressBar'
import { LanguageToggle } from './LanguageToggle'
import { Step0Language } from './steps/Step0Language'
import { Step1Context } from './steps/Step1Context'
import { Step2Process } from './steps/Step2Process'
import { Step3ScoreTeaser } from './steps/Step3ScoreTeaser'
import { Step4ExtraProcesses } from './steps/Step4ExtraProcesses'
import { Step5DbModule } from './steps/Step5DbModule'
import { Step6EmailGate } from './steps/Step6EmailGate'
import { Step7ThankYou } from './steps/Step7ThankYou'
import styles from './questionnaire.module.css'

const TOTAL_STEPS = 8

export function AssessmentQuestionnaire() {
  const { state, dispatch } = useAssessmentSession()
  const t = getT(state.language)

  const stepProps = { state, dispatch }

  function renderStep() {
    switch (state.step) {
      case 0: return <Step0Language {...stepProps} />
      case 1: return <Step1Context {...stepProps} />
      case 2: return <Step2Process {...stepProps} />
      case 3: return <Step3ScoreTeaser {...stepProps} />
      case 4: return <Step4ExtraProcesses {...stepProps} />
      case 5: return <Step5DbModule {...stepProps} />
      case 6: return <Step6EmailGate {...stepProps} />
      case 7: return <Step7ThankYou {...stepProps} />
      default: return null
    }
  }

  return (
    <div className="relative w-full">
      {state.step > 0 && (
        <LanguageToggle
          language={state.language}
          onToggle={() =>
            dispatch({
              type: 'SET_LANGUAGE',
              language: state.language === 'en' ? 'lt' : 'en',
            })
          }
        />
      )}

      {state.step > 0 && (
        <ProgressBar
          currentStep={state.step}
          totalSteps={TOTAL_STEPS}
          label={tmpl(t.progress.step, { current: state.step, total: TOTAL_STEPS - 1 })}
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
