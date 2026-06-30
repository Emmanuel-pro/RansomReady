import type { Category } from './questions'

export type RiskBand = 'critical' | 'high' | 'moderate' | 'good' | 'strong'

export interface BandConfig {
  label: string
  bg: string
  text: string
  headline: string
  summary: string
}

export const BANDS: Record<RiskBand, BandConfig> = {
  critical: {
    label: 'Critical Risk',
    bg:    '#F5ECEC',
    text:  '#8B3A3A',
    headline: 'Immediate action required',
    summary: 'Your organisation currently has very limited protection against ransomware. A basic attack could cause serious and potentially irreversible damage. The actions in this pack should be treated as urgent.',
  },
  high: {
    label: 'High Risk',
    bg:    '#F5EFEA',
    text:  '#94442A',
    headline: 'Significant gaps identified',
    summary: 'There are important gaps in your defences that a ransomware attacker could exploit. This pack will help you prioritise the most important improvements over the next 30 days.',
  },
  moderate: {
    label: 'Moderate Risk',
    bg:    '#F4F0E6',
    text:  '#7A6020',
    headline: 'Good foundations, gaps remain',
    summary: 'You have some important protections in place, but there are gaps that could still leave you vulnerable. Focus on the areas flagged below to strengthen your overall posture.',
  },
  good: {
    label: 'Good Posture',
    bg:    '#EAF0E8',
    text:  '#4C5C55',
    headline: 'Above average - keep improving',
    summary: 'Your organisation has solid ransomware defences in most areas. Use this pack to close the remaining gaps and maintain what you have already put in place.',
  },
  strong: {
    label: 'Strong Posture',
    bg:    '#D8EAE4',
    text:  '#262626',
    headline: 'Excellent - sustain and verify',
    summary: 'Your organisation has strong ransomware preparedness across all key areas. The priority now is testing, maintaining, and verifying that your controls remain effective over time.',
  },
}

export interface ActionItem {
  title: string
  detail: string
  effort: 'Low' | 'Medium' | 'High'
  week: 1 | 2 | 3 | 4
  category: Category
}

export const CATEGORY_ACTIONS: Record<Category, { weak: ActionItem[]; moderate: ActionItem[]; strong: ActionItem[] }> = {
  backups: {
    weak: [
      {
        title: 'Set up automated daily backups immediately',
        detail: 'Use a cloud backup service (e.g. Microsoft 365 Backup, Google Workspace, Acronis, or Backblaze) to automatically back up critical files daily. Ensure backups are stored offsite or in the cloud - not only on devices connected to your network.',
        effort: 'Medium',
        week: 1,
        category: 'backups',
      },
      {
        title: 'Implement the 3-2-1 backup rule',
        detail: 'Maintain 3 copies of your data, on 2 different types of storage, with 1 copy stored offsite or in the cloud. This ensures that even if ransomware encrypts your local files and backups, you retain a clean copy.',
        effort: 'Medium',
        week: 1,
        category: 'backups',
      },
      {
        title: 'Test a full restore within the next two weeks',
        detail: 'A backup you have never tested is not a backup you can rely on. Schedule a test where you restore a sample of critical files from your backup system and confirm they are intact and usable.',
        effort: 'Low',
        week: 2,
        category: 'backups',
      },
    ],
    moderate: [
      {
        title: 'Verify backups include all critical systems',
        detail: 'Review what is currently being backed up. Ensure this includes financial records, donor/client data, email, and any shared drives. Identify and fill any gaps.',
        effort: 'Low',
        week: 1,
        category: 'backups',
      },
      {
        title: 'Schedule a quarterly backup restore test',
        detail: 'Set a recurring reminder to test restoring from backup every quarter. Document the date and result each time so you have a record for audits or insurers.',
        effort: 'Low',
        week: 2,
        category: 'backups',
      },
    ],
    strong: [
      {
        title: 'Review backup immutability settings',
        detail: 'Confirm that your cloud or offsite backup cannot be deleted or encrypted by ransomware that gains access to your systems. Enable write-once or versioned backup settings where available.',
        effort: 'Low',
        week: 3,
        category: 'backups',
      },
    ],
  },

  access: {
    weak: [
      {
        title: 'Enable multi-factor authentication (MFA) for all staff',
        detail: 'Enable MFA on email (Microsoft 365, Google Workspace), remote access, and any cloud services. This single step stops the majority of credential-based attacks. Most platforms offer free MFA via an authenticator app.',
        effort: 'Medium',
        week: 1,
        category: 'access',
      },
      {
        title: 'Audit who has access to what',
        detail: 'List all staff, volunteers, and contractors and review what systems they can access. Remove accounts that are no longer needed. Ensure admin-level access is restricted to only those who need it.',
        effort: 'Medium',
        week: 1,
        category: 'access',
      },
      {
        title: 'Create an offboarding checklist',
        detail: 'Create a simple checklist that is completed whenever someone leaves your organisation. It must include: revoke email access, remove from shared drives, change any shared passwords they knew, and remove from any platforms.',
        effort: 'Low',
        week: 2,
        category: 'access',
      },
    ],
    moderate: [
      {
        title: 'Extend MFA to all remaining staff and systems',
        detail: 'If MFA is partially deployed, prioritise completing coverage across all staff and all systems that hold sensitive data.',
        effort: 'Low',
        week: 1,
        category: 'access',
      },
      {
        title: 'Apply least-privilege access to shared drives',
        detail: 'Review permissions on shared file storage. Staff should only be able to access folders relevant to their role. Restrict editing rights where read-only access is sufficient.',
        effort: 'Medium',
        week: 2,
        category: 'access',
      },
    ],
    strong: [
      {
        title: 'Schedule a quarterly access review',
        detail: 'Set a recurring reminder to review user accounts and permissions every quarter. Document changes made.',
        effort: 'Low',
        week: 4,
        category: 'access',
      },
    ],
  },

  awareness: {
    weak: [
      {
        title: 'Run a phishing awareness session for all staff',
        detail: 'Hold a 30-minute all-staff session covering: how to spot phishing emails, what to do if you click something suspicious, and who to contact. Focus on real examples relevant to your sector. Free resources are available from the UK NCSC and CISA.',
        effort: 'Low',
        week: 1,
        category: 'awareness',
      },
      {
        title: 'Define and communicate a cyber reporting process',
        detail: 'Every staff member should know: (1) who to call if they suspect an attack, (2) that they should NOT try to deal with it themselves, and (3) that reporting early is always the right thing to do. Write this up in one page and share it.',
        effort: 'Low',
        week: 1,
        category: 'awareness',
      },
      {
        title: 'Create an acceptable use policy',
        detail: 'A one-page document covering: approved software, personal device rules, password expectations, and reporting obligations. This sets clear expectations and protects your organisation.',
        effort: 'Medium',
        week: 2,
        category: 'awareness',
      },
    ],
    moderate: [
      {
        title: 'Send a phishing awareness reminder to all staff',
        detail: 'A short email or team message reminding staff of the top 3 signs of a phishing attempt and what to do. Repeat this every quarter.',
        effort: 'Low',
        week: 1,
        category: 'awareness',
      },
      {
        title: 'Add cyber awareness to staff induction',
        detail: 'Ensure new staff receive basic cyber awareness training as part of their onboarding, including how to spot phishing and what to do in an incident.',
        effort: 'Low',
        week: 3,
        category: 'awareness',
      },
    ],
    strong: [
      {
        title: 'Consider a simulated phishing test',
        detail: 'Services like KnowBe4 or free tools from NCSC can send a harmless fake phishing email to staff to measure awareness. Use the results to target further training.',
        effort: 'Medium',
        week: 4,
        category: 'awareness',
      },
    ],
  },

  response: {
    weak: [
      {
        title: 'Create a basic incident response plan this week',
        detail: 'Your plan does not need to be long. It should cover: (1) how to detect an incident, (2) who to call immediately, (3) what systems to isolate, (4) how to communicate to staff and stakeholders. Use the First Hour Checklist in this pack as a starting point.',
        effort: 'Medium',
        week: 1,
        category: 'response',
      },
      {
        title: 'Build an emergency contact card',
        detail: 'Create a printed or laminated card with: IT support contact, cyber insurer contact (if applicable), senior leadership contact, and the name of the person responsible for cyber incidents. Store it somewhere accessible offline.',
        effort: 'Low',
        week: 1,
        category: 'response',
      },
      {
        title: 'Speak to your insurer about cyber coverage',
        detail: 'Contact your existing insurer and ask whether your policy covers cyber incidents including ransomware. If not, request a quote for cyber insurance. Many policies are now affordable for small organisations.',
        effort: 'Low',
        week: 2,
        category: 'response',
      },
    ],
    moderate: [
      {
        title: 'Run the tabletop exercise in this pack',
        detail: 'Use the tabletop scenario included in your preparedness pack to walk your team through a simulated ransomware incident. This takes about 60–90 minutes and requires no technical expertise.',
        effort: 'Low',
        week: 2,
        category: 'response',
      },
      {
        title: 'Review and update your incident response plan',
        detail: 'If your plan has not been reviewed in the last year, set time aside to review it. Confirm that all contact details are current and the plan reflects any organisational changes.',
        effort: 'Low',
        week: 3,
        category: 'response',
      },
    ],
    strong: [
      {
        title: 'Schedule an annual incident response review',
        detail: 'Set a recurring annual reminder to review and re-test your incident response plan, update contact details, and check that staff are still aware of their roles.',
        effort: 'Low',
        week: 4,
        category: 'response',
      },
    ],
  },

  patching: {
    weak: [
      {
        title: 'Enable automatic updates on all devices immediately',
        detail: 'Turn on automatic updates for Windows, macOS, and all key software. Ransomware frequently exploits known vulnerabilities in outdated software that has patches available. This is one of the highest-impact steps you can take.',
        effort: 'Low',
        week: 1,
        category: 'patching',
      },
      {
        title: 'Install antivirus on all staff devices',
        detail: 'Ensure every device used for work has up-to-date antivirus or endpoint protection. Windows Defender (built into Windows 10/11) is free and effective. For other platforms, consider Microsoft Defender for Business or a similar product.',
        effort: 'Medium',
        week: 1,
        category: 'patching',
      },
      {
        title: 'Create a policy for personal device use',
        detail: 'Decide and document whether staff may use personal devices to access work systems. If allowed, specify minimum requirements (e.g. must have antivirus, must use MFA, must not store work data locally).',
        effort: 'Low',
        week: 2,
        category: 'patching',
      },
    ],
    moderate: [
      {
        title: 'Audit devices for missing updates',
        detail: 'Ask all staff to confirm their devices are fully updated. For managed devices, use your IT management tool to check patch status across the fleet.',
        effort: 'Low',
        week: 1,
        category: 'patching',
      },
    ],
    strong: [
      {
        title: 'Review end-of-life software and hardware',
        detail: 'Identify any devices running Windows 10 (end of support October 2025), older macOS, or software that is no longer receiving security updates. Plan for replacement or upgrade.',
        effort: 'Medium',
        week: 3,
        category: 'patching',
      },
    ],
  },
}

export const TABLETOP_SCENARIOS = [
  {
    title: 'Monday Morning',
    sector: 'General',
    scenario: `It is 9:15am on a Monday. Your finance manager arrives at work and finds that their computer will not open any files. A message appears on screen demanding a ransom payment of €15,000 in cryptocurrency within 72 hours. Shortly afterwards, two other staff members report the same problem. Your shared network drive appears to be inaccessible.`,
    injects: [
      { time: 'T+15 min', event: 'A board member calls asking what is happening - they have seen an alert from your cloud storage system.' },
      { time: 'T+30 min', event: 'Your IT support provider says they cannot reach your server remotely. They ask if you want them to come on-site.' },
      { time: 'T+1 hr',   event: 'A local journalist contacts your communications lead asking if you have suffered a data breach.' },
      { time: 'T+2 hrs',  event: 'Staff are asking whether to pay the ransom. The attackers have sent a second message threatening to publish donor data.' },
      { time: 'T+4 hrs',  event: 'Your cyber insurer asks for an initial incident report. What information can you provide?' },
    ],
    discussionQuestions: [
      'Who is the first person you call - and do you have their number available right now, offline?',
      'Which systems do you isolate first, and how do you do that without IT expertise on site?',
      'What do you say to staff, and how do you prevent them from talking publicly about the incident?',
      'Do you know whether your data is backed up and whether those backups are unaffected?',
      'Who has authority to decide whether to pay a ransom - and what is your position on this?',
      'What is your legal obligation to report this incident, and to whom?',
    ],
  },
  {
    title: 'Out of Hours Attack',
    sector: 'General',
    scenario: `It is 11pm on a Friday. Your organisation\'s IT monitoring system sends an automated alert to the manager on call - unusual file activity has been detected on the server. By the time the manager checks the message at 7am Saturday, all files on your main server have been encrypted. The ransom note demands payment within 48 hours or the decryption key will be destroyed.`,
    injects: [
      { time: 'T+0',      event: 'You have 48 hours on the clock. Your IT provider does not work weekends. What is your first step?' },
      { time: 'T+2 hrs',  event: 'A staff member who was working from home overnight says they clicked a link in an email around 10pm that "seemed odd afterwards."' },
      { time: 'T+4 hrs',  event: 'Your cloud backup service sends a notification that backup files have also been modified.' },
      { time: 'T+6 hrs',  event: 'The deadline is now 42 hours away. A board member is asking you directly: "Should we just pay?"' },
      { time: 'T+8 hrs',  event: 'A national cybersecurity authority publishes a bulletin about a widespread ransomware campaign targeting nonprofits. Your attack matches the description.' },
    ],
    discussionQuestions: [
      'What is your out-of-hours escalation path - and is it documented somewhere offline?',
      'How do you handle the situation if the entry point was a mistake by a staff member?',
      'What is your position on ransom payment, and who has authority to make that call?',
      'If your cloud backups are also affected, what is your recovery path?',
      'At what point do you notify regulators, funders, or beneficiaries?',
    ],
  },
]
