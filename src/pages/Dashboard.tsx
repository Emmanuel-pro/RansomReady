import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

interface LearningPath {
  id: string
  title: string
  description: string
  progress: number
}

const learningPaths: LearningPath[] = [
  {
    id: 'ransomware-awareness',
    title: 'Ransomware Awareness Learning Path',
    description:
      'Build your ransomware awareness from the ground up — modules, guides, and exercises.',
    progress: 0,
  },
]

interface Props {
  onNavigateToLearn: () => void
  onStartAssessment: () => void
}

export default function Dashboard({ onNavigateToLearn, onStartAssessment }: Props) {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 space-y-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-safe mb-3">My Learning</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {learningPaths.map((path) => (
            <Card key={path.id} style={{ border: '1px solid rgba(157, 142, 130, 0.25)' }}>
              <CardHeader>
                <CardTitle className="text-ink">{path.title}</CardTitle>
                <CardDescription className="text-ink-muted">{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={path.progress} />
                <Button
                  variant="outline"
                  onClick={onNavigateToLearn}
                  className="border-ink-faint text-ink hover:bg-surface cursor-pointer"
                >
                  Resume Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-xl p-6" style={{ border: '1px solid rgba(157, 142, 130, 0.25)' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-safe mb-3">Test Your Readiness</p>
        <p className="text-ink-muted text-sm mb-4">
          Answer 15 questions and receive a personalised ransomware preparedness pack — action plan, checklists, board brief, and more.
        </p>
        <Button
          size="lg"
          onClick={onStartAssessment}
          className="w-full bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer"
        >
          Take Readiness Assessment
        </Button>
      </section>
    </div>
  )
}
