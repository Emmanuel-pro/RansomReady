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

// Group questions by category for sectioned display
const CATEGORY_ORDER: Category[] = ['backups', 'access', 'awareness', 'response', 'patching']

const GROUPED = CATEGORY_ORDER.map(cat => ({
  category: cat,
  meta: CATEGORIES[cat],
  questions: QUESTIONS.filter(q => q.category === cat),
}))

export default function Assessment({ orgInfo, onComplete, onBack }: Props) {
  const [answers, setAnswers] = useState<Answers>({})
  const [currentSection, setCurrentSection] = useState(0)
  const [touched, setTouched] = useState(false)

  const section = GROUPED[currentSection]
  const isLastSection = currentSection === GROUPED.length - 1
  const totalSections = GROUPED.length

  const sectionAnswered = section.questions.every(q => answers[q.id] !== undefined)
  const totalAnswered = QUESTIONS.filter(q => answers[q.id] !== undefined).length
  const progress = Math.round((totalAnswered / QUESTIONS.length) * 100)

  function handleAnswer(qid: string, value: number) {
    setAnswers(prev => ({ ...prev, [qid]: value }))
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700">RansomReady</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{orgInfo.name}</span>
            <span className="text-sm text-slate-400">{totalAnswered} / {QUESTIONS.length} answered</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-brand-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Section nav pills */}
      <div className="bg-white border-b border-slate-100 no-print">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {GROUPED.map((g, i) => {
              const done = g.questions.every(q => answers[q.id] !== undefined)
              const current = i === currentSection
              return (
                <button
                  key={g.category}
                  onClick={() => { setTouched(false); setCurrentSection(i) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    current
                      ? 'bg-brand-500 text-white'
                      : done
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
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
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Section header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                <CategoryIcon category={section.category} className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Section {currentSection + 1} of {totalSections}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{section.meta.label}</h2>
          </div>

          {/* Questions */}
          <div className="space-y-7">
            {section.questions.map((q, qi) => {
              const isUnanswered = unanswered.some(u => u.id === q.id)
              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl border p-6 transition-colors ${
                    isUnanswered ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                >
                  <p className="font-semibold text-slate-800 mb-1 leading-snug">
                    <span className="text-slate-400 mr-1.5">{qi + 1}.</span>
                    {q.text}
                  </p>
                  {q.subtext && (
                    <p className="text-slate-500 text-sm mb-4">{q.subtext}</p>
                  )}
                  {!q.subtext && <div className="mb-3" />}
                  <div className="space-y-2">
                    {q.options.map(opt => {
                      const selected = answers[q.id] === opt.value && answers[q.id] !== undefined
                      // handle duplicate values - use label as secondary key
                      const uniqueKey = `${q.id}-${opt.label}`
                      return (
                        <button
                          key={uniqueKey}
                          onClick={() => handleAnswer(q.id, opt.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                            selected
                              ? 'border-brand-500 bg-brand-50 text-brand-800 font-medium'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'
                            }`}>
                              {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            {opt.label}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {isUnanswered && (
                    <p className="text-red-500 text-xs mt-2">Please select an answer to continue</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Nav footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 py-4 px-6 no-print">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {currentSection === 0 ? 'Back to start' : 'Previous section'}
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            {isLastSection ? 'Generate my pack' : 'Next section'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
