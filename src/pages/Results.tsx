import { useRef } from 'react'
import type { ScoredResult } from '../engine/score'
import { BANDS } from '../engine/score'
import type { OrgInfo } from '../App'
import { TABLETOP_SCENARIOS } from '../data/recommendations'
import type { Category } from '../data/questions'
import CategoryIcon from '../components/CategoryIcon'

interface Props {
  result: ScoredResult
  orgInfo: OrgInfo
  onRestart: () => void
}

const WEEK_LABELS = ['Week 1 - Immediate priorities', 'Week 2 - Build on the foundations', 'Week 3 - Strengthen and document', 'Week 4 - Review and sustain']

const EFFORT_COLORS: Record<string, string> = {
  Low:    'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  High:   'bg-red-100 text-red-700',
}

const CAT_COLORS: Record<Category, string> = {
  backups:   'bg-blue-100 text-blue-700',
  access:    'bg-purple-100 text-purple-700',
  awareness: 'bg-amber-100 text-amber-700',
  response:  'bg-red-100 text-red-700',
  patching:  'bg-green-100 text-green-700',
}

function ScoreGauge({ percent, band }: { percent: number; band: keyof typeof BANDS }) {
  const cfg = BANDS[band]
  const color = {
    critical: '#e03131',
    high:     '#e8590c',
    moderate: '#f59f00',
    good:     '#2f9e44',
    strong:   '#3b5bdb',
  }[band]

  // SVG arc gauge
  const r = 64
  const cx = 80
  const cy = 80
  const circumference = Math.PI * r  // half circle
  const offset = circumference * (1 - percent / 100)

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90" className="overflow-visible">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="28" fontWeight="700" fill="#1e293b">{percent}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#64748b">readiness score</text>
      </svg>
      <span className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${cfg.bgColor} ${cfg.textColor}`}>
        {cfg.label}
      </span>
    </div>
  )
}

function CategoryBar({ label, category, percent, band }: { label: string; category: Category; percent: number; band: keyof typeof BANDS }) {
  const color = {
    critical: 'bg-red-500',
    high:     'bg-orange-400',
    moderate: 'bg-amber-400',
    good:     'bg-green-500',
    strong:   'bg-blue-500',
  }[band]

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <CategoryIcon category={category} className="w-3.5 h-3.5 text-slate-400" />
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-600">{percent}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function Results({ result, orgInfo, onRestart }: Props) {
  const packRef = useRef<HTMLDivElement>(null)
  const cfg = BANDS[result.band]
  const scenario = TABLETOP_SCENARIOS[0]

  function handlePrint() {
    window.print()
  }

  const byWeek = [1, 2, 3, 4].map(w => ({
    week: w,
    items: result.actionPlan.filter(a => a.week === w),
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Screen-only header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700">RansomReady</span>
            <span className="text-slate-400 text-sm">· {orgInfo.name}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Start over
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
              Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      <div ref={packRef} className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* ── COVER PAGE ───────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Cover colour band */}
          <div className={`${cfg.bgColor} border-b ${cfg.borderColor} px-8 py-6 flex items-start justify-between`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Ransomware Preparedness Pack</p>
              <h1 className="text-2xl font-bold text-slate-900">{orgInfo.name}</h1>
              <p className="text-slate-500 text-sm mt-1">{orgInfo.sector} · {orgInfo.size} · {orgInfo.date}</p>
            </div>
            <div className="no-print">
              <ScoreGauge percent={result.percent} band={result.band} />
            </div>
            {/* Print-only score */}
            <div className="print-only text-right">
              <div className="text-4xl font-bold text-slate-900">{result.percent}%</div>
              <div className={`text-sm font-semibold ${cfg.textColor}`}>{cfg.label}</div>
            </div>
          </div>

          <div className="px-8 py-6 grid md:grid-cols-2 gap-8">
            {/* Summary */}
            <div>
              <h2 className="text-base font-semibold text-slate-800 mb-2">{cfg.headline}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{cfg.summary}</p>
            </div>
            {/* Category bars */}
            <div className="space-y-3">
              {result.categoryResults.map(cat => (
                <CategoryBar key={cat.category} label={cat.label} category={cat.category} percent={cat.percent} band={cat.band} />
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 1: 30-DAY ACTION PLAN ───────────────────────── */}
        <section className="print-break">
          <SectionHeader number="1" title="Your 30-Day Action Plan" />
          <p className="text-slate-500 text-sm mb-6">
            These actions are personalised based on your assessment results. Start with Week 1 items - they address your most critical gaps.
          </p>
          <div className="space-y-6">
            {byWeek.map(({ week, items }) => items.length > 0 && (
              <div key={week}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">{WEEK_LABELS[week - 1]}</h3>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-semibold text-slate-800 text-sm leading-snug">{item.title}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[item.category]}`}>
                            {item.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EFFORT_COLORS[item.effort]}`}>
                            {item.effort} effort
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: FIRST HOUR CHECKLIST ─────────────────────── */}
        <section className="print-break">
          <SectionHeader number="2" title="First Hour Response Checklist" />
          <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 mb-6">
            <p className="text-red-700 text-sm font-medium">
              This checklist is for use in the first 60 minutes after you suspect a ransomware attack. Print this page and keep a copy accessible offline.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {[
              {
                phase: 'Immediately (0–10 minutes)',
                color: 'bg-red-500',
                steps: [
                  'Do NOT pay the ransom. Do not attempt to negotiate with attackers yourself.',
                  'Do NOT turn off affected computers - preserve them for forensic investigation unless advised by IT.',
                  'Disconnect affected devices from the network (unplug the ethernet cable or disable Wi-Fi).',
                  'Do NOT try to delete files or "fix" anything yourself.',
                  'Alert your designated cyber incident lead or senior manager immediately.',
                ],
              },
              {
                phase: 'First 15 minutes',
                color: 'bg-orange-400',
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
                color: 'bg-amber-400',
                steps: [
                  'Notify senior leadership and key decision-makers.',
                  'Contact your cyber insurer (if you have one) - many policies require prompt notification.',
                  'Check whether your backups are accessible and whether they appear unaffected.',
                  'Consider whether any partners, clients, or stakeholders may be affected and need to be informed.',
                  'Assign one person to keep a written incident log - date/time every action taken.',
                ],
              },
              {
                phase: 'Within 60 minutes',
                color: 'bg-blue-500',
                steps: [
                  'Report the incident to national cybersecurity authorities (NCSC in UK; CISA in US; local equivalent).',
                  'Assess whether personal data may have been compromised - this may trigger a legal reporting obligation.',
                  'Draft a holding statement for staff: acknowledge an incident has occurred, state that it is being managed, ask staff not to discuss externally.',
                  'Begin working with IT support on a recovery plan. Confirm the scope of the attack.',
                  'Do not communicate publicly or via social media until you have a clear picture and a communications plan.',
                ],
              },
            ].map(block => (
              <div key={block.phase} className="border-b border-slate-100 last:border-0">
                <div className={`${block.color} px-5 py-2.5`}>
                  <h3 className="text-white font-semibold text-sm">{block.phase}</h3>
                </div>
                <ul className="px-5 py-4 space-y-2.5">
                  {block.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="mt-0.5 w-5 h-5 border-2 border-slate-300 rounded flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: BOARD BRIEFING ────────────────────────────── */}
        <section className="print-break">
          <SectionHeader number="3" title="Board Briefing - Ransomware Preparedness" />
          <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 text-sm leading-relaxed text-slate-700">
            <div className="border-b border-slate-100 pb-6">
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-1">Prepared for board / trustees</p>
              <h3 className="text-xl font-bold text-slate-900">{orgInfo.name} - Cyber Risk Summary</h3>
              <p className="text-slate-500">{orgInfo.date}</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">What is ransomware and why does it matter to us?</h4>
              <p>Ransomware is a type of cyberattack in which criminals encrypt an organisation's files and demand payment to restore access. Attacks increasingly target charities, non-profits, and community organisations - not because they are high-profile, but because they often have weaker defences and handle sensitive data including personal records, financial information, and beneficiary details.</p>
              <p className="mt-2">The consequences of an attack can include: inability to operate for days or weeks; financial loss; reputational damage; legal obligations if personal data is compromised; and in some cases, permanent loss of critical records.</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Our current readiness</h4>
              <p>Based on a structured self-assessment completed on {orgInfo.date}, {orgInfo.name} achieved a readiness score of <strong>{result.percent}%</strong>, placing us in the <strong className={cfg.textColor}>{cfg.label}</strong> band.</p>
              <div className={`mt-3 p-4 rounded-lg ${cfg.bgColor} border ${cfg.borderColor}`}>
                <p className={`font-medium ${cfg.textColor}`}>{cfg.headline}</p>
                <p className={`mt-1 ${cfg.textColor} opacity-80`}>{cfg.summary}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {result.categoryResults.map(cat => (
                  <div key={cat.category} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <CategoryIcon category={cat.category} className="w-3.5 h-3.5 text-slate-400" />
                      {cat.label}
                    </span>
                    <span className={`font-semibold text-sm ${BANDS[cat.band].textColor}`}>{cat.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Recommended board-level actions</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>Receive and approve the 30-day action plan included in this preparedness pack.</li>
                <li>Assign a named individual responsible for overseeing cyber risk for the organisation.</li>
                <li>Confirm whether the organisation has cyber insurance, or ask leadership to obtain a quote.</li>
                <li>Ask for a progress update on the action plan within 30 days.</li>
                <li>Ensure this topic is included as a standing item on at least an annual basis.</li>
              </ol>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-slate-500 text-xs">This briefing is based on a self-assessment tool and does not constitute a professional security audit. For high-risk environments, consider engaging a qualified cybersecurity provider for a formal assessment.</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: STAFF AWARENESS GUIDE ────────────────────── */}
        <section className="print-break">
          <SectionHeader number="4" title="Staff Awareness Guide" />
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-brand-500 px-8 py-5">
              <h3 className="text-white font-bold text-lg">Protecting {orgInfo.name} from ransomware</h3>
              <p className="text-brand-100 text-sm mt-1">A plain-language guide for all staff and volunteers</p>
            </div>
            <div className="px-8 py-6 space-y-6 text-sm leading-relaxed text-slate-700">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">What is ransomware?</h4>
                <p>Ransomware is malicious software that locks your files and demands payment to get them back. It usually gets in through a phishing email - a message that looks legitimate but contains a dangerous link or attachment. Once one computer is infected, it can spread quickly across a network.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">How to spot a phishing email</h4>
                <ul className="space-y-2">
                  {[
                    'The sender\'s email address looks odd or doesn\'t match the organisation it claims to be from',
                    'There is unexpected urgency - "Act now", "Your account will be closed", "Invoice overdue"',
                    'The email asks you to click a link or open an attachment you weren\'t expecting',
                    'Something feels off - trust your instincts and check before clicking',
                    'Hover over links before clicking - the real destination often tells a different story',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="mt-0.5 w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">What you should always do</h4>
                <ul className="space-y-1.5">
                  {[
                    'Report suspicious emails to your IT contact before clicking anything',
                    'Use a strong, unique password for each system and enable two-factor authentication',
                    'Lock your computer when you walk away from your desk',
                    'Only use approved devices and software for work',
                    'Keep your devices updated - do not ignore software update notifications',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="mt-0.5 w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-700 mb-2">If you think something has gone wrong</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-red-700">
                  <li>Do not panic - but act quickly.</li>
                  <li>Do not try to fix it yourself or delete anything.</li>
                  <li>Disconnect your device from the internet or network if you can.</li>
                  <li>Call or message your IT contact or manager immediately.</li>
                  <li>Write down what you saw and when - this information is valuable.</li>
                </ol>
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-red-700 font-medium">Your cyber contact: ____________________________</p>
                  <p className="text-red-700 font-medium mt-1">Their number: ____________________________</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Remember</h4>
                <p className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-medium text-slate-700 text-center">
                  Reporting a mistake early is never the wrong thing to do. It can be the difference between a small problem and a major incident.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: TABLETOP EXERCISE ─────────────────────────── */}
        <section className="print-break">
          <SectionHeader number="5" title="Tabletop Exercise" />
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>How to use this exercise:</strong> Gather your leadership team (6–10 people, 60–90 minutes). Assign a facilitator to read the scenario and inject events. Everyone else responds as they would in a real incident. There are no right answers - the goal is to find gaps and build muscle memory.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-800 px-8 py-5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Scenario: {scenario.title}</p>
              <h3 className="text-white font-bold text-lg">A ransomware attack hits {orgInfo.name}</h3>
            </div>
            <div className="px-8 py-6 space-y-6 text-sm leading-relaxed">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Opening situation</h4>
                <p className="text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  {scenario.scenario.replace("your organisation", orgInfo.name)}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Facilitator injects - read these aloud at the times shown</h4>
                <div className="space-y-3">
                  {scenario.injects.map((inject, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 bg-slate-800 text-white text-xs font-mono px-2.5 py-1 rounded">{inject.time}</span>
                      <p className="text-slate-700">{inject.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Discussion questions</h4>
                <ol className="space-y-3">
                  {scenario.discussionQuestions.map((q, i) => (
                    <li key={i} className="flex gap-3 items-start text-slate-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <div>
                        <p>{q}</p>
                        <div className="mt-2 border-b border-dashed border-slate-200 h-6" />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-semibold text-slate-800 mb-2">After the exercise - capture your findings</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['What we did well', 'Gaps we identified', 'Actions we will take', 'Who is responsible'].map(heading => (
                    <div key={heading} className="border border-slate-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{heading}</p>
                      <div className="space-y-1.5">
                        {[1, 2, 3].map(n => <div key={n} className="border-b border-dashed border-slate-200 h-6" />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: AI CODING EXPLANATION ─────────────────────── */}
        <section className="print-break">
          <SectionHeader number="6" title="How This Tool Was Built" />
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-sm leading-relaxed text-slate-700 space-y-4">
            <p>RansomReady was built using AI-assisted coding during the Virtual Routes Ransomware Defence Summer Bootcamp (Amsterdam, June–July 2026). The tool was designed, scaffolded, and refined using <strong>Claude Code</strong> - Anthropic's AI coding assistant - over a 2-day sprint.</p>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">What the AI did</h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>Generated the initial project structure (React + TypeScript + Vite + Tailwind)</li>
                <li>Scaffolded all UI components and pages based on natural language specifications</li>
                <li>Helped write the 15 assessment questions and answer scoring logic</li>
                <li>Generated the rule-based recommendation templates for each risk category</li>
                <li>Produced the tabletop exercise scenarios and inject events</li>
                <li>Iterated on layout, visual design, and print styles based on feedback</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">What humans did</h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>Defined the product direction, scope, and constraints</li>
                <li>Reviewed and validated all cybersecurity guidance for accuracy</li>
                <li>Tested the tool against real user flows and refined based on feedback</li>
                <li>Made all design and content decisions - AI was the builder, not the architect</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Important notes</h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>This tool runs entirely in the browser - no data is transmitted or stored</li>
                <li>All scoring is rule-based - there is no LLM involved in the output generation</li>
                <li>The recommendations are general guidance, not a professional security audit</li>
                <li>No external APIs are called at any point during use</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-500">
              Built at the Virtual Routes Ransomware Defence Bootcamp · Amsterdam Business School · June 2026 · Powered by Claude Code (Anthropic)
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 tabular-nums">
        {number}
      </div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
  )
}
