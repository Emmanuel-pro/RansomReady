export type DecisionTag =
  | 'detection'
  | 'containment'
  | 'communication'
  | 'leadership'
  | 'legal'
  | 'technical'
  | 'recovery'

export interface DecisionOption {
  id: string
  label: string
  immediateConsequence: string
  businessImpact: string
  impact: number // -2..2, how much this choice helps or hurts overall readiness
  tag: DecisionTag
}

export interface DecisionPoint {
  id: string
  /** Opening narrative shown only for the first decision point. */
  opener?: string
  /** Opening narrative shown when the previous choice had impact >= 0. */
  openerFavourable?: string
  /** Opening narrative shown when the previous choice had impact < 0. */
  openerUnfavourable?: string
  whatIsHappening: string
  information: string
  uncertain: string
  question: string
  options: DecisionOption[]
}

export interface TabletopScenario {
  id: string
  title: string
  subtitle: string
  orgType: string
  icon: 'Building2' | 'Trophy' | 'ShoppingBasket'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  learningObjective: string
  decisions: DecisionPoint[]
  actions: string[]
}

export const TABLETOP_SCENARIOS: TabletopScenario[] = [
  {
    id: 'community-centre',
    title: 'The Centre Under Siege',
    subtitle:
      "A volunteer receptionist opens what looks like a routine invoice at St Aldhelm's Community Centre. By the time anyone notices something is wrong, the clock is already running.",
    orgType: "St Aldhelm's Community Centre",
    icon: 'Building2',
    difficulty: 'Beginner',
    duration: '20-25 min',
    learningObjective: 'Early detection and incident containment.',
    decisions: [
      {
        id: 'cc-1',
        opener:
          "It's Tuesday afternoon at St Aldhelm's Community Centre. Priya, a volunteer on reception, opens an email that looks like an invoice from your usual cleaning contractor and clicks the attachment to check the amount.",
        whatIsHappening:
          "Priya's screen flickered and a security pop-up appeared briefly before disappearing. She didn't think much of it and closed the laptop for her tea break.",
        information:
          "The email came from an address that closely resembles your cleaning contractor's, but wasn't their real domain. Priya doesn't recall the pop-up's exact wording.",
        uncertain:
          "You don't yet know whether anything was actually installed, or whether it's spreading beyond Priya's laptop.",
        question: 'What do you do first?',
        options: [
          {
            id: 'a',
            label: "Tell Priya to keep working - IT can look at it during their next scheduled visit next week.",
            immediateConsequence: "The laptop remains connected to the centre's shared drive all week.",
            businessImpact:
              "If malware was installed, it now has days to spread quietly across your network before anyone investigates - the classic ransomware playbook is to sit undetected for days before triggering encryption.",
            impact: -2,
            tag: 'containment',
          },
          {
            id: 'b',
            label: 'Ask Priya to disconnect the laptop from Wi-Fi immediately and stop using it, then call your IT support.',
            immediateConsequence: 'The laptop is isolated within minutes, and your IT contact can inspect it before anything spreads further.',
            businessImpact:
              'Early isolation is the single most effective step against ransomware - even without technical expertise on site, cutting network access buys you time and limits the damage.',
            impact: 2,
            tag: 'containment',
          },
          {
            id: 'c',
            label: 'Run a quick antivirus scan on the laptop yourself before deciding what to do.',
            immediateConsequence: 'The scan takes 20 minutes and comes back clean, but modern ransomware often evades this kind of scan in its early stages.',
            businessImpact:
              "You've lost time you could have used to isolate the device, and a clean scan gives false reassurance while the laptop stayed connected the whole time.",
            impact: 0,
            tag: 'technical',
          },
          {
            id: 'd',
            label: 'Ignore it - the pop-up probably closed because Windows blocked something.',
            immediateConsequence: 'No one investigates further and the laptop stays in normal use.',
            businessImpact:
              'Assuming the danger has passed without confirming it is a common and costly mistake - many ransomware infections show no obvious symptoms until encryption begins.',
            impact: -1,
            tag: 'detection',
          },
        ],
      },
      {
        id: 'cc-2',
        openerFavourable:
          "Thanks to catching it early, your IT contact confirms malicious code was present but hadn't yet spread. Two days later, though, they've found something concerning on the server logs.",
        openerUnfavourable:
          "Two days later, several staff report that shared files on the network drive won't open, and a ransom note has appeared on multiple screens demanding £8,000 in cryptocurrency within 72 hours.",
        whatIsHappening:
          "Your bookkeeper reports she can't access the accounts spreadsheet, and the office printer has started spitting out ransom notes.",
        information:
          'The ransom note demands payment in cryptocurrency within 72 hours and threatens to leak your membership database if you contact the police.',
        uncertain:
          "You don't know exactly which files are encrypted, whether your backups are affected, or whether personal data has actually been copied.",
        question: "Your bookkeeper wants to know who to call first. What's your priority?",
        options: [
          {
            id: 'a',
            label: 'Call the number in the ransom note to negotiate before the deadline.',
            immediateConsequence: 'You open a dialogue with criminals who now know you are willing to engage.',
            businessImpact:
              'Engaging attackers directly, without legal or insurance guidance, often leads to higher demands with no guarantee of a working decryption key - most official guidance strongly advises against this.',
            impact: -2,
            tag: 'leadership',
          },
          {
            id: 'b',
            label: 'Call your IT support provider and, if you have one, your cyber insurer, before anyone touches the affected computers.',
            immediateConsequence: 'Your IT provider begins isolating affected machines and your insurer can direct you to approved incident responders.',
            businessImpact:
              'Getting the right people involved early preserves evidence, avoids well-meaning mistakes, and may unlock support you are already paying for through insurance.',
            impact: 2,
            tag: 'leadership',
          },
          {
            id: 'c',
            label: 'Try to fix it yourself by deleting the ransom note files and restarting the computers.',
            immediateConsequence: 'Restarting some machines may trigger further encryption or destroy evidence needed for recovery.',
            businessImpact:
              'Well-intentioned DIY responses are one of the most common ways organisations make a ransomware incident worse - some strains are designed to escalate if tampered with.',
            impact: -2,
            tag: 'technical',
          },
          {
            id: 'd',
            label: 'Tell all staff to stop using computers and go home for the day without further explanation.',
            immediateConsequence: "You've bought some time, but with no plan communicated, rumours start circulating.",
            businessImpact:
              'Halting activity limits further spread, but silence creates anxiety and increases the risk that staff talk publicly before you have a message ready.',
            impact: 0,
            tag: 'communication',
          },
        ],
      },
      {
        id: 'cc-3',
        openerFavourable:
          'With your IT provider engaged, they confirm the attack was contained to a couple of machines and your cloud backup looks intact. Now the centre manager needs to decide what to tell staff and members.',
        openerUnfavourable:
          "With criminals now aware you're willing to talk, or with recovery complicated by earlier missteps, you're facing a wider outage. The centre manager needs to decide what to tell staff and members.",
        whatIsHappening:
          "It's the morning after the attack. Staff are arriving for a busy day of activities including a toddler group and a lunch club for elderly members, both of which rely on a booking system that's currently down.",
        information:
          "You know the booking system and shared drive are affected. You don't yet know if any personal data - member contact details, safeguarding notes - was accessed or copied.",
        uncertain: "Whether this counts as a reportable data breach, and how much to tell members before you're sure.",
        question: 'How do you communicate with staff and members today?',
        options: [
          {
            id: 'a',
            label: 'Say nothing publicly until you have complete certainty about what happened.',
            immediateConsequence: "Staff and members are left guessing why bookings aren't working.",
            businessImpact:
              'Delaying communication too long risks members hearing rumours first, and can look evasive if the incident becomes public later - transparency builds trust even when facts are incomplete.',
            impact: -1,
            tag: 'communication',
          },
          {
            id: 'b',
            label:
              "Tell staff briefly what's happened and ask them to run today's toddler group and lunch club using paper sign-in sheets, while giving members a simple, honest update that systems are temporarily down.",
            immediateConsequence: 'Services continue with minimal disruption and everyone has a consistent, calm message.',
            businessImpact:
              'Keeping essential community services running - even manually - protects your reputation and shows resilience, which matters enormously for organisations that depend on public trust.',
            impact: 2,
            tag: 'communication',
          },
          {
            id: 'c',
            label: 'Post a detailed public statement on social media immediately, including technical details about the ransomware strain.',
            immediateConsequence: 'The post spreads quickly, including to the attackers, who now know more about your response.',
            businessImpact:
              "Oversharing technical detail publicly can help attackers and invite unwanted attention before you've had legal or PR advice - a short, careful holding statement is usually safer.",
            impact: -1,
            tag: 'communication',
          },
          {
            id: 'd',
            label: 'Cancel all activities for the week until the situation is fully resolved.',
            immediateConsequence: 'Members relying on the lunch club - some of whom rely on it for a hot meal - are turned away.',
            businessImpact:
              'For community organisations, cancelling essential services has real welfare consequences and reputational cost; a manual workaround is usually preferable to a full shutdown.',
            impact: -1,
            tag: 'leadership',
          },
        ],
      },
      {
        id: 'cc-4',
        openerFavourable:
          'Two days in, your IT provider confirms your cloud backups were not affected and recovery is underway. Now you must decide how to handle a call from a concerned donor.',
        openerUnfavourable:
          'Recovery is slower than hoped because your most recent backup is three weeks old and some data may be permanently lost. A concerned donor has just called about the incident.',
        whatIsHappening:
          "A regular donor who gives £200 a month says a friend mentioned 'a hacking thing' at the centre and wants to know if their details are safe before renewing their standing order.",
        information:
          'You now know the attackers accessed a folder containing donor and member contact details, though you have no evidence yet that the data was copied or published.',
        uncertain: 'Whether the data protection regulator needs to be formally notified, and what your legal obligations are to donors and members.',
        question: 'How do you respond to the donor, and what else do you do?',
        options: [
          {
            id: 'a',
            label: "Reassure the donor that everything is fine and there's nothing to worry about.",
            immediateConsequence: 'The donor renews their donation, reassured.',
            businessImpact:
              'If it later emerges data was affected and you understated the risk, you risk far greater reputational and legal damage than an honest, measured answer would have caused.',
            impact: -2,
            tag: 'legal',
          },
          {
            id: 'b',
            label:
              "Tell the donor honestly that you had a cyber incident, that you're investigating whether any data was affected, and that you'll update them - then check with a data protection advisor about notification duties.",
            immediateConsequence: 'The donor appreciates the honesty and stays engaged; you begin the formal assessment process.',
            businessImpact:
              'Being upfront while you investigate, and taking legal obligations seriously, is the approach most likely to preserve trust and keep you compliant with data protection law.',
            impact: 2,
            tag: 'legal',
          },
          {
            id: 'c',
            label: "Avoid the donor's call and deal with it later once things have calmed down.",
            immediateConsequence: 'The donor is left without an answer and mentions their concern to other members.',
            businessImpact:
              'Avoiding direct questions from stakeholders during a crisis tends to erode trust faster than an imperfect but honest answer.',
            impact: -1,
            tag: 'communication',
          },
          {
            id: 'd',
            label: "Refer the donor to a generic customer service email address without addressing their specific concern.",
            immediateConsequence: 'The donor feels dismissed and unsure whether anyone is taking the issue seriously.',
            businessImpact:
              'A generic response to a specific, personal concern can feel evasive, especially from a small, trusted community organisation where personal relationships matter.',
            impact: -1,
            tag: 'communication',
          },
        ],
      },
      {
        id: 'cc-5',
        openerFavourable:
          "A week on, your systems are largely restored and you've been open with your community throughout. The trustees now want to make sure this never happens again.",
        openerUnfavourable:
          'A week on, recovery has been costly and stressful, and a couple of members have asked pointed questions about what the centre is doing differently. The trustees want to make sure this never happens again.',
        whatIsHappening: "At the next trustees' meeting, cyber security is on the agenda for the first time in the centre's history.",
        information:
          'You now have a clearer picture of what happened: a phishing email, a slow initial response in some areas, and gaps in backup testing and staff awareness.',
        uncertain: 'How much time and budget the centre can realistically commit, given it relies mostly on volunteers and a tight grant-funded budget.',
        question: 'What do you recommend the trustees prioritise first?',
        options: [
          {
            id: 'a',
            label: 'Nothing urgent - the centre has minimal budget and this was a one-off, unlucky event.',
            immediateConsequence: 'No changes are made and the meeting moves on to other business.',
            businessImpact:
              'Ransomware attacks on small community organisations are increasingly common, not rare - treating this as bad luck rather than a systemic gap leaves you exposed to a repeat incident.',
            impact: -2,
            tag: 'leadership',
          },
          {
            id: 'b',
            label:
              'A short, low-cost action plan: enable free multi-factor authentication, run a 30-minute phishing awareness session for volunteers, and test the backup restore process.',
            immediateConsequence: 'The trustees approve a simple plan that costs almost nothing and can be completed within a month.',
            businessImpact:
              'These are exactly the highest-impact, lowest-cost steps most small organisations can take - most damaging attacks exploit a small number of common, preventable gaps.',
            impact: 2,
            tag: 'leadership',
          },
          {
            id: 'c',
            label: 'Hire an expensive external cyber security consultancy to do a full audit before deciding on anything else.',
            immediateConsequence: 'The trustees agree in principle but the cost means the audit is delayed pending a funding application.',
            businessImpact:
              'A professional review has value, but delaying all action until a costly audit is funded means simple, immediate protections are left undone in the meantime.',
            impact: 0,
            tag: 'technical',
          },
          {
            id: 'd',
            label: "Ask staff and volunteers to be 'more careful' with emails, without any specific changes to systems or training.",
            immediateConsequence: 'Everyone nods in agreement but no concrete action is taken.',
            businessImpact:
              'Vague guidance without specific training or technical controls rarely changes behaviour and gives false reassurance that the risk has been addressed.',
            impact: -1,
            tag: 'communication',
          },
        ],
      },
    ],
    actions: [
      'Set up free multi-factor authentication on email and shared drive accounts.',
      'Write a one-page "if in doubt, disconnect and call" guide for staff and volunteers.',
      'Test restoring a sample of files from your backup within the next two weeks.',
      'Hold a 30-minute phishing awareness session using free national cyber authority materials.',
      'Agree in advance who has authority to talk to media, donors, and regulators during an incident.',
    ],
  },
  {
    id: 'youth-sports-club',
    title: 'Match Day Meltdown',
    subtitle:
      "A trusted supplier's email account gets hacked two days before Riverside Youth Football Club's biggest tournament of the season - and the club's booking system holds far more than fixtures.",
    orgType: 'Riverside Youth Football Club',
    icon: 'Trophy',
    difficulty: 'Intermediate',
    duration: '25-30 min',
    learningObjective: 'Crisis communication and maintaining essential services.',
    decisions: [
      {
        id: 'ys-1',
        opener:
          "It's Thursday evening, two days before Riverside Youth Football Club's biggest tournament of the season. The club treasurer, Dave, receives an email from the club's usual teamwear supplier - the same account they've ordered from for three years - with an invoice attached for 'urgent replacement kit'.",
        whatIsHappening:
          "Dave opens the attachment to check the amount before paying. Nothing obvious happens, but his laptop fans start running loudly and it's noticeably slower.",
        information:
          "The email address is genuinely the supplier's real account - it just wasn't the supplier who sent it. Their account was compromised earlier in the week.",
        uncertain:
          "Whether Dave's laptop has actually been infected, and whether it's connected to anything else - Dave also stores the under-12s squad list, including parents' contact details and some medical notes, on this laptop.",
        question: 'What should Dave do right now?',
        options: [
          {
            id: 'a',
            label: "Carry on working - the tournament is in two days and there's a lot to organise.",
            immediateConsequence: "Dave keeps working, later syncing files to the club's shared cloud folder used by other coaches.",
            businessImpact:
              'If the laptop is infected, ongoing use and syncing gives it a route to spread into shared club systems right before your highest-profile event of the season.',
            impact: -2,
            tag: 'containment',
          },
          {
            id: 'b',
            label: "Disconnect the laptop from the internet immediately and tell the club's IT-savvy volunteer before doing anything else.",
            immediateConsequence: 'The laptop is isolated and the volunteer can check it before any damage spreads.',
            businessImpact:
              'Fast isolation, even by a non-expert volunteer, is one of the most effective ways small clubs without dedicated IT staff can limit ransomware spread.',
            impact: 2,
            tag: 'containment',
          },
          {
            id: 'c',
            label: 'Delete the email and attachment and assume the problem is solved.',
            immediateConsequence: "The evidence is gone, but if code already ran, deleting the email doesn't remove it.",
            businessImpact:
              "Deleting the trigger doesn't undo any damage already done - assuming a threat is neutralised without checking is a common and risky mistake.",
            impact: -1,
            tag: 'detection',
          },
          {
            id: 'd',
            label: "Forward the invoice to other coaches to ask if they've seen anything similar.",
            immediateConsequence: 'Several coaches open the same attachment out of curiosity before anyone raises the alarm.',
            businessImpact:
              'Sharing a suspicious attachment further, rather than reporting it, can unintentionally spread an infection to more devices.',
            impact: -1,
            tag: 'communication',
          },
        ],
      },
      {
        id: 'ys-2',
        openerFavourable:
          "Thanks to quick isolation, the volunteer confirms Dave's laptop shows signs of ransomware but it hasn't reached the shared cloud folder yet. Then, on Friday morning, another coach reports their computer is also affected.",
        openerUnfavourable:
          "Overnight, several coaches' computers - all connected to the same shared cloud folder - display ransom notes demanding payment within 48 hours, right before Saturday's tournament.",
        whatIsHappening:
          "The club's registration system, which holds all players' details including safeguarding and medical information, appears to be inaccessible.",
        information: "The ransom note demands £3,000 and threatens to publish 'sensitive files' if you involve the police.",
        uncertain: 'Whether the safeguarding and medical data has actually been copied by the attackers, or just encrypted in place.',
        question: "The tournament is tomorrow. What's your priority?",
        options: [
          {
            id: 'a',
            label: "Focus entirely on the tournament - deal with the cyber issue next week once the event is over.",
            immediateConsequence: 'The tournament goes ahead using whatever information coaches can remember, but the security incident is left unmanaged for days.',
            businessImpact:
              "Delaying response while data may be actively at risk - including children's safeguarding information - increases both the technical damage and the club's legal and reputational exposure.",
            impact: -2,
            tag: 'leadership',
          },
          {
            id: 'b',
            label:
              'Quickly agree a manual backup plan for tomorrow - paper registration lists from parents, printed emergency contacts - while your volunteer starts isolating affected machines and finds a cyber-aware parent or local IT firm to help.',
            immediateConsequence: 'The tournament runs smoothly on paper records while containment work starts in parallel.',
            businessImpact:
              'Running essential activities on a manual fallback while addressing the incident in parallel is exactly the kind of resilience that limits disruption to the people you serve - here, children and families.',
            impact: 2,
            tag: 'communication',
          },
          {
            id: 'c',
            label: "Cancel the tournament outright and inform parents only that it's 'due to unforeseen circumstances'.",
            immediateConsequence: "Families are frustrated and confused, with many asking pointed questions the club can't yet answer.",
            businessImpact:
              "Cancelling a major event without an honest explanation can damage trust and morale, and often isn't necessary if a manual fallback is possible for one day.",
            impact: -1,
            tag: 'communication',
          },
          {
            id: 'd',
            label: "Ask the compromised supplier to pay the ransom for you since it was their account that was hacked.",
            immediateConsequence: "The supplier refuses, pointing out the club's own systems are what got encrypted.",
            businessImpact:
              "Trying to shift responsibility wastes valuable time during a fast-moving incident and does nothing to address the club's own exposure or recovery needs.",
            impact: -2,
            tag: 'leadership',
          },
        ],
      },
      {
        id: 'ys-3',
        openerFavourable:
          'The tournament goes ahead safely on paper records. Now, with the immediate pressure off, you need to decide how to communicate with the roughly 120 families in the club about what happened.',
        openerUnfavourable:
          "With the tournament handled badly and the incident still unresolved, parents are starting to ask questions on the club's group chat. You need to decide how to communicate.",
        whatIsHappening:
          "It's Sunday, the day after the tournament, and rumours are starting to circulate in the parents' group chat about 'the club being hacked'.",
        information: "You've confirmed some registration data, including safeguarding notes for a small number of children, was likely accessible to the attacker.",
        uncertain: 'The exact scope of what was accessed, and whether you need to notify parents individually versus the whole club.',
        question: 'How do you handle communication with parents?',
        options: [
          {
            id: 'a',
            label: 'Say nothing and hope the rumours die down on their own.',
            immediateConsequence: 'Rumours grow, with some parents assuming the worst and posting concerns publicly.',
            businessImpact:
              "Silence in the face of active rumours involving children's data is likely to cause far more reputational damage than a clear, honest statement.",
            impact: -2,
            tag: 'communication',
          },
          {
            id: 'b',
            label:
              "Send a clear, factual message to all parents explaining what happened, what data may have been affected and what you're doing about it - and separately notify the families whose children's safeguarding data was involved.",
            immediateConsequence: 'Parents feel informed and most respond calmly, though a few have follow-up questions which you can now answer directly.',
            businessImpact:
              "Clear, proportionate communication - including direct outreach to the most affected families - is the standard expected when children's sensitive data may be involved, and it protects the club's credibility.",
            impact: 2,
            tag: 'communication',
          },
          {
            id: 'c',
            label: "Post a vague reassurance on the club's public social media page without giving specifics.",
            immediateConsequence: 'Some parents feel reassured, but others feel the club is downplaying a serious issue involving their children.',
            businessImpact:
              "Vague public statements about incidents involving children's data can look evasive and may not meet the standard of transparency expected for sensitive information.",
            impact: -1,
            tag: 'communication',
          },
          {
            id: 'd',
            label: 'Have the volunteer IT parent handle all communication informally through the group chat.',
            immediateConsequence: "Information becomes inconsistent as it's relayed informally, and no one is sure who the 'official' club position is.",
            businessImpact:
              'Important incident communication needs a single, clear, accountable voice - informal relayed messages create confusion at exactly the wrong moment.',
            impact: -1,
            tag: 'leadership',
          },
        ],
      },
      {
        id: 'ys-4',
        openerFavourable:
          'Communication has gone well and most families are supportive. Now the club committee must decide what to do about the encrypted registration system.',
        openerUnfavourable:
          'Trust has been dented, and the committee is under pressure to show it is taking the encrypted registration system seriously.',
        whatIsHappening: "The registration system is still encrypted a week later. Your volunteer has found an old backup, but it's six months out of date.",
        information: "A six-month-old backup would be missing this season's new registrations, updated medical information, and emergency contacts.",
        uncertain: "Whether it's safer to rebuild from the old backup and ask parents to re-confirm details, or keep trying to negotiate access to the current system.",
        question: 'How do you handle recovery of the registration data?',
        options: [
          {
            id: 'a',
            label: 'Pay the ransom to try to get the current, up-to-date data back quickly.',
            immediateConsequence: "You arrange payment, but there's no guarantee of receiving a working decryption tool, and you've now funded further attacks.",
            businessImpact:
              "Paying a ransom doesn't guarantee recovery and is generally advised against - many organisations that pay still don't get fully working data back.",
            impact: -1,
            tag: 'recovery',
          },
          {
            id: 'b',
            label: 'Restore from the six-month-old backup and send a simple form to all parents asking them to reconfirm and update medical and emergency contact details.',
            immediateConsequence: 'It takes a couple of weeks of admin, but you rebuild an accurate, current registration system without engaging with criminals.',
            businessImpact:
              'Rebuilding from a clean backup, even an imperfect one, is safer and more sustainable than negotiating with attackers, and re-confirming details with parents also improves your data going forward.',
            impact: 2,
            tag: 'recovery',
          },
          {
            id: 'c',
            label: "Keep the old encrypted system running in the background 'just in case it becomes accessible again'.",
            immediateConsequence: 'The compromised system stays connected to the network for weeks with no clear purpose.',
            businessImpact:
              'Leaving a known-compromised system live increases the risk of re-infection or further data exposure, and delays committing to a clean recovery path.',
            impact: -1,
            tag: 'technical',
          },
          {
            id: 'd',
            label: 'Ask each coach to keep their own informal spreadsheet of player details going forward instead of a shared system.',
            immediateConsequence: 'The club avoids fixing the underlying system by scattering data across multiple personal spreadsheets.',
            businessImpact:
              "This creates more, less secure copies of sensitive children's data across personal devices, actually increasing risk rather than reducing it.",
            impact: -1,
            tag: 'technical',
          },
        ],
      },
      {
        id: 'ys-5',
        openerFavourable:
          "Six weeks on, the club has a clean, current registration system and parents have largely moved on. The committee wants to make sure the club is better prepared for next time.",
        openerUnfavourable:
          'Recovery has been slow and costly, and the committee is under pressure from parents to show real change before next season.',
        whatIsHappening: "At the club's AGM, a parent who works in IT asks what the committee is doing differently to protect players' data going forward.",
        information:
          'You now know the incident started with a compromised supplier account, spread through a shared cloud folder, and exposed gaps in backup freshness and incident communication.',
        uncertain: "How to balance this with the club's entirely volunteer-run structure and near-zero IT budget.",
        question: 'What do you commit to at the AGM?',
        options: [
          {
            id: 'a',
            label: "Nothing formal - promise to 'keep an eye on things' going forward.",
            immediateConsequence: 'The parent asking the question looks unconvinced, and no specific commitments are recorded.',
            businessImpact:
              'Vague reassurance without concrete commitments leaves the same gaps in place for next season, when the same risk profile - volunteers, shared devices, sensitive data - remains unchanged.',
            impact: -2,
            tag: 'leadership',
          },
          {
            id: 'b',
            label:
              'Commit to three concrete steps: monthly automated backups of the registration system, multi-factor authentication on the shared cloud account, and a one-page "suspicious email" guide for all coaches.',
            immediateConsequence: "The AGM formally minutes these three commitments, and a volunteer is assigned to check progress.",
            businessImpact:
              'Concrete, low-cost, high-impact commitments - especially around backups and MFA - directly address the gaps this incident exposed and are realistic for a volunteer-run club.',
            impact: 2,
            tag: 'leadership',
          },
          {
            id: 'c',
            label: 'Decide the club is too small a target to worry about and this was unlikely to happen again.',
            immediateConsequence: 'No changes are made to systems or training.',
            businessImpact:
              "Small community and sports clubs are increasingly targeted precisely because they're seen as easy, under-protected targets - treating this as a one-off ignores the pattern.",
            impact: -2,
            tag: 'leadership',
          },
          {
            id: 'd',
            label: "Ask the compromised supplier to cover the club's costs, and make no other changes until that's resolved.",
            immediateConsequence: 'The supplier dispute drags on for months with no resolution, and no internal improvements are made in the meantime.',
            businessImpact:
              "Pursuing external accountability is reasonable, but shouldn't be used as a reason to delay the club's own, entirely achievable, security improvements.",
            impact: -1,
            tag: 'leadership',
          },
        ],
      },
    ],
    actions: [
      'Enable multi-factor authentication on all shared club accounts (registration system, cloud storage, email).',
      'Set up automated monthly backups of the player registration and safeguarding data, stored separately from the main system.',
      'Create a one-page guide on spotting suspicious emails, even from familiar and trusted senders, for all coaches and committee members.',
      'Agree in advance who is responsible for parent communication during an incident, and prepare a simple holding message template.',
      'Review what sensitive data is stored where, and minimise copies kept on personal devices.',
    ],
  },
  {
    id: 'food-bank',
    title: 'The Pantry Breach',
    subtitle:
      "A year-old remote access shortcut becomes the way in at Hopewell Food Bank - and the data at risk belongs to 340 of the most vulnerable families in the community.",
    orgType: 'Hopewell Food Bank',
    icon: 'ShoppingBasket',
    difficulty: 'Advanced',
    duration: '25-30 min',
    learningObjective: 'Recovery, backups, and responding to a potential data breach.',
    decisions: [
      {
        id: 'fb-1',
        opener:
          "Hopewell Food Bank relies on a small central database to track weekly food parcels for 340 local families, including notes on dietary needs and safeguarding concerns. On Monday morning, the volunteer coordinator, Grace, can't log in - her password 'isn't recognised' even though she's sure she typed it correctly.",
        whatIsHappening:
          'IT support - a retired volunteer who helps out part-time - mentions that remote access has been enabled for over a year, originally set up during the pandemic so staff could work from home, using the same password Grace has had since it was set up.',
        information: "There's no multi-factor authentication on the remote access system, and the password hasn't been changed in over a year.",
        uncertain: 'Whether someone has actually gained access, or whether this is a routine technical glitch.',
        question: "What's your first move?",
        options: [
          {
            id: 'a',
            label: "Reset Grace's password to something similar and move on - it's probably just a glitch.",
            immediateConsequence: 'Grace gets back into a system that may still be compromised via the same exposed remote access route.',
            businessImpact:
              'Treating an unexplained lockout as routine, especially on a system with known weak security, risks missing an active intrusion.',
            impact: -2,
            tag: 'detection',
          },
          {
            id: 'b',
            label: 'Immediately disable remote access to the system entirely and check activity logs before doing anything else.',
            immediateConsequence: 'Remote access is shut off, and logs show several login attempts from an unfamiliar location overnight.',
            businessImpact:
              "Cutting off the exposed access point immediately, before investigating, is the safest first move when you can't yet tell if this is a glitch or an intrusion - it costs little and prevents further access either way.",
            impact: 2,
            tag: 'containment',
          },
          {
            id: 'c',
            label: 'Ask Grace to keep trying different passwords until one works.',
            immediateConsequence: 'Several failed attempts are made while the underlying access point remains open.',
            businessImpact:
              'This wastes time investigating the wrong problem while leaving a potentially compromised remote access route open to anyone who has the current credentials.',
            impact: -1,
            tag: 'detection',
          },
          {
            id: 'd',
            label: 'Wait until your part-time IT volunteer is next in on Thursday to look into it.',
            immediateConsequence: 'The system, and its exposed remote access, remains unchanged for three more days.',
            businessImpact:
              'A multi-day delay on a system holding sensitive data about vulnerable families, with no MFA and an unclear cause, gives a potential attacker significant extra time inside your systems.',
            impact: -2,
            tag: 'containment',
          },
        ],
      },
      {
        id: 'fb-2',
        openerFavourable:
          'Cutting off remote access was the right call - the logs confirm unfamiliar login attempts overnight, and by acting fast you have likely limited further access. Even so, by Thursday the beneficiary database is found encrypted, with a ransom note demanding £5,000.',
        openerUnfavourable:
          'By Thursday, without action taken, the beneficiary database is fully encrypted, with a ransom note demanding £5,000, and there are signs the attacker had several days of access.',
        whatIsHappening:
          'The database held names, addresses, contact details, and sensitive notes on dietary and safeguarding needs for 340 families, some of whom are among the most vulnerable in your community.',
        information: "The ransom note claims data has been copied and threatens to publish it if you don't pay within 5 days.",
        uncertain: 'Whether the claim about copied data is genuine, or a bluff to pressure you into paying - and whether your last backup is usable.',
        question: "What's your immediate priority?",
        options: [
          {
            id: 'a',
            label: 'Pay the ransom quickly to prevent sensitive data about vulnerable families from being published.',
            immediateConsequence: 'You arrange payment, but there is no verified way to confirm the attacker will delete stolen data or provide a working key, even after payment.',
            businessImpact:
              'Paying does not reliably prevent publication or guarantee recovery, and organisations that pay are sometimes targeted again - independent advice is to seek expert guidance before ever considering payment.',
            impact: -1,
            tag: 'recovery',
          },
          {
            id: 'b',
            label: 'Contact your national cybersecurity authority and a data protection advisor before making any decisions about payment or public statements.',
            immediateConsequence: 'You get expert guidance on next steps, including how to assess whether the breach claim is credible and what your legal reporting obligations are.',
            businessImpact:
              "Involving the right authorities and advisors early - even for a small charity - gives you access to expertise you wouldn't otherwise have, and helps you make defensible decisions under pressure.",
            impact: 2,
            tag: 'legal',
          },
          {
            id: 'c',
            label: 'Keep the incident entirely internal and quiet while your part-time IT volunteer tries to fix it alone.',
            immediateConsequence: 'Recovery is slower without expert input, and any legal reporting deadlines start running without your knowledge.',
            businessImpact:
              'Data protection regulations often require notification within a strict timeframe once a breach is confirmed - handling this without expert advice risks missing legal obligations, on top of a slower technical recovery.',
            impact: -1,
            tag: 'legal',
          },
          {
            id: 'd',
            label: 'Focus only on restoring service and worry about the data breach question later.',
            immediateConsequence: 'Food parcel distribution resumes using paper records, but no one assesses the data breach risk to the 340 families.',
            businessImpact:
              "Restoring service matters, but for an organisation holding highly sensitive data on vulnerable people, delaying the breach assessment risks families being harmed by exposed data before you've even identified the risk.",
            impact: -1,
            tag: 'legal',
          },
        ],
      },
      {
        id: 'fb-3',
        openerFavourable:
          'With expert guidance, you learn your last cloud backup, taken four days before the attack, appears untouched. You now need to decide how to keep supporting families while systems are restored.',
        openerUnfavourable:
          'Investigation is slower and more stressful without expert input, but you eventually find a four-day-old backup that appears untouched. You still need to keep supporting families while systems are restored.',
        whatIsHappening: "It's Friday, the day of your weekly food parcel distribution, and 60 families are expected in the next few hours.",
        information:
          "You have paper records of most regular clients' basic needs from before the database was digitised eighteen months ago, but not the most recent dietary and safeguarding updates.",
        uncertain: 'Whether relying on older paper records could miss a recent, important dietary or safeguarding note for some families.',
        question: "How do you run today's distribution?",
        options: [
          {
            id: 'a',
            label: "Cancel today's distribution until the database is fully restored.",
            immediateConsequence: 'Sixty families who may depend on this week\'s food parcel are turned away.',
            businessImpact:
              'For a food bank, cancelling distribution has direct, serious welfare consequences for vulnerable families - alternatives that maintain the service, even imperfectly, are almost always preferable.',
            impact: -2,
            tag: 'leadership',
          },
          {
            id: 'b',
            label: 'Run distribution using the older paper records, and ask each family a couple of quick verbal questions about any recent dietary or safety changes before handing over parcels.',
            immediateConsequence: 'Distribution goes ahead with a short delay per family, and volunteers note down anything new on paper for later.',
            businessImpact:
              'This keeps your essential service running for vulnerable families while managing the specific risk of outdated information - a practical, resilient compromise well-prepared organisations use as a fallback.',
            impact: 2,
            tag: 'recovery',
          },
          {
            id: 'c',
            label: "Guess at any missing recent information based on volunteers' memory of regular clients.",
            immediateConsequence: 'Distribution goes ahead quickly, but a couple of recent dietary changes are missed for two families.',
            businessImpact:
              'Relying on memory for sensitive dietary or safeguarding information risks real harm to individuals, even if it feels faster in the moment.',
            impact: -1,
            tag: 'recovery',
          },
          {
            id: 'd',
            label: 'Ask families to fill in a brand new, lengthy registration form from scratch before receiving anything today.',
            immediateConsequence: 'The process takes far longer than usual, and some families leave the queue frustrated before being served.',
            businessImpact:
              'An overly bureaucratic response to a crisis can create a new barrier to accessing an essential service, which is particularly harmful for people already facing hardship.',
            impact: -1,
            tag: 'communication',
          },
        ],
      },
      {
        id: 'fb-4',
        openerFavourable: "Distribution goes smoothly, and your backup is confirmed usable. Now you must decide how to respond to the ransom note's threat to publish data.",
        openerUnfavourable: "Distribution was difficult today, and there's added pressure now to resolve the ransom note's threat to publish data.",
        whatIsHappening: "Five days have passed since the ransom note, and there's no sign yet that any data has actually been published anywhere you can find.",
        information: 'Your data protection advisor confirms this looks like a reportable breach given the sensitivity of the data, regardless of whether the publish threat is genuine.',
        uncertain: 'How to notify affected families without causing unnecessary panic, especially those with safeguarding notes on file.',
        question: 'How do you handle notifying the families and any regulatory requirements?',
        options: [
          {
            id: 'a',
            label: "Don't notify families individually - a general note on the food bank's noticeboard is enough.",
            immediateConsequence: 'Most families never see the noticeboard and remain unaware their data may have been exposed.',
            businessImpact:
              'For a breach involving sensitive personal and safeguarding data, a passive noticeboard notice is unlikely to meet your legal notification obligations or genuinely inform the people affected.',
            impact: -1,
            tag: 'legal',
          },
          {
            id: 'b',
            label:
              "Follow your advisor's guidance to formally notify the data protection regulator within the required timeframe, and send a clear, compassionate personal message to affected families explaining what happened and what support is available.",
            immediateConsequence: 'You meet your legal obligations and most families respond with understanding, especially appreciating the direct and honest approach.',
            businessImpact:
              'Meeting your regulatory obligations and communicating directly and sensitively - especially with vulnerable families - is both a legal requirement in serious cases and the right thing to do to preserve trust.',
            impact: 2,
            tag: 'legal',
          },
          {
            id: 'c',
            label: 'Notify the regulator but decide not to tell families directly, to avoid causing them distress.',
            immediateConsequence: 'You meet one legal obligation but leave affected families unaware and unable to protect themselves from potential follow-on scams.',
            businessImpact:
              'Withholding direct notification from affected individuals, particularly vulnerable ones, can leave them exposed to scams exploiting the breach, and may not satisfy full legal notification requirements.',
            impact: -1,
            tag: 'legal',
          },
          {
            id: 'd',
            label: 'Wait to see if the data actually gets published before deciding whether notification is necessary.',
            immediateConsequence: 'Valuable time passes without any notification, while regulatory deadlines continue to run.',
            businessImpact:
              'Most data protection frameworks require notification based on the risk of harm from unauthorised access, not proof of publication - waiting for confirmation risks missing your legal deadline entirely.',
            impact: -1,
            tag: 'legal',
          },
        ],
      },
      {
        id: 'fb-5',
        openerFavourable:
          'Notification has gone smoothly and families have largely responded with understanding and gratitude for the honesty. The trustees now want to prevent this ever happening again.',
        openerUnfavourable:
          'The notification process has been difficult, with a few families upset at how things were handled. The trustees are under real pressure to prevent this ever happening again.',
        whatIsHappening: "At an emergency trustees' meeting, the chair asks for a concrete plan given how sensitive the data Hopewell Food Bank holds is.",
        information:
          'You now know the incident started with old, exposed remote access with no multi-factor authentication and a password unchanged for over a year, and that backup and legal-notification processes need work.',
        uncertain: 'How to fund and sustain improvements with an all-volunteer team and a budget stretched by rising demand for food parcels.',
        question: "What does the trustees' plan prioritise?",
        options: [
          {
            id: 'a',
            label: 'Nothing specific - trust that this was a one-off unlucky event unlikely to recur.',
            immediateConsequence: 'No changes are made to remote access, backups, or notification processes.',
            businessImpact:
              "Organisations holding highly sensitive data on vulnerable people are attractive targets precisely because they're often under-resourced - without change, the same exposed access point remains a risk.",
            impact: -2,
            tag: 'leadership',
          },
          {
            id: 'b',
            label:
              'A focused plan: remove or properly secure remote access with multi-factor authentication, set a password change policy, schedule monthly backup tests, and agree a simple data breach response checklist in advance.',
            immediateConsequence: 'The trustees approve a realistic, low-cost plan and assign a volunteer to track progress each quarter.',
            businessImpact:
              'This plan directly closes the specific gaps that caused the incident, and having a pre-agreed breach response checklist means less scrambling and fewer costly mistakes if it ever happens again.',
            impact: 2,
            tag: 'technical',
          },
          {
            id: 'c',
            label: "Spend the majority of the year's IT budget on a single expensive piece of security software, without addressing the exposed remote access directly.",
            immediateConsequence: 'The trustees approve significant spend, but the specific weaknesses that caused this incident remain unaddressed.',
            businessImpact:
              'Spending on security tools without fixing the specific, known gap that caused the incident is a poor use of limited charity funds and leaves the same vulnerability open.',
            impact: -1,
            tag: 'technical',
          },
          {
            id: 'd',
            label: 'Ask volunteers to individually decide how to keep their own access secure, without a formal organisational policy.',
            immediateConsequence: 'Practices vary significantly between volunteers, with no consistent minimum standard.',
            businessImpact:
              'Without a clear, organisation-wide policy, sensitive data protection depends on inconsistent individual habits rather than reliable controls - especially risky in a volunteer-heavy organisation with regular turnover.',
            impact: -1,
            tag: 'leadership',
          },
        ],
      },
    ],
    actions: [
      'Remove or properly secure remote access with multi-factor authentication and a strong, regularly changed password.',
      "Schedule a backup restore test every quarter, and confirm backups are stored somewhere ransomware couldn't reach.",
      'Write a simple data breach response checklist in advance, including who to notify and within what timeframe.',
      'Identify a free or low-cost data protection advice service to contact before an incident happens.',
      'Review who has remote access to sensitive systems and remove access no longer needed, especially from arrangements set up some time ago.',
    ],
  },
]
