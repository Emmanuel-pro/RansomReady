import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Gamepad2,
  Info,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const BORDER = '1px solid rgba(157, 142, 130, 0.25)'

// ── Content types ────────────────────────────────────────────────────────────

type Block =
  | { type: 'p';       text: string }
  | { type: 'ul';      items: string[] }
  | { type: 'stats';   items: Array<{ value: string; label: string; note: string }> }
  | { type: 'callout'; variant: 'warning' | 'info' | 'tip'; text: string }
  | { type: 'game-link' }

interface Section {
  heading: string
  blocks: Block[]
}

interface Module {
  id:         string
  number:     number
  title:      string
  readTime:   string
  intro:      string
  sections:   Section[]
  takeaways:  string[]
}

// ── Module content ───────────────────────────────────────────────────────────

const MODULES: Module[] = [
  {
    id:       'what-is-ransomware',
    number:   1,
    title:    'What is Ransomware?',
    readTime: '8 min',
    intro:
      'Ransomware is malicious software that encrypts your files and demands payment for the decryption key. It is one of the fastest-growing cyber threats facing organisations of all sizes - including charities, community groups, schools, and small businesses.',
    sections: [
      {
        heading: 'How an attack unfolds',
        blocks: [
          {
            type: 'p',
            text: 'A ransomware attack typically follows the same pattern. An attacker gains access to your network, moves quietly through your systems to understand what you have, then triggers the encryption at a moment designed to cause maximum disruption - often late on a Friday or before a public holiday.',
          },
          {
            type: 'ul',
            items: [
              'Entry: the attacker gets in, usually through a phishing email, a stolen password, or an unpatched vulnerability.',
              'Reconnaissance: they explore your network, locate your backups, and identify your most sensitive data.',
              'Encryption: all accessible files are locked simultaneously. A ransom note appears demanding payment, usually in cryptocurrency.',
              'Extortion: many attackers also steal data before encrypting it, threatening to publish it if you do not pay - a tactic called double extortion.',
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            text: 'Modern ransomware groups often delete or encrypt your backups before triggering the attack. This is why backup isolation - storing copies offline or in a separate environment - is critical.',
          },
        ],
      },
      {
        heading: 'How attackers get in',
        blocks: [
          {
            type: 'p',
            text: 'The majority of ransomware attacks begin in one of three ways. Understanding these entry points is the first step to blocking them.',
          },
          {
            type: 'ul',
            items: [
              'Phishing emails: a staff member clicks a malicious link or opens an infected attachment. This accounts for around 80% of attacks.',
              'Stolen or weak credentials: attackers use passwords obtained from other data breaches, or brute-force weak passwords on remote access systems.',
              'Unpatched software: known vulnerabilities in operating systems and applications are exploited before organisations apply security updates.',
              'Supply chain compromise: a trusted supplier or software tool is compromised, giving attackers a route into your organisation.',
            ],
          },
        ],
      },
      {
        heading: 'Why your organisation is a target',
        blocks: [
          {
            type: 'p',
            text: 'A common misconception is that only large corporations are targeted. In reality, smaller organisations are often specifically chosen because they hold valuable data but invest less in security.',
          },
          {
            type: 'ul',
            items: [
              'Charities and community organisations hold personal data on vulnerable beneficiaries - which is valuable and sensitive.',
              'Smaller teams often share passwords, skip updates, and lack dedicated IT support.',
              'Attackers know that a two-week shutdown could be existential for a small organisation, making payment more likely.',
              'Healthcare, education, and social care organisations face regulatory pressure to restore services quickly - increasing ransom leverage.',
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            text: 'In the 2024 UK Government Cyber Security Breaches Survey, 24% of charities reported experiencing a cyber attack or breach in the previous 12 months.',
          },
        ],
      },
      {
        heading: 'The current threat picture',
        blocks: [
          {
            type: 'stats',
            items: [
              { value: '59%',   label: 'hit by ransomware',    note: 'of organisations surveyed in 2024 (Sophos)' },
              { value: '8%',    label: 'recover all data',     note: 'of organisations that pay the ransom' },
              { value: '21 days', label: 'average downtime',   note: 'to recover from a ransomware attack' },
              { value: '72 hrs', label: 'to report a breach',  note: 'legal window under UK GDPR if personal data is affected' },
            ],
          },
          {
            type: 'p',
            text: 'The average cost of recovering from a ransomware attack - including downtime, staff time, remediation, and reputational damage - now exceeds £2 million for mid-sized organisations. For smaller organisations the absolute cost is lower, but proportionally it can be far more damaging.',
          },
        ],
      },
    ],
    takeaways: [
      'Ransomware encrypts your files and often steals your data before you know anything has happened.',
      'Phishing emails are the entry point in around 80% of attacks - staff awareness is your first line of defence.',
      'Smaller organisations are actively targeted, not ignored.',
      'Paying the ransom does not guarantee recovery - only 8% of organisations get all their data back.',
    ],
  },

  {
    id:       'prevention-essentials',
    number:   2,
    title:    'Prevention Essentials',
    readTime: '10 min',
    intro:
      'No single control eliminates ransomware risk, but five areas of good practice together make an attack significantly less likely - and significantly less damaging when one does occur.',
    sections: [
      {
        heading: 'Backups: your last line of defence',
        blocks: [
          {
            type: 'p',
            text: 'A reliable backup is the single most important control against ransomware. It is what determines whether an attack costs you a few days of disruption or wipes out years of data permanently.',
          },
          {
            type: 'p',
            text: 'Follow the 3-2-1 rule: keep 3 copies of your data, on 2 different types of storage, with 1 copy stored offsite or in the cloud. Critically, the offsite copy must not be reachable from your network - if ransomware can access it, it will encrypt it.',
          },
          {
            type: 'ul',
            items: [
              'Automate backups daily - human memory is not a reliable backup schedule.',
              'Test restoration at least quarterly. A backup you have never tested is not a backup you can rely on.',
              'Enable versioning on cloud storage so you can restore files from before the attack.',
              'Check that your backup service cannot be deleted or modified from a compromised device.',
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            text: 'Microsoft 365 and Google Workspace include built-in backup and versioning, but the default retention periods may be shorter than you expect. Check your settings and consider a dedicated backup tool for longer retention.',
          },
        ],
      },
      {
        heading: 'Access control: who can reach what',
        blocks: [
          {
            type: 'p',
            text: 'Attackers who gain access to one account should not be able to reach everything. Strong access control limits the blast radius of a compromised credential.',
          },
          {
            type: 'ul',
            items: [
              'Multi-factor authentication (MFA): require a second verification step - a phone app code or hardware key - for all staff on email, remote access, and cloud services. MFA blocks the majority of credential-based attacks.',
              'Least privilege: staff should only access files and systems relevant to their role. Avoid shared admin accounts entirely.',
              'Prompt offboarding: remove access on the day someone leaves - not when someone remembers. A dormant account with a former employee\'s credentials is a common attack vector.',
              'Audit access quarterly: review who has access to what and remove anything that is no longer needed.',
            ],
          },
        ],
      },
      {
        heading: 'Keeping systems updated',
        blocks: [
          {
            type: 'p',
            text: 'Ransomware groups actively scan for organisations running unpatched software. Once a vulnerability is publicly disclosed, attackers begin exploiting it within hours. Automatic updates are your best defence.',
          },
          {
            type: 'ul',
            items: [
              'Enable automatic updates on all devices for operating systems and key applications.',
              'Ensure endpoint protection (antivirus) is installed and up to date on every staff device, including personal devices used for work.',
              'Identify any devices running end-of-life software - Windows 10 support ends October 2025 - and plan upgrades.',
              'Apply the same discipline to network devices: routers, firewalls, and printers are often overlooked.',
            ],
          },
        ],
      },
      {
        heading: 'Staff awareness: your human firewall',
        blocks: [
          {
            type: 'p',
            text: 'Technology controls help, but a staff member who knows what to look for - and what to do when something feels wrong - is one of your most effective defences.',
          },
          {
            type: 'ul',
            items: [
              'Run a phishing awareness session at least annually. Short, practical, and relevant to real examples from your sector.',
              'Make sure every staff member knows who to contact if they suspect an incident - and that they should report it immediately, without embarrassment.',
              'Create an acceptable use policy covering passwords, personal device use, and software installation.',
              'Include cyber awareness in onboarding for all new staff and volunteers.',
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            text: 'The UK National Cyber Security Centre (NCSC) offers free resources for small organisations including training materials, board-level guidance, and sector-specific advice at ncsc.gov.uk.',
          },
        ],
      },
    ],
    takeaways: [
      'The 3-2-1 backup rule - with at least one copy offline or isolated - is your most important protection.',
      'MFA on email and remote access is the single highest-impact technical control you can enable today.',
      'Staff who know how to spot and report suspicious activity reduce your risk more than most technical tools.',
      'Patching is not optional: unpatched systems are actively scanned and exploited within hours of a vulnerability being disclosed.',
    ],
  },

  {
    id:       'spotting-the-threat',
    number:   3,
    title:    'Spotting the Threat',
    readTime: '8 min',
    intro:
      'Recognising an attack before it succeeds is one of the most powerful things your team can do. Most ransomware incidents begin with a human decision - clicking a link, opening an attachment, or entering credentials on a fake site. Training that instinct is what this module is about.',
    sections: [
      {
        heading: 'Phishing: the most common entry point',
        blocks: [
          {
            type: 'p',
            text: 'A phishing email is designed to look legitimate and create a sense of urgency that makes you act before you think. Modern phishing is highly targeted - attackers research your organisation, use your staff names, and impersonate suppliers and services you actually use.',
          },
          {
            type: 'p',
            text: 'Red flags to look for in every email:',
          },
          {
            type: 'ul',
            items: [
              'Sender domain: hover over the sender address and check it carefully. "microsofft-security.com" or "amazon-rewards-winners.net" are not the real organisations.',
              'Urgency and pressure: "Your account will be suspended in 24 hours", "Action required today". Legitimate services rarely threaten immediate consequences.',
              'Generic greeting: "Dear Customer" or "Dear User" suggests a mass-sent phishing attempt. Legitimate services use your name.',
              'Unexpected attachments: invoices, contracts, or delivery notifications you were not expecting - especially .exe, .zip, or password-protected files.',
              'Mismatched links: the display text says one URL but hovering reveals a different destination.',
              'Requests for credentials: legitimate services will never ask you to confirm your password via email.',
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            text: 'When in doubt, do not click. Contact the sender directly using a known phone number or email address - not the contact details in the suspicious email itself.',
          },
        ],
      },
      {
        heading: 'Business email compromise',
        blocks: [
          {
            type: 'p',
            text: 'Business email compromise (BEC) is a more sophisticated attack where criminals impersonate a senior leader or trusted supplier to manipulate staff into transferring money or sensitive data.',
          },
          {
            type: 'ul',
            items: [
              'Fake CEO request: an email appearing to come from the director asks a finance team member to make an urgent bank transfer. The real CEO knows nothing about it.',
              'Supplier invoice fraud: a known supplier\'s email is compromised or spoofed. An invoice arrives with different bank account details.',
              'HR payroll redirect: an email purportedly from a staff member asks for their payroll bank details to be updated.',
            ],
          },
          {
            type: 'p',
            text: 'The defence is simple but must be applied consistently: verify any unexpected financial request or change to payment details by calling the person directly on a known number before acting.',
          },
        ],
      },
      {
        heading: 'What to do if you click something suspicious',
        blocks: [
          {
            type: 'p',
            text: 'If you suspect you have clicked a malicious link, opened a harmful attachment, or entered credentials on a fake site, act immediately. The speed of your response matters.',
          },
          {
            type: 'ul',
            items: [
              'Do not restart your device - this can trigger some ransomware and destroy forensic evidence.',
              'Disconnect from the network immediately: unplug the ethernet cable or turn off Wi-Fi. This limits how far the attacker can spread.',
              'Do not try to fix it yourself - contact your IT support straight away.',
              'Report it to your designated cyber contact, even if you are not sure anything happened. Early warning gives your team options.',
              'If you entered a password on a fake site, change that password from a different, unaffected device right away.',
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            text: 'Reporting an incident quickly is always the right thing to do - even if it turns out to be nothing. Early detection is far better than discovered-too-late. Organisations with a blame-free reporting culture detect attacks significantly faster.',
          },
        ],
      },
      {
        heading: 'Test your instincts',
        blocks: [
          {
            type: 'p',
            text: 'Reading about phishing red flags is one thing. Practising against real-feeling examples is how the instinct actually develops. Try the Phishing Alley game to test what you have learned across 8 graded email scenarios.',
          },
          { type: 'game-link' },
        ],
      },
    ],
    takeaways: [
      'Check the sender domain carefully - misspelled or lookalike domains are the most common red flag.',
      'Urgency is a manipulation technique. Pause before acting on any email that creates time pressure.',
      'If you click something suspicious, disconnect from the network and report it immediately - do not wait.',
      'Business email compromise often targets finance teams - always verify unexpected payment requests by phone.',
    ],
  },

  {
    id:       'responding-to-an-incident',
    number:   4,
    title:    'Responding to an Incident',
    readTime: '10 min',
    intro:
      'If ransomware hits your organisation, the decisions made in the first hour determine how bad the outcome will be. A clear, rehearsed response plan - even a simple one - is worth more than any technical tool deployed after the fact.',
    sections: [
      {
        heading: 'The first 60 minutes',
        blocks: [
          {
            type: 'p',
            text: 'The moment you suspect ransomware, the priority is containment - stopping the attack from spreading to more systems. Speed matters more than certainty at this stage.',
          },
          {
            type: 'ul',
            items: [
              'Isolate affected devices: disconnect them from the network (unplug ethernet, disable Wi-Fi) but leave them powered on unless instructed otherwise by your IT support. Forensic evidence is preserved on running machines.',
              'Do not pay the ransom yet: payment does not guarantee recovery, encourages further attacks, and may be illegal if the attacker is on a sanctions list.',
              'Alert your IT support or incident response provider immediately.',
              'Notify senior leadership: they need to know and need to be prepared to communicate to staff, funders, and beneficiaries.',
              'Begin a log: write down everything you notice and every action taken, with timestamps. This is essential for insurers and regulators.',
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            text: 'Do not use the compromised systems to manage the response. Use personal devices or a separate, unaffected system for communications during the incident.',
          },
        ],
      },
      {
        heading: 'Who to call',
        blocks: [
          {
            type: 'p',
            text: 'Have these contacts documented and accessible offline - not just stored on systems that may be encrypted.',
          },
          {
            type: 'ul',
            items: [
              'Your IT support provider or managed security service: the first technical call.',
              'Your cyber insurer: if you have cyber insurance, notify them early. Many policies include incident response support and legal advice.',
              'NCSC (National Cyber Security Centre): report significant incidents at ncsc.gov.uk/section/about-this-website/report-an-incident. The NCSC provides free guidance and may be able to assist.',
              'Action Fraud: report cybercrime in the UK at actionfraud.police.uk or call 0300 123 2040.',
              'The ICO (Information Commissioner\'s Office): if personal data may have been accessed or stolen, you have a legal obligation to report within 72 hours under UK GDPR.',
            ],
          },
        ],
      },
      {
        heading: 'The ransom question',
        blocks: [
          {
            type: 'p',
            text: 'The NCSC advises strongly against paying ransoms. Here is why.',
          },
          {
            type: 'ul',
            items: [
              'Payment does not guarantee decryption: only around 8% of organisations that pay recover all their data.',
              'Payment funds further attacks: it signals that you are a viable target and may result in repeat attacks.',
              'Payment may be illegal: some ransomware groups are on government sanctions lists. Paying them could expose your organisation to legal liability.',
              'Payment may violate your insurance policy: check with your insurer before making any decision.',
            ],
          },
          {
            type: 'p',
            text: 'The decision to pay should never be made under time pressure alone. Involve your legal adviser, insurer, and board before committing. If your backups are intact, recovery without payment is almost always achievable.',
          },
        ],
      },
      {
        heading: 'Recovery and legal obligations',
        blocks: [
          {
            type: 'p',
            text: 'Recovering safely from ransomware takes time. Rushing the process risks re-infection from malware that was not fully removed.',
          },
          {
            type: 'ul',
            items: [
              'Work with your IT support to identify how the attacker got in before restoring systems - otherwise you may be restoring into a compromised environment.',
              'Restore from the most recent clean backup, confirming it predates the attack.',
              'Reset all credentials organisation-wide: passwords, API keys, service accounts.',
              'Conduct a post-incident review within two weeks. What worked in the response? What gaps did the incident expose?',
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            text: 'Under UK GDPR, if personal data was accessed, exfiltrated, or lost, you must notify the ICO within 72 hours of becoming aware. Late notification can result in regulatory action. If in doubt, report - the ICO takes proportionality into account for organisations that self-report promptly.',
          },
        ],
      },
    ],
    takeaways: [
      'Isolate affected devices immediately - disconnect from the network but leave them on.',
      'Document everything: timestamps, observations, and every action taken. Insurers and regulators will ask.',
      'The NCSC advises against paying ransoms. Engage your insurer and legal adviser before making any decision.',
      'If personal data may have been affected, you have 72 hours to notify the ICO under UK GDPR.',
    ],
  },
]

// ── Sub-components ───────────────────────────────────────────────────────────

function StatGrid({ items }: { items: Array<{ value: string; label: string; note: string }> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
      {items.map(stat => (
        <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: '#DCCFC0', border: BORDER }}>
          <p className="text-2xl font-semibold text-ink mb-0.5">{stat.value}</p>
          <p className="text-xs font-semibold text-ink mb-1">{stat.label}</p>
          <p className="text-xs text-ink-muted leading-relaxed">{stat.note}</p>
        </div>
      ))}
    </div>
  )
}

function Callout({ variant, text }: { variant: 'warning' | 'info' | 'tip'; text: string }) {
  const styles = {
    warning: { bg: '#F5ECEC', border: '1px solid rgba(139,58,58,0.2)', icon: TriangleAlert, color: '#8B3A3A' },
    info:    { bg: '#EAF0E8', border: '1px solid rgba(76,92,85,0.2)',   icon: Info,          color: '#4C5C55' },
    tip:     { bg: '#F4F0E6', border: '1px solid rgba(122,96,32,0.2)', icon: Info,          color: '#7A6020' },
  }
  const s = styles[variant]
  const Icon = s.icon
  return (
    <div className="flex items-start gap-3 rounded-xl p-4 my-4" style={{ backgroundColor: s.bg, border: s.border }}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: s.color }} />
      <p className="text-sm leading-relaxed" style={{ color: s.color }}>{text}</p>
    </div>
  )
}

function GameLinkCard({ onNavigateToGame }: { onNavigateToGame?: () => void }) {
  return (
    <div className="rounded-xl p-5 my-4 flex items-center justify-between gap-4" style={{ backgroundColor: '#DCCFC0', border: BORDER }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4C5C55' }}>
          <Gamepad2 className="w-5 h-5" style={{ color: '#F7F4F1' }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Phishing Alley</p>
          <p className="text-xs text-ink-muted">8 rounds - identify real and fake emails and see your score</p>
        </div>
      </div>
      {onNavigateToGame && (
        <Button
          size="sm"
          onClick={onNavigateToGame}
          className="bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer flex items-center gap-1.5 flex-shrink-0"
        >
          Play
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  )
}

function BlockRenderer({ block, onNavigateToGame }: { block: Block; onNavigateToGame?: () => void }) {
  if (block.type === 'p') {
    return <p className="text-sm text-ink leading-relaxed mb-3">{block.text}</p>
  }
  if (block.type === 'ul') {
    return (
      <ul className="space-y-2 mb-3">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-ink leading-relaxed">
            <ChevronRight className="w-3.5 h-3.5 text-safe flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (block.type === 'stats') {
    return <StatGrid items={block.items} />
  }
  if (block.type === 'callout') {
    return <Callout variant={block.variant} text={block.text} />
  }
  if (block.type === 'game-link') {
    return <GameLinkCard onNavigateToGame={onNavigateToGame} />
  }
  return null
}

// ── Main component ───────────────────────────────────────────────────────────

interface Props {
  onBack:             () => void
  onNavigateToGame?:  () => void
}

export default function Learn({ onBack, onNavigateToGame }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [completed, setCompleted]         = useState<Set<string>>(new Set())

  const module      = MODULES[selectedIndex]
  const isDone      = completed.has(module.id)
  const totalDone   = completed.size

  function markComplete() {
    setCompleted(prev => new Set([...prev, module.id]))
    if (selectedIndex < MODULES.length - 1) {
      setSelectedIndex(selectedIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-24">

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">Learning Path</p>
          <h1 className="font-display text-2xl font-semibold text-ink">Ransomware Awareness</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-ink-muted">
            <BookOpen className="w-4 h-4 text-safe" />
            <span>{totalDone} / {MODULES.length} complete</span>
          </div>
          <button
            onClick={onBack}
            className="text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-2">
            {MODULES.map((m, i) => {
              const done    = completed.has(m.id)
              const current = i === selectedIndex
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedIndex(i)}
                  className="w-full text-left rounded-xl p-4 transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: current ? '#DCCFC0' : 'transparent',
                    border:          current ? BORDER : '1px solid transparent',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-safe" />
                        : <Circle className="w-4 h-4 text-ink-faint" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-muted mb-0.5">Module {m.number}</p>
                      <p className={`text-sm font-medium leading-snug ${current ? 'text-ink' : 'text-ink-muted'}`}>
                        {m.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-ink-faint" />
                        <span className="text-xs text-ink-faint">{m.readTime}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Overall progress bar */}
            <div className="pt-2 px-1">
              <div className="flex justify-between text-xs text-ink-muted mb-1.5">
                <span>Progress</span>
                <span>{totalDone}/{MODULES.length}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#DCCFC0' }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${(totalDone / MODULES.length) * 100}%`, backgroundColor: '#4C5C55' }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Module content ── */}
        <article className="flex-1 min-w-0">
          <div className="rounded-2xl overflow-hidden" style={{ border: BORDER }}>

            {/* Module header */}
            <div className="bg-surface px-7 py-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Module {module.number}
                </span>
                {isDone && (
                  <span
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#EAF0E8', color: '#4C5C55' }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink mb-1">{module.title}</h2>
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{module.readTime} read</span>
              </div>
            </div>

            {/* Module body */}
            <div className="bg-canvas px-7 py-7">

              {/* Intro */}
              <p className="text-base text-ink leading-relaxed mb-8 max-w-prose">{module.intro}</p>

              {/* Sections */}
              {module.sections.map((section, si) => (
                <div key={si} className="mb-8">
                  <h3 className="text-base font-semibold text-ink mb-3 pb-2" style={{ borderBottom: BORDER }}>
                    {section.heading}
                  </h3>
                  {section.blocks.map((block, bi) => (
                    <BlockRenderer key={bi} block={block} onNavigateToGame={onNavigateToGame} />
                  ))}
                </div>
              ))}

              {/* Key takeaways */}
              <div className="rounded-xl p-5 mb-7" style={{ backgroundColor: '#DCCFC0', border: BORDER }}>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4 text-safe" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-safe">Key takeaways</p>
                </div>
                <ul className="space-y-2">
                  {module.takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-safe flex-shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA row */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {isDone ? (
                  <span className="flex items-center gap-2 text-sm font-medium text-safe">
                    <CheckCircle2 className="w-4 h-4" />
                    Module complete
                  </span>
                ) : (
                  <Button
                    onClick={markComplete}
                    className="bg-safe hover:opacity-90 text-canvas font-semibold cursor-pointer flex items-center gap-2"
                  >
                    {selectedIndex < MODULES.length - 1 ? 'Mark complete and continue' : 'Mark complete'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}

                {selectedIndex < MODULES.length - 1 && (
                  <button
                    onClick={() => { setSelectedIndex(selectedIndex + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Next: {MODULES[selectedIndex + 1].title}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>

      </div>
    </div>
  )
}
