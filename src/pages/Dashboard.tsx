import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Mail,
  Shield,
  Target,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const BORDER = '1px solid rgba(157, 142, 130, 0.25)'

const PACK_OUTPUTS = [
  { icon: BarChart3,    label: 'Readiness Score' },
  { icon: CalendarDays, label: '30-Day Action Plan' },
  { icon: Clock,        label: 'First Hour Checklist' },
  { icon: FileText,     label: 'Board Briefing' },
  { icon: BookOpen,     label: 'Staff Awareness Guide' },
  { icon: Target,       label: 'Tabletop Scenario' },
]

const LEARNING_STATS = [
  { icon: BookOpen,     label: 'Learn modules',  value: '4' },
  { icon: Clock,        label: 'Estimated time', value: '~45 min' },
  { icon: Target,       label: 'Practice games', value: '2' },
  { icon: BarChart3,    label: 'Assessment',      value: '15 Q' },
]

interface PracticeTile {
  id:          string
  icon:        React.ElementType
  label:       string
  description: string
  status:      'available' | 'locked'
}

const PRACTICE_TILES: PracticeTile[] = [
  {
    id:          'tabletop',
    icon:        Users,
    label:       'Tabletop Exercises',
    description: 'Run a realistic incident scenario with your leadership team.',
    status:      'available',
  },
  {
    id:          'game',
    icon:        Mail,
    label:       'Phishing Alley',
    description: 'Identify real and fake emails across 8 graded rounds.',
    status:      'available',
  },
  {
    id:          'coming',
    icon:        Lock,
    label:       'Patch It Up',
    description: 'Race the clock to close vulnerabilities before attackers do.',
    status:      'locked',
  },
]

interface Props {
  onNavigateToLearn:    () => void
  onNavigateToTabletop: () => void
  onNavigateToGame:     () => void
  onStartAssessment:    () => void
}

export default function Dashboard({
  onNavigateToLearn,
  onNavigateToTabletop,
  onNavigateToGame,
  onStartAssessment,
}: Props) {

  function handleTileClick(tile: PracticeTile) {
    if (tile.status === 'locked') return
    if (tile.id === 'tabletop') onNavigateToTabletop()
    if (tile.id === 'game')     onNavigateToGame()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-12 pb-24 space-y-14">

      {/* ── Welcome ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Ransomware Preparedness Hub
        </p>
        <h1
          className="font-display font-semibold text-ink leading-tight mb-3"
          style={{ fontSize: '2.75rem', letterSpacing: '-0.03em' }}
        >
          Build. Practise. Respond.
        </h1>
        <p className="text-ink-muted text-base max-w-lg leading-relaxed">
          Learn the fundamentals, sharpen your instincts with practice tools, and test your
          organisation's readiness - all in one place.
        </p>
      </div>

      {/* ── My Learning ── */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-safe mb-5">My Learning</p>

        {/* Learning path card */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ border: BORDER }}>

          {/* Card header */}
          <div className="bg-surface px-7 py-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#4C5C55' }}
                  >
                    <Shield className="w-4 h-4" style={{ color: '#F7F4F1' }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                    Learning Path
                  </span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-ink mb-1.5">
                  Ransomware Awareness
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed max-w-md">
                  Understand how ransomware works, how to prevent it, and how to respond - from the
                  basics through to a full organisational readiness assessment.
                </p>
              </div>

              {/* Module counter */}
              <div className="hidden sm:flex flex-col items-end flex-shrink-0 pt-1">
                <p className="text-3xl font-semibold text-ink leading-none">
                  0
                  <span className="text-base font-normal text-ink-muted"> / 4</span>
                </p>
                <p className="text-xs text-ink-muted mt-1">modules complete</p>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="bg-canvas px-7 py-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {LEARNING_STATS.map(stat => (
                <div
                  key={stat.label}
                  className="rounded-xl p-3.5"
                  style={{ backgroundColor: '#F7F4F1', border: BORDER }}
                >
                  <stat.icon className="w-4 h-4 text-safe mb-1.5" />
                  <p className="text-sm font-semibold text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={onNavigateToLearn}
              className="bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer flex items-center gap-2"
            >
              Start learning
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Practice tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRACTICE_TILES.map(tile => {
            const available = tile.status === 'available'
            return (
              <div
                key={tile.id}
                className="bg-canvas rounded-xl p-5 flex flex-col gap-4 transition-shadow duration-200"
                style={{
                  border: BORDER,
                  opacity: available ? 1 : 0.55,
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: available ? '#EAF0E8' : '#DCCFC0' }}
                  >
                    <tile.icon
                      className="w-4 h-4"
                      style={{ color: available ? '#4C5C55' : '#9D8E82' }}
                    />
                  </div>
                  {!available && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#DCCFC0', color: '#9D8E82' }}
                    >
                      Coming soon
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-ink mb-1">{tile.label}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{tile.description}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!available}
                  onClick={() => handleTileClick(tile)}
                  className="border-ink-faint text-ink hover:bg-surface cursor-pointer disabled:cursor-not-allowed text-xs w-full"
                >
                  {available ? 'Open' : 'Locked'}
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Test Your Readiness ── */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-safe mb-5">
          Test Your Readiness
        </p>

        <div className="rounded-2xl overflow-hidden" style={{ border: BORDER }}>
          <div className="grid lg:grid-cols-5">

            {/* Left - CTA */}
            <div className="lg:col-span-3 bg-surface px-8 py-9">
              <h2
                className="font-display font-semibold text-ink leading-tight mb-4"
                style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}
              >
                Know exactly where your organisation stands.
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-sm">
                Answer 15 plain-language questions across five risk areas. Receive a complete
                preparedness pack - scored, personalised, and ready to act on.
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
                {[
                  'Under 10 minutes',
                  'Nothing saved or transmitted',
                  'AI summary optional',
                ].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-safe flex-shrink-0" />
                    {item}
                  </span>
                ))}
              </div>

              <Button
                size="lg"
                onClick={onStartAssessment}
                className="bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer flex items-center gap-2"
              >
                Start readiness assessment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Right - pack outputs */}
            <div className="lg:col-span-2 bg-canvas px-7 py-9" style={{ borderLeft: BORDER }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-5">
                What you receive
              </p>
              <div className="space-y-3">
                {PACK_OUTPUTS.map(output => (
                  <div key={output.label} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#EAF0E8' }}
                    >
                      <output.icon className="w-3.5 h-3.5 text-safe" />
                    </div>
                    <p className="text-sm font-medium text-ink">{output.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
