import type { RiskBand } from '@/data/recommendations'

const ASSESSMENT_KEY = 'ransomready:last-assessment'
const TABLETOP_KEY = 'ransomready:tabletop-attempts'
const MAX_ATTEMPTS = 10

export interface StoredAssessment {
  orgName: string
  percent: number
  band: RiskBand
  date: string
}

export interface StoredTabletopAttempt {
  scenarioId: string
  scenarioTitle: string
  percent: number
  band: RiskBand
  completedAt: string
}

export function saveAssessmentResult(data: StoredAssessment) {
  try {
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(data))
  } catch {
    // localStorage unavailable (e.g. private browsing) - skip persistence
  }
}

export function getLatestAssessment(): StoredAssessment | null {
  try {
    const raw = localStorage.getItem(ASSESSMENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveTabletopAttempt(attempt: StoredTabletopAttempt) {
  try {
    const updated = [attempt, ...getTabletopAttempts()].slice(0, MAX_ATTEMPTS)
    localStorage.setItem(TABLETOP_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable - skip persistence
  }
}

export function getTabletopAttempts(): StoredTabletopAttempt[] {
  try {
    const raw = localStorage.getItem(TABLETOP_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
