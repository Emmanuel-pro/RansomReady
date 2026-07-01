import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon, XIcon, ArrowRightIcon, RotateCcw } from 'lucide-react'

const BORDER = '1px solid rgba(157, 142, 130, 0.25)'

interface Email {
  id: string
  from: string
  fromAddress: string
  subject: string
  body: string
  attachment?: string
  isPhishing: boolean
  redFlags: string[]
  explanation: string
}

const EMAILS: Email[] = [
  {
    id: 'e1',
    from: 'Microsoft Security Team',
    fromAddress: 'security@microsofft-security.com',
    subject: 'Your Microsoft 365 password expires in 24 hours',
    body: 'Dear User,\n\nYour Microsoft 365 password is set to expire in 24 hours. To avoid losing access to your emails and files, you must reset your password immediately.\n\nIf you do not reset your password, your account will be suspended and access to all Microsoft services will be blocked.\n\nClick here to reset now: http://reset.microsofft-security.com/verify',
    isPhishing: true,
    redFlags: [
      'Sender domain is "microsofft-security.com" — "Microsoft" is misspelled (double f)',
      'Creates false urgency: "24 hours", "account will be suspended"',
      'Reset link goes to the same suspicious domain, not microsoft.com',
      'Generic greeting "Dear User" — Microsoft knows your name',
    ],
    explanation: 'Classic credential-harvesting phishing. The misspelled domain (microsofft) is the clearest giveaway — attackers register lookalike domains hoping you miss the typo.',
  },
  {
    id: 'e2',
    from: 'Accounts Payable',
    fromAddress: 'invoices@xpresssupplies-billing.net',
    subject: 'URGENT: Invoice #4821 overdue — action required today',
    body: 'Dear Customer,\n\nPlease find attached your overdue invoice #4821 for £2,340.00. Payment was due 14 days ago and your account is now on hold.\n\nOpen the attached file to review the invoice and arrange payment immediately to avoid further action being taken.',
    attachment: 'Invoice_4821_OPEN.exe',
    isPhishing: true,
    redFlags: [
      'Attachment is an .exe file — legitimate invoices are always PDF or Word documents',
      'Generic greeting "Dear Customer" — a real supplier knows your organisation\'s name',
      'Unknown sender domain "xpresssupplies-billing.net" is not a known supplier',
      'All-caps URGENT and threat language designed to make you act without thinking',
    ],
    explanation: 'Opening the .exe attachment would install ransomware or malware. Legitimate invoices never arrive as executable files — this is one of the most common delivery methods.',
  },
  {
    id: 'e3',
    from: 'Amazon',
    fromAddress: 'shipment-tracking@amazon.co.uk',
    subject: 'Your order has shipped — estimated delivery Thursday',
    body: 'Hello,\n\nGood news — your recent order (Order #204-7431829-6523168) has been dispatched and is on its way to you.\n\nEstimated delivery: Thursday 3 July\nDelivery address: Your registered address on file\n\nYou can track your parcel by logging in to your account at amazon.co.uk as normal. No action is required from this email.',
    isPhishing: false,
    redFlags: [],
    explanation: 'Legitimate shipping notification. The sender domain matches Amazon\'s real domain, it references a specific order number, requests no credentials, and explicitly says no action is needed.',
  },
  {
    id: 'e4',
    from: 'IT Support',
    fromAddress: 'it-support@company-helpdesk-secure.com',
    subject: 'Action required: Unusual sign-in detected on your account',
    body: 'Hello,\n\nWe have detected a sign-in to your work account from an unrecognised device in Lagos, Nigeria at 03:14 UTC.\n\nIf this was not you, your account may already be compromised. Please verify your identity within the next 2 hours by clicking the link below, or your access will be locked as a precaution.\n\nVerify my identity now →',
    isPhishing: true,
    redFlags: [
      'Your real IT team sends from your organisation\'s own domain, not "company-helpdesk-secure.com"',
      'The 2-hour deadline is designed to panic you into clicking without thinking',
      '"Locked account" threat is a classic pressure tactic',
      'You didn\'t request a security check — unsolicited security alerts are a major red flag',
    ],
    explanation: 'Fake IT security alerts are one of the most effective phishing techniques. Always verify by contacting IT directly through a known number or internal directory — never via a link in the email.',
  },
  {
    id: 'e5',
    from: 'Sarah Jenkins',
    fromAddress: 's.jenkins@yourorg.com',
    subject: 'Team meeting moved to Thursday 2pm — same room',
    body: 'Hi all,\n\nJust a quick note — the Thursday morning team check-in has moved from 10am to 2pm. The room is the same (Meeting Room B, second floor).\n\nApologies for the short notice — let me know if that time doesn\'t work for anyone and we can find an alternative.\n\nThanks,\nSarah',
    isPhishing: false,
    redFlags: [],
    explanation: 'Legitimate internal email. It comes from a known colleague on the organisation domain, contains no links or attachments, requests no action, and has no urgency or credential requests.',
  },
  {
    id: 'e6',
    from: 'Rewards Centre',
    fromAddress: 'no-reply@prizes-amazon-winners.com',
    subject: 'Congratulations! You\'ve been selected for a £500 Amazon voucher',
    body: 'Dear Winner,\n\nYou have been randomly selected to receive a £500 Amazon gift voucher as part of our exclusive customer appreciation programme!\n\nThis is a limited offer. You must claim your reward within 48 hours or it will be automatically reassigned to another recipient.\n\nClaim your £500 voucher now →\n\nThis offer is non-transferable and subject to verification.',
    isPhishing: true,
    redFlags: [
      '"prizes-amazon-winners.com" is not Amazon — it\'s a lookalike domain designed to deceive',
      'Unsolicited prize — you never entered any competition or loyalty programme',
      '48-hour deadline prevents you from pausing to think critically',
      '"Dear Winner" is generic — Amazon would use your name',
    ],
    explanation: 'Classic prize phishing. Clicking the link leads to a credential or payment card harvesting page. If you didn\'t enter it, you didn\'t win it.',
  },
  {
    id: 'e7',
    from: 'BrightPayroll',
    fromAddress: 'payroll@brightpayroll.co.uk',
    subject: 'Your March payslip is ready to view',
    body: 'Hi,\n\nYour payslip for March 2025 is now available in your employee portal.\n\nTo view it, please log in to the portal as normal using your usual credentials — use the address you always use, not any link in this email. No action is required from this message.\n\nIf you have any payroll queries, please contact your HR team directly.\n\nBrightPayroll Automated Notifications',
    isPhishing: false,
    redFlags: [],
    explanation: 'Legitimate payroll notification. It explicitly tells you to log in through your usual portal rather than a link in the email, and requests no credentials — that\'s exactly what a trustworthy system does.',
  },
  {
    id: 'e8',
    from: 'IT Department',
    fromAddress: 'it@itsupp0rt-remote.com',
    subject: 'Mandatory: Install remote support tool on your device by 5pm today',
    body: 'Dear Staff Member,\n\nAs part of a mandatory security compliance update rolling out today, all staff must install our approved remote support agent on their work device before 5pm.\n\nFailure to install by the deadline will result in your device being flagged as non-compliant and access to company systems may be restricted without notice.\n\nDownload and install the tool here:\nhttp://remote-install.itsupp0rt-remote.com/agent.exe',
    isPhishing: true,
    redFlags: [
      'The domain uses a zero instead of "o" — "itsupp0rt-remote.com" is not your IT team\'s domain',
      'Legitimate IT departments deploy software centrally — they never ask you to download from an email link',
      'The download is an .exe file — real remote management tools are installed by IT, not by staff',
      '"Mandatory by 5pm" deadline is designed to override your better judgement under time pressure',
    ],
    explanation: 'Remote access trojan (RAT) delivery attempt. If installed, the attacker gains full control of your device. Legitimate IT never sends software installation links via email under threat of losing access.',
  },
]

type Choice = 'phishing' | 'legitimate'

const SCORE_BANDS = [
  {
    min: 7,
    label: 'Security Analyst',
    color: '#4C5C55',
    bg: '#EAF0E8',
    message: 'Outstanding — you have sharp instincts. Your organisation is safer because of people like you.',
  },
  {
    min: 5,
    label: 'Getting There',
    color: '#7A6020',
    bg: '#F4F0E6',
    message: 'Good awareness with a few gaps. Review the explanations from the rounds you missed and you\'ll be solid.',
  },
  {
    min: 3,
    label: 'Needs Practice',
    color: '#94442A',
    bg: '#F5EFEA',
    message: 'You caught some threats but missed others. Phishing emails are getting more convincing — keep practising.',
  },
  {
    min: 0,
    label: 'High Risk',
    color: '#8B3A3A',
    bg: '#F5ECEC',
    message: 'Several dangerous emails got through. We recommend completing the Staff Awareness module and replaying this game.',
  },
]

interface Props {
  onBack: () => void
}

export default function PhishingAlleyGame({ onBack }: Props) {
  const [round, setRound]   = useState(0)
  const [chosen, setChosen] = useState<Choice | null>(null)
  const [score, setScore]   = useState(0)
  const [done, setDone]     = useState(false)

  const email   = EMAILS[round]
  const correct = chosen !== null ? (chosen === 'phishing') === email.isPhishing : null

  function handleChoose(choice: Choice) {
    if (chosen !== null) return
    setChosen(choice)
    if ((choice === 'phishing') === email.isPhishing) setScore(s => s + 1)
  }

  function handleNext() {
    if (round + 1 >= EMAILS.length) {
      setDone(true)
    } else {
      setRound(r => r + 1)
      setChosen(null)
    }
  }

  function handleRestart() {
    setRound(0)
    setChosen(null)
    setScore(0)
    setDone(false)
  }

  const finalScore = done ? score : 0
  const band = SCORE_BANDS.find(b => finalScore >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1]

  // ── Results screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="max-w-xl mx-auto mt-10 px-4">
        <div className="bg-canvas rounded-2xl p-10 text-center" style={{ border: BORDER }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
            Phishing Alley — Complete
          </p>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: band.bg }}
          >
            <span className="font-display font-semibold text-3xl" style={{ color: band.color }}>
              {score}/{EMAILS.length}
            </span>
          </div>
          <p className="text-xl font-semibold mb-2" style={{ color: band.color }}>{band.label}</p>
          <p className="text-ink-muted text-sm leading-relaxed max-w-sm mx-auto mb-8">
            {band.message}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleRestart}
              className="border-ink-faint text-ink hover:bg-surface cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play again
            </Button>
            <Button
              onClick={onBack}
              className="bg-safe hover:opacity-90 text-canvas cursor-pointer"
            >
              Back to levels
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Game screen ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pb-16">

      {/* Progress bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          ← Back to levels
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-ink-muted">{round + 1} / {EMAILS.length}</span>
          <div className="w-28 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#DCCFC0' }}>
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${((round + (chosen ? 1 : 0)) / EMAILS.length) * 100}%`, backgroundColor: '#4C5C55' }}
            />
          </div>
        </div>
      </div>

      {/* Prompt */}
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4 text-center">
        {chosen ? (correct ? '✓ Correct' : '✗ Incorrect') : 'Legitimate or phishing?'}
      </p>

      {/* Email card */}
      <div
        className="rounded-xl overflow-hidden mb-5 transition-all duration-300"
        style={{
          border: chosen
            ? correct
              ? '1px solid rgba(76, 92, 85, 0.45)'
              : '1px solid rgba(139, 58, 58, 0.45)'
            : BORDER,
        }}
      >
        {/* Email header */}
        <div className="px-5 py-4" style={{ backgroundColor: '#DCCFC0', borderBottom: BORDER }}>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink truncate">{email.from}</p>
              <p className="text-xs text-ink-muted truncate">&lt;{email.fromAddress}&gt;</p>
            </div>
            {chosen && (
              <span
                className="flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={
                  email.isPhishing
                    ? { backgroundColor: '#F5ECEC', color: '#8B3A3A' }
                    : { backgroundColor: '#EAF0E8', color: '#4C5C55' }
                }
              >
                {email.isPhishing ? 'Phishing' : 'Legitimate'}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-ink">{email.subject}</p>
        </div>

        {/* Email body */}
        <div className="bg-canvas px-5 py-5">
          <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{email.body}</p>
          {email.attachment && (
            <div
              className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: chosen ? '#F5ECEC' : '#F7F4F1',
                color: chosen ? '#8B3A3A' : '#262626',
                border: BORDER,
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
              <span>{email.attachment}</span>
              {chosen && <span className="font-bold ml-1">⚠ Never open .exe attachments</span>}
            </div>
          )}
        </div>

        {/* Feedback panel */}
        {chosen && (
          <div
            className="px-5 py-4"
            style={{
              backgroundColor: correct ? '#EAF0E8' : '#F5ECEC',
              borderTop: BORDER,
            }}
          >
            <div className="flex items-start gap-2 mb-3">
              {correct
                ? <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#4C5C55' }} />
                : <XIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8B3A3A' }} />
              }
              <p className="text-sm leading-relaxed" style={{ color: correct ? '#4C5C55' : '#8B3A3A' }}>
                {email.explanation}
              </p>
            </div>
            {email.redFlags.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#8B3A3A' }}>
                  Red flags in this email
                </p>
                <ul className="space-y-1">
                  {email.redFlags.map((flag, i) => (
                    <li key={i} className="text-xs text-ink leading-relaxed flex items-start gap-1.5">
                      <span className="flex-shrink-0 mt-0.5" style={{ color: '#8B3A3A' }}>•</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!chosen ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleChoose('legitimate')}
            className="border-ink-faint text-ink hover:bg-surface cursor-pointer font-semibold"
          >
            ✓ Legitimate
          </Button>
          <Button
            size="lg"
            onClick={() => handleChoose('phishing')}
            className="cursor-pointer font-semibold"
            style={{ backgroundColor: '#8B3A3A', color: '#F7F4F1' }}
          >
            ⚠ Phishing
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          onClick={handleNext}
          className="w-full bg-safe hover:opacity-90 text-canvas cursor-pointer flex items-center justify-center gap-2 font-semibold"
        >
          {round + 1 >= EMAILS.length ? 'See my results' : 'Next email'}
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
