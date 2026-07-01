import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Trophy, ShoppingBasket, ArrowLeft, ArrowRight, RotateCcw, CircleHelp } from 'lucide-react'
import { TABLETOP_SCENARIOS, type TabletopScenario, type DecisionOption, type DecisionTag } from '@/data/tabletopScenarios'
import { BANDS } from '@/data/recommendations'
import { saveTabletopAttempt } from '@/lib/userPerformance'

const BORDER = '1px solid rgba(157, 142, 130, 0.25)'

const ICONS = { Building2, Trophy, ShoppingBasket } as const

const DIFFICULTY_STYLE: Record<TabletopScenario['difficulty'], string> = {
  Beginner: 'bg-moss/15 text-safe border-moss/40',
  Intermediate: 'bg-warning/15 text-warning border-warning/30',
  Advanced: 'bg-danger/15 text-danger border-danger/30',
}

const TAG_LABEL: Record<DecisionTag, string> = {
  detection: 'Early detection',
  containment: 'Fast containment',
  communication: 'Crisis communication',
  leadership: 'Decisive leadership',
  legal: 'Legal & regulatory judgement',
  technical: 'Technical response',
  recovery: 'Recovery planning',
}

interface Props {
  onBack: () => void
}

type View = 'select' | 'play' | 'report'

function scoreBand(sum: number) {
  if (sum <= -4) return 'critical' as const
  if (sum <= 0) return 'high' as const
  if (sum <= 4) return 'moderate' as const
  if (sum <= 7) return 'good' as const
  return 'strong' as const
}

function computeScore(options: DecisionOption[]) {
  const totalImpact = options.reduce((sum, o) => sum + o.impact, 0)
  const band = scoreBand(totalImpact)
  const percent = Math.max(0, Math.min(100, Math.round(((totalImpact + 10) / 20) * 100)))
  return { band, percent }
}

export default function Tabletop({ onBack }: Props) {
  const [view, setView] = useState<View>('select')
  const [activeScenario, setActiveScenario] = useState<TabletopScenario | null>(null)
  const [decisionIndex, setDecisionIndex] = useState(0)
  const [chosenOptions, setChosenOptions] = useState<DecisionOption[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function startScenario(scenario: TabletopScenario) {
    setActiveScenario(scenario)
    setDecisionIndex(0)
    setChosenOptions([])
    setSelectedId(null)
    setView('play')
  }

  function replayScenario() {
    if (!activeScenario) return
    startScenario(activeScenario)
  }

  function chooseOption(option: DecisionOption) {
    if (selectedId) return
    setSelectedId(option.id)
  }

  function continueToNext() {
    if (!activeScenario || !selectedId) return
    const decision = activeScenario.decisions[decisionIndex]
    const option = decision.options.find(o => o.id === selectedId)!
    const nextChosen = [...chosenOptions, option]
    setChosenOptions(nextChosen)
    setSelectedId(null)
    if (decisionIndex === activeScenario.decisions.length - 1) {
      const { percent, band } = computeScore(nextChosen)
      saveTabletopAttempt({
        scenarioId: activeScenario.id,
        scenarioTitle: activeScenario.title,
        percent,
        band,
        completedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      })
      setView('report')
    } else {
      setDecisionIndex(decisionIndex + 1)
    }
  }

  if (view === 'select') {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Tabletop Exercises</h1>
        <p className="text-ink-muted mb-8">
          Pick a scenario and work through it on your own or with a colleague. Each one plays out through a series of realistic decisions - there's no facilitator needed, and no single "correct" path.
        </p>

        <div className="space-y-4 mb-8">
          {TABLETOP_SCENARIOS.map(scenario => {
            const Icon = ICONS[scenario.icon]
            return (
              <div
                key={scenario.id}
                className="bg-canvas rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                style={{ border: BORDER }}
              >
                <div className="flex gap-4">
                  <div
                    className="hidden sm:flex w-11 h-11 rounded-xl items-center justify-center flex-shrink-0 text-safe"
                    style={{ backgroundColor: '#EAF0E8' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-display text-lg font-semibold text-ink">{scenario.title}</h3>
                      <Badge variant="outline" className={`${DIFFICULTY_STYLE[scenario.difficulty]} border`}>
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <p className="text-ink-muted text-sm leading-relaxed mb-2 max-w-xl">{scenario.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                      <span>{scenario.orgType}</span>
                      <span>{scenario.duration}</span>
                      <span>{scenario.decisions.length} decision points</span>
                    </div>
                    <p className="text-xs text-safe font-medium mt-2">Focus: {scenario.learningObjective}</p>
                  </div>
                </div>
                <Button
                  onClick={() => startScenario(scenario)}
                  className="bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer shrink-0"
                >
                  Start Exercise
                </Button>
              </div>
            )
          })}
        </div>

        <Button variant="outline" onClick={onBack} className="border-ink-faint text-ink hover:bg-surface cursor-pointer">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  if (view === 'play' && activeScenario) {
    const decision = activeScenario.decisions[decisionIndex]
    const previousOption = chosenOptions[chosenOptions.length - 1]
    const opener =
      decisionIndex === 0
        ? decision.opener
        : previousOption && previousOption.impact >= 0
        ? decision.openerFavourable
        : decision.openerUnfavourable
    const selectedOption = decision.options.find(o => o.id === selectedId)

    return (
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setView('select')}
            className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Scenarios
          </button>
          <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">
            Decision {decisionIndex + 1} of {activeScenario.decisions.length}
          </span>
        </div>

        <div className="h-1 rounded-full overflow-hidden mb-6" style={{ backgroundColor: '#DCCFC0' }}>
          <div
            className="h-full bg-safe transition-all duration-500 ease-out"
            style={{ width: `${((decisionIndex + (selectedId ? 1 : 0)) / activeScenario.decisions.length) * 100}%` }}
          />
        </div>

        <h2 className="font-display text-2xl font-semibold text-ink tracking-display mb-4">{activeScenario.title}</h2>

        <div className="bg-surface rounded-xl p-5 mb-5" style={{ border: BORDER }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Scenario update</p>
          <p className="text-ink text-sm leading-relaxed">{opener}</p>
        </div>

        <div className="rounded-xl p-5 mb-5 space-y-3" style={{ border: BORDER }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Current situation</p>
          <div>
            <p className="text-xs font-semibold text-ink mb-0.5">What's happening</p>
            <p className="text-ink text-sm leading-relaxed opacity-80">{decision.whatIsHappening}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink mb-0.5">What you know</p>
            <p className="text-ink text-sm leading-relaxed opacity-80">{decision.information}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink mb-0.5">What's uncertain</p>
            <p className="text-ink text-sm leading-relaxed opacity-80">{decision.uncertain}</p>
          </div>
        </div>

        <h3 className="font-semibold text-ink mb-3">{decision.question}</h3>
        <div className="space-y-2.5 mb-5">
          {decision.options.map(option => {
            const isSelected = selectedId === option.id
            const isDisabled = selectedId !== null && !isSelected
            return (
              <button
                key={option.id}
                onClick={() => chooseOption(option)}
                disabled={selectedId !== null}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ease-out ${isDisabled ? 'opacity-50' : ''}`}
                style={
                  isSelected
                    ? { backgroundColor: '#4C5C55', color: '#F7F4F1' }
                    : { backgroundColor: '#F7F4F1', color: '#262626', border: BORDER, cursor: selectedId ? 'default' : 'pointer' }
                }
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {selectedOption && (
          <div className="rounded-xl p-5 mb-6 space-y-3" style={{ backgroundColor: '#EAF0E8', border: '1px solid rgba(76,92,85,0.25)' }}>
            <div className="flex items-center gap-2">
              <CircleHelp className="w-4 h-4 text-safe" />
              <p className="text-xs font-semibold uppercase tracking-widest text-safe">Feedback</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink mb-0.5">Immediate consequence</p>
              <p className="text-ink text-sm leading-relaxed opacity-80">{selectedOption.immediateConsequence}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink mb-0.5">Business impact</p>
              <p className="text-ink text-sm leading-relaxed opacity-80">{selectedOption.businessImpact}</p>
            </div>
            <Button onClick={continueToNext} className="bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer mt-2">
              {decisionIndex === activeScenario.decisions.length - 1 ? 'See your report' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (view === 'report' && activeScenario) {
    const { band, percent } = computeScore(chosenOptions)
    const cfg = BANDS[band]
    const strengths = Array.from(new Set(chosenOptions.filter(o => o.impact >= 1).map(o => o.tag)))
    const improvements = Array.from(new Set(chosenOptions.filter(o => o.impact <= -1).map(o => o.tag)))

    return (
      <div className="max-w-3xl mx-auto mt-8 px-4 pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Final report</p>
        <h2 className="font-display text-2xl font-semibold text-ink tracking-display mb-6">{activeScenario.title}</h2>

        <div className="rounded-2xl overflow-hidden mb-6" style={{ border: BORDER }}>
          <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: cfg.bg }}>
            <div>
              <p className="text-sm opacity-70" style={{ color: cfg.text }}>Overall readiness demonstrated</p>
              <p className="text-2xl font-semibold" style={{ color: cfg.text }}>{cfg.label}</p>
            </div>
            <div className="text-3xl font-bold tabular-nums" style={{ color: cfg.text }}>{percent}%</div>
          </div>
          <div className="bg-surface px-6 py-5">
            <p className="text-ink text-sm leading-relaxed opacity-80">{cfg.summary}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl p-5" style={{ border: BORDER }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-safe mb-3">Strengths demonstrated</p>
            {strengths.length > 0 ? (
              <ul className="space-y-1.5 text-sm text-ink">
                {strengths.map(tag => <li key={tag}>{TAG_LABEL[tag]}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">No consistent strengths identified this time - worth a replay.</p>
            )}
          </div>
          <div className="rounded-xl p-5" style={{ border: BORDER }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-danger mb-3">Areas for improvement</p>
            {improvements.length > 0 ? (
              <ul className="space-y-1.5 text-sm text-ink">
                {improvements.map(tag => <li key={tag}>{TAG_LABEL[tag]}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">No major gaps identified - strong decision-making throughout.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl p-5 mb-6" style={{ border: BORDER }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Your decisions</p>
          <ol className="space-y-3">
            {activeScenario.decisions.map((decision, i) => (
              <li key={decision.id} className="text-sm">
                <p className="text-ink-muted text-xs mb-0.5">Decision {i + 1}: {decision.question}</p>
                <p className="text-ink">{chosenOptions[i]?.label}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl p-5 mb-8 bg-surface" style={{ border: BORDER }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Five actions to take in the next month
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-ink opacity-90">
            {activeScenario.actions.map((action, i) => <li key={i}>{action}</li>)}
          </ol>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={replayScenario} variant="outline" className="border-ink-faint text-ink hover:bg-surface cursor-pointer">
            <RotateCcw className="w-4 h-4" />
            Replay this scenario
          </Button>
          <Button onClick={() => setView('select')} variant="outline" className="border-ink-faint text-ink hover:bg-surface cursor-pointer">
            Choose another scenario
          </Button>
          <Button onClick={onBack} className="bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return null
}
