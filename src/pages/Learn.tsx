import { Button } from '@/components/ui/button'

interface Props {
  onBack: () => void
}

export default function Learn({ onBack }: Props) {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">Learn</h1>
      <p className="text-ink-muted mb-6">Content coming soon — check back shortly.</p>
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
