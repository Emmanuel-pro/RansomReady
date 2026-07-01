import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon, LockIcon, PlayIcon } from 'lucide-react'
import PhishingAlleyGame from './games/PhishingAlleyGame'

interface AdventureLevel {
  id: string
  title: string
  description: string
  status: 'completed' | 'unlocked' | 'locked'
}

const levels: AdventureLevel[] = [
  {
    id: 'phishing-alley',
    title: 'Phishing Alley',
    description: 'Spot the fake emails before they cost you your inbox.',
    status: 'unlocked',
  },
  {
    id: 'patch-it-up',
    title: 'Patch It Up',
    description: 'Race the clock to close vulnerabilities before attackers find them.',
    status: 'locked',
  },
  {
    id: 'the-lockdown',
    title: 'The Lockdown',
    description: 'Your files are encrypted. Make the right calls to recover without paying.',
    status: 'locked',
  },
]

const statusStyles: Record<AdventureLevel['status'], string> = {
  completed: 'bg-safe text-canvas border-safe',
  unlocked:  'bg-surface text-safe border-safe/40',
  locked:    'bg-surface text-ink-faint border-ink-faint/40',
}

interface Props {
  onBack: () => void
}

export default function InteractiveGame({ onBack }: Props) {
  const [activeLevel, setActiveLevel] = useState<string | null>(null)

  if (activeLevel === 'phishing-alley') {
    return <PhishingAlleyGame onBack={() => setActiveLevel(null)} />
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">Interactive Game</h1>
      <p className="text-ink-muted mb-8">
        Bite-sized levels that build your ransomware instincts one decision at a time.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {levels.map((level, i) => (
          <div
            key={level.id}
            className={`bg-canvas rounded-xl p-5 flex flex-col items-center text-center gap-3 ${level.status === 'locked' ? 'opacity-70' : ''}`}
            style={{ border: '1px solid rgba(157, 142, 130, 0.25)' }}
          >
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg ${statusStyles[level.status]}`}>
              {level.status === 'completed' && <CheckIcon className="w-6 h-6" />}
              {level.status === 'unlocked'  && <PlayIcon  className="w-6 h-6" />}
              {level.status === 'locked'    && <LockIcon  className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1">
                Level {i + 1}
              </p>
              <h3 className="font-semibold text-ink mb-1">{level.title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{level.description}</p>
              {level.status === 'locked' && (
                <p className="text-xs text-ink-faint font-medium uppercase tracking-wide mt-2">Coming soon</p>
              )}
            </div>
            <Button
              variant="outline"
              disabled={level.status === 'locked'}
              onClick={() => level.status !== 'locked' ? setActiveLevel(level.id) : undefined}
              className="border-ink-faint text-ink hover:bg-surface cursor-pointer disabled:cursor-not-allowed w-full mt-1"
            >
              {level.status === 'completed' ? 'Replay' : level.status === 'unlocked' ? 'Play' : 'Locked'}
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={onBack}
        className="border-ink-faint text-ink hover:bg-surface cursor-pointer"
      >
        Return to Dashboard
      </Button>
    </div>
  )
}
