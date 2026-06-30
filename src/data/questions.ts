export type Category = 'backups' | 'access' | 'awareness' | 'response' | 'patching'

export interface Question {
  id: string
  category: Category
  text: string
  subtext?: string
  options: { label: string; value: number }[]
}

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  backups:   { label: 'Backup & Recovery',  color: 'blue' },
  access:    { label: 'Access Control',     color: 'purple' },
  awareness: { label: 'Staff Awareness',    color: 'amber' },
  response:  { label: 'Incident Response',  color: 'red' },
  patching:  { label: 'Updates & Patching', color: 'green' },
}

export const QUESTIONS: Question[] = [
  // BACKUPS (3 questions, max 9 pts)
  {
    id: 'b1',
    category: 'backups',
    text: 'How often does your organisation back up its important data?',
    subtext: 'Think about files, emails, databases, and financial records.',
    options: [
      { label: 'Daily or more frequently',          value: 3 },
      { label: 'Weekly',                            value: 2 },
      { label: 'Monthly or less often',             value: 1 },
      { label: 'We do not have regular backups',    value: 0 },
    ],
  },
  {
    id: 'b2',
    category: 'backups',
    text: 'Where are your backups stored?',
    subtext: 'The 3-2-1 rule: 3 copies, 2 different media, 1 offsite.',
    options: [
      { label: 'Multiple locations including offsite or cloud',   value: 3 },
      { label: 'External drive or separate server on our network', value: 2 },
      { label: 'Same device or same local network only',          value: 1 },
      { label: 'We are not sure',                                 value: 0 },
    ],
  },
  {
    id: 'b3',
    category: 'backups',
    text: 'When did you last successfully test restoring from a backup?',
    options: [
      { label: 'Within the last 3 months',   value: 3 },
      { label: 'Within the last year',       value: 2 },
      { label: 'More than a year ago',       value: 1 },
      { label: 'We have never tested this',  value: 0 },
    ],
  },

  // ACCESS CONTROL (3 questions, max 9 pts)
  {
    id: 'a1',
    category: 'access',
    text: 'Does your organisation use multi-factor authentication (MFA) for email and key systems?',
    subtext: 'MFA is a second step - like a code sent to your phone - when logging in.',
    options: [
      { label: 'Yes, for all staff on all key systems',  value: 3 },
      { label: 'Yes, for some staff or some systems',    value: 2 },
      { label: 'No, but we are planning to',             value: 1 },
      { label: 'No',                                     value: 0 },
    ],
  },
  {
    id: 'a2',
    category: 'access',
    text: 'How do you manage who has access to sensitive files and systems?',
    options: [
      { label: 'Staff only access what they need for their role',       value: 3 },
      { label: 'Most staff have access to most things',                 value: 1 },
      { label: 'We have not really thought about this',                 value: 0 },
      { label: 'We use shared accounts or passwords',                   value: 0 },
    ],
  },
  {
    id: 'a3',
    category: 'access',
    text: 'What happens to system access when a staff member or volunteer leaves?',
    options: [
      { label: 'Access is removed the same day they leave',     value: 3 },
      { label: 'Access is removed within the week',             value: 2 },
      { label: 'It happens eventually but not consistently',    value: 1 },
      { label: 'We are not sure former users are removed',      value: 0 },
    ],
  },

  // STAFF AWARENESS (3 questions, max 9 pts)
  {
    id: 'w1',
    category: 'awareness',
    text: 'How confident are your staff in spotting a phishing email?',
    subtext: 'Phishing emails are the most common way ransomware gets in.',
    options: [
      { label: 'We have had formal training in the last year',           value: 3 },
      { label: 'We have had informal guidance or reminders',             value: 2 },
      { label: 'Some staff know but we have not trained everyone',       value: 1 },
      { label: 'We have not addressed phishing awareness',               value: 0 },
    ],
  },
  {
    id: 'w2',
    category: 'awareness',
    text: 'Do staff know who to contact if they suspect a cyberattack or see something suspicious?',
    options: [
      { label: 'Yes, there is a clear process and a named person',  value: 3 },
      { label: 'Roughly - they would probably figure it out',       value: 2 },
      { label: 'Not really',                                        value: 0 },
      { label: 'No',                                                value: 0 },
    ],
  },
  {
    id: 'w3',
    category: 'awareness',
    text: 'Does your organisation have a policy on acceptable use of devices and software?',
    options: [
      { label: 'Yes, documented and shared with all staff',     value: 3 },
      { label: 'Informally understood but not written down',    value: 1 },
      { label: 'No',                                            value: 0 },
    ],
  },

  // INCIDENT RESPONSE (3 questions, max 9 pts)
  {
    id: 'r1',
    category: 'response',
    text: 'Does your organisation have a written plan for what to do if you suffer a ransomware attack?',
    options: [
      { label: 'Yes, and it has been reviewed or tested',         value: 3 },
      { label: 'Yes, but it has not been tested',                 value: 2 },
      { label: 'No, but we are planning to create one',           value: 1 },
      { label: 'No',                                              value: 0 },
    ],
  },
  {
    id: 'r2',
    category: 'response',
    text: 'Do you have cyber insurance, or have you checked whether your existing insurance covers a cyberattack?',
    options: [
      { label: 'Yes, we have specific cyber insurance',                           value: 3 },
      { label: 'We have checked and our existing policy includes cyber cover',    value: 2 },
      { label: 'We have not checked but plan to',                                 value: 1 },
      { label: 'No and we have not considered it',                                value: 0 },
    ],
  },
  {
    id: 'r3',
    category: 'response',
    text: 'Do you have an up-to-date list of key contacts for a cyber emergency (IT support, insurer, senior leadership)?',
    options: [
      { label: 'Yes, documented and accessible offline',          value: 3 },
      { label: 'Yes, but only in digital form or email',          value: 2 },
      { label: 'Informally - we would figure it out at the time', value: 1 },
      { label: 'No',                                              value: 0 },
    ],
  },

  // PATCHING (3 questions, max 9 pts)
  {
    id: 'p1',
    category: 'patching',
    text: 'How up to date are the software and operating systems on your organisation\'s devices?',
    options: [
      { label: 'We apply updates promptly - within days of release',     value: 3 },
      { label: 'We apply updates monthly or as part of a routine',       value: 2 },
      { label: 'Updates happen when someone remembers',                  value: 1 },
      { label: 'We are not sure - some devices may be out of date',      value: 0 },
    ],
  },
  {
    id: 'p2',
    category: 'patching',
    text: 'Do you have antivirus or endpoint protection software installed on staff devices?',
    options: [
      { label: 'Yes, on all devices and kept up to date',            value: 3 },
      { label: 'Yes, on most devices',                               value: 2 },
      { label: 'On some devices but not all',                        value: 1 },
      { label: 'No or we are not sure',                              value: 0 },
    ],
  },
  {
    id: 'p3',
    category: 'patching',
    text: 'Do staff use personal or unmanaged devices to access work systems or data?',
    options: [
      { label: 'No, all access is via organisation-managed devices',                    value: 3 },
      { label: 'Sometimes, but we have guidelines in place',                            value: 2 },
      { label: 'Yes, and we have limited control over those devices',                   value: 0 },
      { label: 'We are not sure what devices are being used to access our systems',     value: 0 },
    ],
  },
]

export const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.value)), 0)
