import { useState } from 'react'
import Landing from './pages/Landing'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import { scoreAnswers, type Answers, type ScoredResult } from './engine/score'

export type Screen = 'landing' | 'assessment' | 'results'

export interface OrgInfo {
  name: string
  sector: string
  size: string
  date: string
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [orgInfo, setOrgInfo] = useState<OrgInfo>({ name: '', sector: '', size: '', date: '' })
  const [result, setResult] = useState<ScoredResult | null>(null)

  function handleStart(info: OrgInfo) {
    setOrgInfo(info)
    setScreen('assessment')
  }

  function handleComplete(answers: Answers) {
    setResult(scoreAnswers(answers))
    setScreen('results')
  }

  function handleRestart() {
    setResult(null)
    setScreen('landing')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {screen === 'landing'    && <Landing onStart={handleStart} />}
      {screen === 'assessment' && <Assessment orgInfo={orgInfo} onComplete={handleComplete} onBack={() => setScreen('landing')} />}
      {screen === 'results'    && result && <Results result={result} orgInfo={orgInfo} onRestart={handleRestart} />}
    </div>
  )
}
