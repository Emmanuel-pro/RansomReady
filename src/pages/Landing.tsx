import { useState } from 'react'
import type { OrgInfo } from '../App'

interface Props {
  onStart: (info: OrgInfo) => void
}

const FEATURE_CARDS = [
  {
    title: 'Readiness Score',
    desc: 'A clear score and breakdown across 5 key areas, so you know exactly where you stand.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></>,
  },
  {
    title: '30-Day Action Plan',
    desc: 'Week-by-week priorities tailored to your specific gaps - practical and achievable.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></>,
  },
  {
    title: 'First Hour Checklist',
    desc: 'A step-by-step guide for the critical first 60 minutes of a ransomware incident.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></>,
  },
  {
    title: 'Board Briefing',
    desc: 'A one-page summary written for non-technical leaders, ready to share or present.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></>,
  },
  {
    title: 'Staff Awareness Guide',
    desc: 'A plain-language page your team can actually read and act on.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></>,
  },
  {
    title: 'Tabletop Exercise',
    desc: 'A realistic ransomware scenario with discussion questions to run with your team.',
    path: <><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></>,
  },
]

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

const SIZES = [
  '1–5 staff',
  '6–20 staff',
  '21–50 staff',
  '51–100 staff',
  '100+ staff',
]

export default function Landing({ onStart }: Props) {
  const [name, setName] = useState('')
  const [sector, setSector] = useState('')
  const [size, setSize] = useState('')
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 no-print">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-brand-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="font-semibold text-slate-800 text-lg">RansomReady</span>
          <span className="text-slate-400 text-sm ml-1">Preparedness Pack Builder</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1 rounded-full mb-5">
                <span>Free · No account required · Local scoring</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
                Know your ransomware risk.<br />
                <span className="text-brand-600">Take action today.</span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Answer 15 plain-language questions and get a personalised preparedness pack - including a 30-day action plan, incident response checklist, board briefing, staff guidance, and a tabletop exercise.
              </p>
              <ul className="space-y-2 text-slate-600">
                {[
                  'Takes under 10 minutes',
                  'Designed for non-technical staff',
                  'Summary API is optional and configurable',
                  'All outputs are printable',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-1">Before we start</h2>
              <p className="text-slate-500 text-sm mb-6">We use this to personalise your pack. Nothing is saved.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Organisation name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Westside Community Trust"
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                      touched && !name.trim() ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                  />
                  {touched && !name.trim() && <p className="text-red-500 text-xs mt-1">Please enter your organisation name</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sector
                  </label>
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                      touched && !sector ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <option value="">Select your sector</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {touched && !sector && <p className="text-red-500 text-xs mt-1">Please select your sector</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Organisation size
                  </label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                      touched && !size ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <option value="">Select size</option>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {touched && !size && <p className="text-red-500 text-xs mt-1">Please select your size</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Start assessment
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* What you get */}
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">What's in your preparedness pack</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_CARDS.map(card => (
              <div key={card.title} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    {card.path}
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="border-t border-slate-200 bg-white py-6 px-6">
          <div className="max-w-5xl mx-auto text-center text-slate-500 text-sm">
            RansomReady is an awareness tool. It does not handle real incident data and does not replace professional cybersecurity advice.
          </div>
        </div>
      </main>
    </div>
  )
}
