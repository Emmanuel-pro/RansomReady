import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Tabletop from './pages/Tabletop'
import InteractiveGame from './pages/InteractiveGame'
import Landing from './pages/Landing'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import { scoreAnswers, type Answers, type ScoredResult } from './engine/score'

type AppScreen = 'dashboard' | 'learn' | 'tabletop' | 'interactive-game' | 'landing' | 'assessment' | 'results'

export type Screen = AppScreen

export interface OrgInfo {
  name: string
  sector: string
  size: string
  date: string
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('dashboard')
  const [orgInfo, setOrgInfo] = useState<OrgInfo>({ name: '', sector: '', size: '', date: '' })
  const [result, setResult] = useState<ScoredResult | null>(null)

  const activeNav =
    screen === 'dashboard' || screen === 'learn' || screen === 'tabletop' || screen === 'interactive-game'
      ? screen
      : undefined

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
    setScreen('dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Header activeView={activeNav} onNavigate={(view) => setScreen(view)} />
      <main className="flex-1 bg-canvas min-h-screen">
        {screen === 'dashboard'  && (
          <Dashboard
            onNavigateToLearn={()    => setScreen('learn')}
            onNavigateToTabletop={() => setScreen('tabletop')}
            onNavigateToGame={()     => setScreen('interactive-game')}
            onStartAssessment={()    => setScreen('landing')}
          />
        )}
        {screen === 'learn'      && <Learn onBack={() => setScreen('dashboard')} />}
        {screen === 'tabletop'   && <Tabletop onBack={() => setScreen('dashboard')} />}
        {screen === 'interactive-game' && <InteractiveGame onBack={() => setScreen('dashboard')} />}
        {screen === 'landing'    && <Landing onStart={handleStart} />}
        {screen === 'assessment' && <Assessment orgInfo={orgInfo} onComplete={handleComplete} onBack={() => setScreen('landing')} />}
        {screen === 'results'    && result && <Results result={result} orgInfo={orgInfo} onRestart={handleRestart} />}
      </main>
    </div>
  )
}
