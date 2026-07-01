import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UsersIcon, ClockIcon } from 'lucide-react'

interface TabletopExercise {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  participants: string
}

const exercises: TabletopExercise[] = [
  {
    id: 'first-72-hours',
    title: 'The First 72 Hours',
    description:
      'Walk your team through the initial detection, containment, and communication decisions of a ransomware outbreak.',
    difficulty: 'Beginner',
    duration: '60 min',
    participants: '4-8 people',
  },
  {
    id: 'double-extortion',
    title: 'Double Extortion Dilemma',
    description:
      'Attackers have exfiltrated data and are threatening to leak it. Practise the legal, PR, and negotiation trade-offs.',
    difficulty: 'Intermediate',
    duration: '90 min',
    participants: '6-10 people',
  },
  {
    id: 'supply-chain-compromise',
    title: 'Supply Chain Compromise',
    description:
      'A trusted vendor update was the entry point. Trace the blast radius across departments and decide on recovery order.',
    difficulty: 'Advanced',
    duration: '120 min',
    participants: '8-12 people',
  },
]

const difficultyColor: Record<TabletopExercise['difficulty'], string> = {
  Beginner: 'bg-moss/15 text-safe border-moss/40',
  Intermediate: 'bg-warning/15 text-warning border-warning/30',
  Advanced: 'bg-danger/15 text-danger border-danger/30',
}

interface Props {
  onBack: () => void
}

export default function Tabletop({ onBack }: Props) {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">Tabletop Exercises</h1>
      <p className="text-ink-muted mb-8">
        Facilitated scenario walkthroughs for practising incident response as a team.
      </p>

      <div className="space-y-4 mb-8">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-canvas rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ border: '1px solid rgba(157, 142, 130, 0.25)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-semibold text-ink">{exercise.title}</h3>
                <Badge
                  variant="outline"
                  className={`${difficultyColor[exercise.difficulty]} border`}
                >
                  {exercise.difficulty}
                </Badge>
              </div>
              <p className="text-ink-muted text-sm leading-relaxed mb-2">{exercise.description}</p>
              <div className="flex items-center gap-4 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {exercise.duration}
                </span>
                <span className="flex items-center gap-1">
                  <UsersIcon className="w-3.5 h-3.5" />
                  {exercise.participants}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-ink-faint text-ink hover:bg-surface cursor-pointer shrink-0"
            >
              Start Exercise
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
