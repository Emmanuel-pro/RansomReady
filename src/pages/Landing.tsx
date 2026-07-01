import { useState } from 'react'
import type { OrgInfo } from '../App'

interface Props {
  onStart: (info: OrgInfo) => void
}

const SECTORS = [
  'Charity / Non-profit',
  'Community organisation',
  'Social enterprise',
  'Housing association',
  'Healthcare (small clinic / GP)',
  'Education (school / college)',
  'Faith organisation',
  'Local government / public body',
  'Small business',
  'Other',
]

const SIZES = ['1-5 staff', '6-20 staff', '21-50 staff', '51-100 staff', '100+ staff']

const OUTPUTS = [
  {
    label: 'Readiness Score',
    desc: 'A scored breakdown across five key risk areas with a clear visual summary.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></>,
  },
  {
    label: '30-Day Action Plan',
    desc: 'Week-by-week priorities personalised to your specific gaps.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></>,
  },
  {
    label: 'First Hour Checklist',
    desc: 'Step-by-step response guide for the critical first 60 minutes of an incident.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></>,
  },
  {
    label: 'Board Briefing',
    desc: 'A one-page summary written for non-technical trustees and senior leaders.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></>,
  },
  {
    label: 'Staff Awareness Guide',
    desc: 'A plain-language guide every member of your team can read and act on.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></>,
  },
  {
    label: 'Tabletop Exercise',
    desc: 'A realistic scenario with timed injects your leadership team can run in 90 minutes.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></>,
  },
]

const BORDER = '1px solid rgba(157, 142, 130, 0.25)'

function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink tracking-widest uppercase mb-2">
        {label}
      </label>
      {children}
      {error && <p className="text-xs mt-1.5" style={{ color: '#8B3A3A' }}>{error}</p>}
    </div>
  )
}

export default function Landing({ onStart }: Props) {
  const [name, setName]       = useState('')
  const [sector, setSector]   = useState('')
  const [size, setSize]       = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = name.trim() && sector && size

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!isValid) return
    onStart({
      name: name.trim(),
      sector,
      size,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    })
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">

      {/* Nav */}
      <header className="bg-canvas no-print" style={{ borderBottom: BORDER }}>
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-safe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-sm font-semibold text-ink tracking-tight">RansomReady</span>
          </div>
          <span className="text-xs tracking-widest uppercase text-ink-muted hidden sm:block">
            Preparedness Pack Builder
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Left */}
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-ink-muted mb-7">
                Ransomware Awareness Tool
              </p>
              <h1 className="font-display font-semibold text-ink leading-tight tracking-display mb-6" style={{ fontSize: '3.5rem' }}>
                Know your risk.<br />Take control.
              </h1>
              <p className="text-ink-muted leading-relaxed mb-10 max-w-sm">
                Answer 15 plain-language questions. Receive a complete preparedness pack - scored, personalised, and ready to act on.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-14">
                {['Under 10 minutes', 'No data stored or transmitted', 'AI summary is optional'].map(item => (
                  <span key={item} className="flex items-center gap-2 text-xs text-ink-muted">
                    <svg className="w-3 h-3 text-safe flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {OUTPUTS.map(card => (
                  <div
                    key={card.label}
                    className="bg-surface rounded-xl p-4 transition-all duration-200 ease-out hover:shadow-card"
                    style={{ border: BORDER }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-3.5 h-3.5 text-safe flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        {card.path}
                      </svg>
                      <span className="text-xs font-semibold text-ink">{card.label}</span>
                    </div>
                    <p className="text-ink text-xs leading-relaxed opacity-70">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:pt-10">
              <div
                className="bg-surface rounded-2xl p-8 shadow-subtle"
                style={{ border: BORDER }}
              >
                <h2 className="font-display text-2xl font-semibold text-ink tracking-tight mb-1">
                  Begin your assessment
                </h2>
                <p className="text-ink-muted text-sm mb-8">
                  We use these details to personalise your pack. Nothing is saved.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field label="Organisation name" error={touched && !name.trim() ? 'Required' : ''}>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Westside Community Trust"
                      className="w-full bg-canvas text-ink text-sm px-4 py-3 rounded-xl placeholder:text-ink-muted focus:outline-none transition-all duration-200 ease-out"
                      style={{ border: BORDER }}
                    />
                  </Field>

                  <Field label="Sector" error={touched && !sector ? 'Required' : ''}>
                    <select
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                      className="w-full bg-canvas text-ink text-sm px-4 py-3 rounded-xl appearance-none focus:outline-none transition-all duration-200 ease-out"
                      style={{ border: BORDER }}
                    >
                      <option value="">Select your sector</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>

                  <Field label="Organisation size" error={touched && !size ? 'Required' : ''}>
                    <select
                      value={size}
                      onChange={e => setSize(e.target.value)}
                      className="w-full bg-canvas text-ink text-sm px-4 py-3 rounded-xl appearance-none focus:outline-none transition-all duration-200 ease-out"
                      style={{ border: BORDER }}
                    >
                      <option value="">Select size</option>
                      {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>

                  <button
                    type="submit"
                    className="w-full text-canvas text-sm font-semibold py-3.5 rounded-xl tracking-tight hover:opacity-85 transition-opacity duration-200 ease-out flex items-center justify-center gap-2 mt-2"
                    style={{ backgroundColor: '#4C5C55' }}
                  >
                    Start assessment
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 pb-10">
          <p className="text-xs text-ink-muted">
            RansomReady is an awareness tool. It does not handle real incident data and does not replace professional cybersecurity advice.
          </p>
        </div>
      </main>
    </div>
  )
}
