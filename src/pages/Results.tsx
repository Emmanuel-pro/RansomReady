import { useCallback, useEffect, useState } from 'react'
import type { ScoredResult } from '../engine/score'
import { BANDS } from '../engine/score'
import type { OrgInfo } from '../App'
import { TABLETOP_SCENARIOS } from '../data/recommendations'
import type { Category } from '../data/questions'
import CategoryIcon from '../components/CategoryIcon'
import { fetchCyberSummary } from '../services/cyberSummary'

interface Props {
  result: ScoredResult
  orgInfo: OrgInfo
  onRestart: () => void
}

const TABS = [
  { id: 'score',     label: 'Readiness Score' },
  { id: 'plan',      label: '30-Day Action Plan' },
  { id: 'checklist', label: 'First Hour Checklist' },
  { id: 'board',     label: 'Board Briefing' },
  { id: 'staff',     label: 'Staff Guide' },
  { id: 'tabletop',  label: 'Tabletop Exercise' },
]

const WEEK_LABELS = [
  'Week 1 - Immediate priorities',
  'Week 2 - Build on the foundations',
  'Week 3 - Strengthen and document',
  'Week 4 - Review and sustain',
]

const BORDER     = '1px solid rgba(157, 142, 130, 0.25)'
const BORDER_ERR = '1px solid rgba(139, 58, 58, 0.25)'

const EFFORT_STYLE: Record<string, { backgroundColor: string; color: string }> = {
  Low:    { backgroundColor: '#EAF0E8', color: '#4C5C55' },
  Medium: { backgroundColor: '#F5F0E6', color: '#7A6020' },
  High:   { backgroundColor: '#F5ECEC', color: '#8B3A3A' },
}

const CAT_STYLE: Record<Category, { backgroundColor: string; color: string }> = {
  backups:   { backgroundColor: '#EAF0E8', color: '#4C5C55' },
  access:    { backgroundColor: '#DCCFC0', color: '#262626' },
  awareness: { backgroundColor: '#F5F0E6', color: '#7A6020' },
  response:  { backgroundColor: '#F5ECEC', color: '#8B3A3A' },
  patching:  { backgroundColor: '#D8EAE4', color: '#262626' },
}

const BAND_GAUGE_COLOR: Record<string, string> = {
  critical: '#8B3A3A',
  high:     '#94442A',
  moderate: '#7A6020',
  good:     '#4C5C55',
  strong:   '#262626',
}

function ScoreGauge({ percent, band }: { percent: number; band: keyof typeof BANDS }) {
  const color = BAND_GAUGE_COLOR[band]
  const r = 64, cx = 80, cy = 80
  const circumference = Math.PI * r
  const offset = circumference * (1 - percent / 100)
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90" className="overflow-visible">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#DCCFC0" strokeWidth="10" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x={cx} y={cy - 8}  textAnchor="middle" fontSize="28" fontWeight="700" fill="#262626">{percent}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#9D8E82">readiness score</text>
      </svg>
      <span
        className="mt-2 px-3 py-1 rounded-xl text-sm font-semibold"
        style={{ backgroundColor: BANDS[band].bg, color: BANDS[band].text }}
      >
        {BANDS[band].label}
      </span>
    </div>
  )
}

function CategoryBar({ label, category, percent, band }: { label: string; category: Category; percent: number; band: keyof typeof BANDS }) {
  const barColor = BAND_GAUGE_COLOR[band]
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-ink flex items-center gap-1.5">
          <CategoryIcon category={category} className="w-3.5 h-3.5 text-ink-muted" />
          {label}
        </span>
        <span className="text-sm font-semibold text-ink tabular-nums">{percent}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#DCCFC0' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-canvas font-bold text-sm flex-shrink-0 tabular-nums"
        style={{ backgroundColor: '#4C5C55' }}
      >
        {number}
      </div>
      <h2 className="font-display text-2xl font-semibold text-ink tracking-display">{title}</h2>
    </div>
  )
}

export default function Results({ result, orgInfo, onRestart }: Props) {
  const [activeTab, setActiveTab]               = useState(0)
  const [dynamicSummary, setDynamicSummary]     = useState('')
  const [summaryStatus, setSummaryStatus]       = useState<'loading' | 'ready' | 'fallback'>('loading')
  const cfg      = BANDS[result.band]
  const scenario = TABLETOP_SCENARIOS[0]
  const byWeek   = [1, 2, 3, 4].map(w => ({ week: w, items: result.actionPlan.filter(a => a.week === w) }))
  const summary  = dynamicSummary || cfg.summary

  const generateSummary = useCallback((controller: AbortController) => {
    setDynamicSummary('')
    setSummaryStatus('loading')
    fetchCyberSummary({ orgInfo, result }, controller.signal)
      .then(text => { setDynamicSummary(text); setSummaryStatus('ready') })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.warn('Using fallback cyber summary:', error)
        setSummaryStatus('fallback')
      })
  }, [orgInfo, result])

  useEffect(() => {
    const controller = new AbortController()
    generateSummary(controller)
    return () => controller.abort()
  }, [generateSummary])

  function handleRetrySummary() {
    generateSummary(new AbortController())
  }

  function handlePrintSection() {
    document.body.classList.add('print-single')
    window.print()
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('print-single')
    }, { once: true })
  }

  function handlePrintAll() {
    window.print()
  }

  function sectionClass(index: number) {
    return `result-section${activeTab === index ? ' section-active' : ' hidden'}`
  }

  const PrintIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-canvas">

      {/* Header */}
      <header className="bg-canvas sticky top-16 z-10 no-print" style={{ borderBottom: BORDER }}>
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center justify-between">
          <span className="text-ink-muted text-sm">{orgInfo.name}</span>
          <div className="flex gap-2">
            <button
              onClick={onRestart}
              className="px-3 py-1.5 text-ink-muted rounded-xl text-sm font-medium hover:opacity-80 transition-opacity duration-200"
              style={{ backgroundColor: '#DCCFC0', border: BORDER }}
            >
              Start over
            </button>
            <button
              onClick={handlePrintSection}
              className="flex items-center gap-1.5 px-3 py-1.5 text-ink-muted rounded-xl text-sm font-medium hover:opacity-80 transition-opacity duration-200"
              style={{ backgroundColor: '#DCCFC0', border: BORDER }}
            >
              <PrintIcon />
              Print section
            </button>
            <button
              onClick={handlePrintAll}
              className="flex items-center gap-1.5 text-canvas font-semibold px-4 py-1.5 rounded-xl text-sm hover:opacity-85 transition-opacity duration-200"
              style={{ backgroundColor: '#4C5C55' }}
            >
              <PrintIcon />
              Print full pack
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ borderTop: BORDER }}>
          <div className="max-w-5xl mx-auto px-8">
            <div className="flex overflow-x-auto">
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(i)}
                  className="flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap"
                  style={
                    activeTab === i
                      ? { borderColor: '#4C5C55', color: '#4C5C55' }
                      : { borderColor: 'transparent', color: '#9D8E82' }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Print-only org header */}
      <div className="print-only px-8 py-6" style={{ borderBottom: BORDER }}>
        <p className="text-xs text-ink-muted uppercase font-medium tracking-widest mb-1">Ransomware Preparedness Pack</p>
        <h1 className="font-display text-2xl font-semibold text-ink">{orgInfo.name}</h1>
        <p className="text-ink-muted text-sm">{orgInfo.sector} - {orgInfo.size} - {orgInfo.date}</p>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* ── TAB 0: READINESS SCORE ─────────────────────────────────────── */}
        <div className={sectionClass(0)}>
          <SectionHeader number="1" title="Readiness Score" />
          <div className="rounded-2xl overflow-hidden shadow-subtle" style={{ border: BORDER }}>
            <div className="px-8 py-6 flex items-start justify-between" style={{ backgroundColor: cfg.bg }}>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: cfg.text }}>{orgInfo.name}</h2>
                <p className="text-sm mt-1 opacity-70" style={{ color: cfg.text }}>
                  {orgInfo.sector} - {orgInfo.size} - {orgInfo.date}
                </p>
                <div
                  className="mt-3 inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: 'rgba(247,244,241,0.5)', color: cfg.text }}
                >
                  {cfg.label}
                </div>
              </div>
              <ScoreGauge percent={result.percent} band={result.band} />
            </div>
            <div className="px-8 py-6 bg-surface grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-semibold text-ink mb-2">{cfg.headline}</h3>
                <p className="text-ink text-sm leading-relaxed opacity-75">
                  {summaryStatus === 'loading' ? 'Generating a tailored risk summary...' : summary}
                </p>
                {summaryStatus === 'ready' && (
                  <p className="mt-2 text-xs font-medium text-safe no-print">AI-generated summary</p>
                )}
                {summaryStatus === 'fallback' && (
                  <div className="mt-2 flex items-center gap-3 no-print">
                    <p className="text-xs text-ink-muted">API unavailable - showing static summary.</p>
                    <button type="button" onClick={handleRetrySummary} className="text-xs font-semibold text-safe hover:opacity-80 transition-opacity">
                      Retry
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {result.categoryResults.map(cat => (
                  <CategoryBar
                    key={cat.category}
                    label={cat.label}
                    category={cat.category}
                    percent={cat.percent}
                    band={cat.band}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Score band legend */}
          <div className="mt-5 bg-surface rounded-xl p-5" style={{ border: BORDER }}>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-muted mb-3">Score bands</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['critical', 'high', 'moderate', 'good', 'strong'] as const).map(b => (
                <div key={b} className="rounded-xl px-3 py-2 text-center" style={{ backgroundColor: BANDS[b].bg }}>
                  <p className="text-xs font-semibold" style={{ color: BANDS[b].text }}>{BANDS[b].label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TAB 1: 30-DAY ACTION PLAN ──────────────────────────────────── */}
        <div className={sectionClass(1)}>
          <SectionHeader number="2" title="Your 30-Day Action Plan" />
          <p className="text-ink-muted text-sm mb-6">
            These actions are personalised based on your assessment results. Start with Week 1 items - they address your most critical gaps.
          </p>
          <div className="space-y-6">
            {byWeek.map(({ week, items }) => items.length > 0 && (
              <div key={week}>
                <h3 className="text-xs font-medium uppercase tracking-widest text-ink-muted mb-3">
                  {WEEK_LABELS[week - 1]}
                </h3>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="bg-surface rounded-xl p-5" style={{ border: BORDER }}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-semibold text-ink text-sm leading-snug">{item.title}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-lg font-medium" style={CAT_STYLE[item.category]}>
                            {item.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-lg font-medium" style={EFFORT_STYLE[item.effort]}>
                            {item.effort} effort
                          </span>
                        </div>
                      </div>
                      <p className="text-ink text-sm leading-relaxed opacity-75">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAB 2: FIRST HOUR CHECKLIST ────────────────────────────────── */}
        <div className={sectionClass(2)}>
          <SectionHeader number="3" title="First Hour Response Checklist" />
          <div className="rounded-xl px-5 py-4 mb-6" style={{ backgroundColor: '#F5ECEC', border: BORDER_ERR }}>
            <p className="text-sm font-medium" style={{ color: '#8B3A3A' }}>
              For use in the first 60 minutes after you suspect a ransomware attack. Print this page and keep a copy accessible offline.
            </p>
          </div>
          <div className="bg-surface rounded-2xl overflow-hidden" style={{ border: BORDER }}>
            {[
              {
                phase: 'Immediately (0-10 minutes)',
                bg: '#8B3A3A', fg: '#F7F4F1',
                steps: [
                  'Do NOT pay the ransom. Do not attempt to negotiate with attackers yourself.',
                  'Do NOT turn off affected computers - preserve them for forensic investigation unless advised by IT.',
                  'Disconnect affected devices from the network (unplug the ethernet cable or disable Wi-Fi).',
                  'Do NOT try to delete files or fix anything yourself.',
                  'Alert your designated cyber incident lead or senior manager immediately.',
                ],
              },
              {
                phase: 'First 15 minutes',
                bg: '#94442A', fg: '#F7F4F1',
                steps: [
                  'Call your IT support provider or managed service provider. Have your emergency contact card ready.',
                  'Photograph the ransom note on screen with your phone - do not dismiss it.',
                  'Identify which systems and files appear to be affected. Write it down.',
                  'Prevent other staff from using devices on the same network until IT advises otherwise.',
                  'Do not tell staff to restart their machines.',
                ],
              },
              {
                phase: 'Within 30 minutes',
                bg: '#7A6020', fg: '#F7F4F1',
                steps: [
                  'Notify senior leadership and key decision-makers.',
                  'Contact your cyber insurer (if you have one) - many policies require prompt notification.',
                  'Check whether your backups are accessible and whether they appear unaffected.',
                  'Consider whether any partners, clients, or stakeholders may be affected and need to be informed.',
                  'Assign one person to keep a written incident log - date and time every action taken.',
                ],
              },
              {
                phase: 'Within 60 minutes',
                bg: '#4C5C55', fg: '#F7F4F1',
                steps: [
                  'Report the incident to national cybersecurity authorities (NCSC in UK; CISA in US; local equivalent).',
                  'Assess whether personal data may have been compromised - this may trigger a legal reporting obligation.',
                  'Draft a holding statement for staff: acknowledge an incident has occurred, state that it is being managed, ask staff not to discuss it externally.',
                  'Begin working with IT support on a recovery plan. Confirm the scope of the attack.',
                  'Do not communicate publicly or via social media until you have a clear picture and a communications plan.',
                ],
              },
            ].map((block, bi) => (
              <div key={block.phase} style={{ borderBottom: bi < 3 ? BORDER : 'none' }}>
                <div className="px-6 py-3" style={{ backgroundColor: block.bg }}>
                  <h3 className="font-semibold text-sm" style={{ color: block.fg }}>{block.phase}</h3>
                </div>
                <ul className="px-6 py-4 space-y-3">
                  {block.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink">
                      <div
                        className="mt-0.5 w-5 h-5 rounded-lg flex-shrink-0"
                        style={{ border: BORDER }}
                      />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAB 3: BOARD BRIEFING ──────────────────────────────────────── */}
        <div className={sectionClass(3)}>
          <SectionHeader number="4" title="Board Briefing - Ransomware Preparedness" />
          <div className="bg-surface rounded-2xl p-8 space-y-6 text-sm leading-relaxed text-ink" style={{ border: BORDER }}>
            <div className="pb-6" style={{ borderBottom: BORDER }}>
              <p className="text-xs text-ink-muted uppercase font-medium tracking-widest mb-1">Prepared for board / trustees</p>
              <h3 className="font-display text-2xl font-semibold text-ink tracking-display">{orgInfo.name} - Cyber Risk Summary</h3>
              <p className="text-ink-muted text-sm mt-1">{orgInfo.date}</p>
            </div>
            <div>
              <h4 className="font-semibold text-ink mb-2">What is ransomware and why does it matter to us?</h4>
              <p className="opacity-80">Ransomware is a type of cyberattack in which criminals encrypt an organisation's files and demand payment to restore access. Attacks increasingly target charities, non-profits, and community organisations - not because they are high-profile, but because they often have weaker defences and handle sensitive data including personal records, financial information, and beneficiary details.</p>
              <p className="mt-2 opacity-80">The consequences of an attack can include: inability to operate for days or weeks; financial loss; reputational damage; legal obligations if personal data is compromised; and in some cases, permanent loss of critical records.</p>
            </div>
            <div>
              <h4 className="font-semibold text-ink mb-2">Our current readiness</h4>
              <p className="opacity-80">
                Based on a structured self-assessment completed on {orgInfo.date}, {orgInfo.name} achieved a readiness score of{' '}
                <strong className="text-ink opacity-100">{result.percent}%</strong>, placing us in the{' '}
                <strong style={{ color: cfg.text }}>{cfg.label}</strong> band.
              </p>
              <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: cfg.bg }}>
                <p className="font-semibold text-sm" style={{ color: cfg.text }}>{cfg.headline}</p>
                <p className="mt-1 text-sm opacity-80" style={{ color: cfg.text }}>{summary}</p>
                {summaryStatus === 'ready' && (
                  <p className="mt-2 text-xs font-medium no-print" style={{ color: cfg.text }}>AI-generated summary</p>
                )}
                {summaryStatus === 'fallback' && (
                  <button type="button" onClick={handleRetrySummary} className="mt-2 text-xs font-semibold no-print hover:opacity-80 transition-opacity" style={{ color: cfg.text }}>
                    Retry AI summary
                  </button>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {result.categoryResults.map(cat => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5"
                    style={{ backgroundColor: '#F7F4F1', border: BORDER }}
                  >
                    <span className="flex items-center gap-1.5 text-ink text-sm">
                      <CategoryIcon category={cat.category} className="w-3.5 h-3.5 text-ink-muted" />
                      {cat.label}
                    </span>
                    <span className="font-semibold text-sm" style={{ color: BANDS[cat.band].text }}>
                      {cat.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-ink mb-2">Recommended board-level actions</h4>
              <ol className="list-decimal list-inside space-y-1.5 opacity-80">
                <li>Receive and approve the 30-day action plan included in this preparedness pack.</li>
                <li>Assign a named individual responsible for overseeing cyber risk for the organisation.</li>
                <li>Confirm whether the organisation has cyber insurance, or ask leadership to obtain a quote.</li>
                <li>Ask for a progress update on the action plan within 30 days.</li>
                <li>Ensure this topic is included as a standing item on at least an annual basis.</li>
              </ol>
            </div>
            <div className="pt-4" style={{ borderTop: BORDER }}>
              <p className="text-ink-muted text-xs">This briefing is based on a self-assessment tool and does not constitute a professional security audit. For high-risk environments, consider engaging a qualified cybersecurity provider for a formal assessment.</p>
            </div>
          </div>
        </div>

        {/* ── TAB 4: STAFF AWARENESS GUIDE ──────────────────────────────── */}
        <div className={sectionClass(4)}>
          <SectionHeader number="5" title="Staff Awareness Guide" />
          <div className="bg-surface rounded-2xl overflow-hidden" style={{ border: BORDER }}>
            <div className="px-8 py-6" style={{ backgroundColor: '#4C5C55' }}>
              <h3 className="font-semibold text-lg" style={{ color: '#F7F4F1' }}>Protecting {orgInfo.name} from ransomware</h3>
              <p className="text-sm mt-1" style={{ color: '#A4AE98' }}>A plain-language guide for all staff and volunteers</p>
            </div>
            <div className="px-8 py-6 space-y-6 text-sm leading-relaxed text-ink">
              <div>
                <h4 className="font-semibold mb-2">What is ransomware?</h4>
                <p className="opacity-80">Ransomware is malicious software that locks your files and demands payment to get them back. It usually gets in through a phishing email - a message that looks legitimate but contains a dangerous link or attachment. Once one computer is infected, it can spread quickly across a network.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How to spot a phishing email</h4>
                <ul className="space-y-2">
                  {[
                    "The sender's email address looks odd or does not match the organisation it claims to be from",
                    'There is unexpected urgency - "Act now", "Your account will be closed", "Invoice overdue"',
                    'The email asks you to click a link or open an attachment you were not expecting',
                    'Something feels off - trust your instincts and check before clicking',
                    'Hover over links before clicking - the real destination often tells a different story',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 opacity-80">
                      <svg className="mt-0.5 w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#7A6020' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What you should always do</h4>
                <ul className="space-y-1.5">
                  {[
                    'Report suspicious emails to your IT contact before clicking anything',
                    'Use a strong, unique password for each system and enable two-factor authentication',
                    'Lock your computer when you walk away from your desk',
                    'Only use approved devices and software for work',
                    'Keep your devices updated - do not ignore software update notifications',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 opacity-80">
                      <svg className="mt-0.5 w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#4C5C55' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: '#F5ECEC', border: '1px solid rgba(139,58,58,0.2)' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#8B3A3A' }}>If you think something has gone wrong</h4>
                <ol className="list-decimal list-inside space-y-1.5" style={{ color: '#8B3A3A' }}>
                  <li>Do not panic - but act quickly.</li>
                  <li>Do not try to fix it yourself or delete anything.</li>
                  <li>Disconnect your device from the internet or network if you can.</li>
                  <li>Call or message your IT contact or manager immediately.</li>
                  <li>Write down what you saw and when - this information is valuable.</li>
                </ol>
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(139,58,58,0.2)' }}>
                  <p className="font-medium" style={{ color: '#8B3A3A' }}>Your cyber contact: ____________________________</p>
                  <p className="font-medium mt-1" style={{ color: '#8B3A3A' }}>Their number: ____________________________</p>
                </div>
              </div>
              <p className="rounded-xl p-4 font-medium text-ink text-center" style={{ backgroundColor: '#EAF0E8' }}>
                Reporting a mistake early is never the wrong thing to do. It can be the difference between a small problem and a major incident.
              </p>
            </div>
          </div>
        </div>

        {/* ── TAB 5: TABLETOP EXERCISE ───────────────────────────────────── */}
        <div className={sectionClass(5)}>
          <SectionHeader number="6" title="Tabletop Exercise" />
          <div className="rounded-xl px-5 py-4 mb-6" style={{ backgroundColor: '#F5F0E6', border: '1px solid rgba(122,96,32,0.2)' }}>
            <p className="text-sm" style={{ color: '#7A6020' }}>
              <strong>How to use this exercise:</strong> Gather your leadership team (6-10 people, 60-90 minutes). Assign a facilitator to read the scenario and inject events. Everyone else responds as they would in a real incident. There are no right answers - the goal is to find gaps and build muscle memory.
            </p>
          </div>
          <div className="bg-surface rounded-2xl overflow-hidden" style={{ border: BORDER }}>
            <div className="px-8 py-6" style={{ backgroundColor: '#4C5C55' }}>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#A4AE98' }}>
                Scenario: {scenario.title}
              </p>
              <h3 className="font-semibold text-lg" style={{ color: '#F7F4F1' }}>
                A ransomware attack hits {orgInfo.name}
              </h3>
            </div>
            <div className="px-8 py-6 space-y-6 text-sm leading-relaxed">
              <div>
                <h4 className="font-semibold text-ink mb-2">Opening situation</h4>
                <p className="text-ink opacity-80 bg-canvas rounded-xl p-4">
                  {scenario.scenario.replace('your organisation', orgInfo.name)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-ink mb-3">Facilitator injects - read these aloud at the times shown</h4>
                <div className="space-y-3">
                  {scenario.injects.map((inject, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span
                        className="flex-shrink-0 text-canvas text-xs font-mono px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: '#4C5C55' }}
                      >
                        {inject.time}
                      </span>
                      <p className="text-ink opacity-80">{inject.event}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-ink mb-3">Discussion questions</h4>
                <ol className="space-y-3">
                  {scenario.discussionQuestions.map((q, i) => (
                    <li key={i} className="flex gap-3 items-start text-ink opacity-80">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center mt-0.5 text-safe"
                        style={{ backgroundColor: '#EAF0E8' }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p>{q}</p>
                        <div className="mt-2 border-b border-dashed h-6" style={{ borderColor: 'rgba(157,142,130,0.4)' }} />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="pt-4" style={{ borderTop: BORDER }}>
                <h4 className="font-semibold text-ink mb-3">After the exercise - capture your findings</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['What we did well', 'Gaps we identified', 'Actions we will take', 'Who is responsible'].map(heading => (
                    <div key={heading} className="rounded-xl p-4" style={{ border: BORDER }}>
                      <p className="text-xs font-medium text-ink-muted uppercase tracking-widest mb-3">{heading}</p>
                      <div className="space-y-2">
                        {[1, 2, 3].map(n => (
                          <div key={n} className="border-b border-dashed h-6" style={{ borderColor: 'rgba(157,142,130,0.35)' }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
