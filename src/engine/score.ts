import { QUESTIONS, CATEGORIES, MAX_SCORE, type Category } from '../data/questions'
import { BANDS, CATEGORY_ACTIONS, type RiskBand, type ActionItem } from '../data/recommendations'

export type Answers = Record<string, number>

export interface CategoryResult {
  category: Category
  label: string
  score: number
  maxScore: number
  percent: number
  band: RiskBand
}

export interface ScoredResult {
  totalScore: number
  maxScore: number
  percent: number
  band: RiskBand
  categoryResults: CategoryResult[]
  actionPlan: ActionItem[]
}

function categoryBand(percent: number): RiskBand {
  if (percent < 25) return 'critical'
  if (percent < 50) return 'high'
  if (percent < 65) return 'moderate'
  if (percent < 82) return 'good'
  return 'strong'
}

function overallBand(percent: number): RiskBand {
  if (percent < 30) return 'critical'
  if (percent < 50) return 'high'
  if (percent < 65) return 'moderate'
  if (percent < 82) return 'good'
  return 'strong'
}

export function scoreAnswers(answers: Answers): ScoredResult {
  const categoryScores: Record<Category, { score: number; max: number }> = {
    backups:   { score: 0, max: 0 },
    access:    { score: 0, max: 0 },
    awareness: { score: 0, max: 0 },
    response:  { score: 0, max: 0 },
    patching:  { score: 0, max: 0 },
  }

  let totalScore = 0

  for (const q of QUESTIONS) {
    const val = answers[q.id] ?? 0
    const max = Math.max(...q.options.map(o => o.value))
    categoryScores[q.category].score += val
    categoryScores[q.category].max   += max
    totalScore += val
  }

  const percent = Math.round((totalScore / MAX_SCORE) * 100)
  const band = overallBand(percent)

  const categoryResults: CategoryResult[] = (Object.keys(categoryScores) as Category[]).map(cat => {
    const { score, max } = categoryScores[cat]
    const catPercent = max > 0 ? Math.round((score / max) * 100) : 0
    return {
      category: cat,
      label:    CATEGORIES[cat].label,
      score,
      maxScore: max,
      percent:  catPercent,
      band:     categoryBand(catPercent),
    }
  })

  // Build action plan: pick actions based on each category's band
  const actionPlan: ActionItem[] = []
  for (const result of categoryResults) {
    const actions = CATEGORY_ACTIONS[result.category]
    if (result.band === 'critical' || result.band === 'high') {
      actionPlan.push(...actions.weak)
    } else if (result.band === 'moderate') {
      actionPlan.push(...actions.moderate)
    } else {
      actionPlan.push(...actions.strong)
    }
  }

  // Sort by week
  actionPlan.sort((a, b) => a.week - b.week)

  return { totalScore, maxScore: MAX_SCORE, percent, band, categoryResults, actionPlan }
}

export { BANDS }
