import { useState } from 'react'
import { QUESTIONS, CATEGORIES, type Category } from '../data/questions'
import type { OrgInfo } from '../App'
import type { Answers } from '../engine/score'
import CategoryIcon from '../components/CategoryIcon'

interface Props {
  orgInfo: OrgInfo
  onComplete: (answers: Answers) => void
  onBack: () => void
}

const CATEGORY_ORDER: Category[] = ['backups', 'access', 'awareness', 'response', 'patching']

const GROUPED = CATEGORY_ORDER.map(cat => ({
  category: cat,
  meta: CATEGORIES[cat],
  questions: QUESTIONS.filter(q => q.category === cat),
}))

export default function Assessment({ orgInfo, onComplete, onBack }: Props) {
  const [answers, setAnswers]           = useState<Answers>({})
  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>({})
  const [currentSection, setCurrentSection] = useState(0)
  const [touched, setTouched]           = useState(false)

  const section       = GROUPED[currentSection]
  const isLastSection = currentSection === GROUPED.length - 1
  const totalSections = GROUPED.length

  const sectionAnswered = section.questions.every(q => answers[q.id] !== undefined)
  const totalAnswered   = QUESTIONS.filter(q => answers[q.id] !== undefined).length
  const progress        = Math.round((totalAnswered / QUESTIONS.length) * 100)

  function handleAnswer(qid: string, value: number, label: string) {
    setAnswers(prev => ({ ...prev, [qid]: value }))
    setSelectedLabels(prev => ({ ...prev, [qid]: label }))
  }

  function handleNext() {
    setTouched(true)
    if (!sectionAnswered) return
    setTouched(false)
    if (isLastSection) {
      onComplete(answers)
    } else {
      setCurrentSection(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handlePrev() {
    setTouched(false)
    if (currentSection === 0) {
      onBack()
    } else {
      setCurrentSection(s => s - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const unanswered = touched ? section.questions.filter(q => answers[q.id] === undefined) : []

  return (
    <div className="min-h-screen bg-canvas flex flex-col">

      {/* Header */}
      <header className="bg-canvas shadow-card sticky top-0 z-10 no-print">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-sm font-semibold text-ink tracking-tight">RansomReady</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm text-ink-muted hidden sm:block">{orgInfo.name}</span>
            <span className="text-xs text-ink-faint tabular-nums">{totalAnswered} / {QUESTIONS.length}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-surface">
          <div
            className="h-full bg-ink transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Section nav */}
      <div className="bg-canvas no-print" style={{ borderBottom: '1px solid #B8D8D3' }}>
        <div className="max-w-3xl mx-auto px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {GROUPED.map((g, i) => {
              const done    = g.questions.every(q => answers[q.id] !== undefined)
              const current = i === currentSection
              return (
                <button
                  key={g.category}
                  onClick={() => { setTouched(false); setCurrentSection(i) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all duration-200 ease-out"
                  style={
                    current
                      ? { backgroundColor: '#14332D', color: '#F3F8F7' }
                      : done
                      ? { backgroundColor: '#C8E5E0', color: '#2B6B5C' }
                      : { backgroundColor: '#E3EFEC', color: '#3D6960' }
                  }
                >
                  <CategoryIcon category={g.category} className="w-3.5 h-3.5" />
                  <span>{g.meta.label}</span>
                  {done && !current && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-8 py-10">

          {/* Section header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded bg-surface flex items-center justify-center text-ink-muted">
                <CategoryIcon category={section.category} className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-ink-faint">
                Section {currentSection + 1} of {totalSections}
              </span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-ink tracking-display">
              {section.meta.label}
            </h2>
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {section.questions.map((q, qi) => {
              const isUnanswered = unanswered.some(u => u.id === q.id)
              return (
                <div
                  key={q.id}
                  className="rounded shadow-card p-6 transition-shadow duration-300 ease-out"
                  style={{
                    backgroundColor: isUnanswered ? '#F5ECEC' : '#E3EFEC',
                  }}
                >
                  <p className="font-medium text-ink mb-1 leading-snug text-sm">
                    <span className="text-ink-faint mr-1.5 tabular-nums">{qi + 1}.</span>
                    {q.text}
                  </p>
                  {q.subtext
                    ? <p className="text-ink-muted text-xs mb-4 leading-relaxed">{q.subtext}</p>
                    : <div className="mb-3" />
                  }
                  <div className="space-y-2">
                    {q.options.map(opt => {
                      const selected  = selectedLabels[q.id] === opt.label
                      const uniqueKey = `${q.id}-${opt.label}`
                      return (
                        <button
                          key={uniqueKey}
                          onClick={() => handleAnswer(q.id, opt.value, opt.label)}
                          className="w-full text-left px-4 py-3 rounded text-sm transition-all duration-200 ease-out"
                          style={
                            selected
                              ? { backgroundColor: '#14332D', color: '#F3F8F7' }
                              : { backgroundColor: '#F3F8F7', color: '#14332D' }
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                              style={selected
                                ? { borderColor: '#F3F8F7', backgroundColor: '#F3F8F7' }
                                : { borderColor: '#7AADA6', backgroundColor: 'transparent' }
                              }
                            >
                              {selected && (
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#14332D' }} />
                              )}
                            </div>
                            {opt.label}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {isUnanswered && (
                    <p className="text-xs mt-3" style={{ color: '#802B2B' }}>
                      Please select an answer to continue
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer nav */}
      <div className="sticky bottom-0 bg-canvas shadow-lift py-4 px-8 no-print">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 bg-surface text-ink text-sm font-medium px-4 py-2.5 rounded hover:opacity-80 transition-opacity duration-200 ease-out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {currentSection === 0 ? 'Back to start' : 'Previous section'}
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-ink text-canvas text-sm font-semibold px-6 py-2.5 rounded hover:opacity-80 transition-opacity duration-200 ease-out"
          >
            {isLastSection ? 'Generate my pack' : 'Next section'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
