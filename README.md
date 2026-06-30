# RansomReady

A client-side ransomware preparedness tool for Local Community Organisations (LCOs). Built for the Virtual Routes Ransomware Defence Summer Bootcamp, Amsterdam Business School, June 2026.

---

## What it does

RansomReady guides a non-technical user through a 15-question readiness assessment and generates a personalised preparedness pack. The entire tool runs in the browser with no backend, no API calls, and no data transmitted or stored.

**The pack includes:**

- Readiness score with breakdown across 5 key risk areas
- Personalised 30-day action plan, prioritised by week
- First-hour incident response checklist
- Board briefing summary (print-ready)
- Staff awareness guide (print-ready)
- Tabletop exercise scenario with facilitator injects and discussion questions

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 4 |
| Styling | Tailwind CSS 3 |
| Icons | Heroicons (inline SVG) |
| Runtime | Browser only, no backend |

---

## Prerequisites

- Node.js v18 or higher
- npm v8 or higher

Check your versions:

```bash
node -v
npm -v
```

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/Emmanuel-pro/RansomReady.git
cd RansomReady
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with hot reload |
| `npm run build` | Type-check and build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Project structure

```
RansomReady/
├── src/
│   ├── components/
│   │   └── CategoryIcon.tsx      # SVG icons for each risk category
│   ├── data/
│   │   ├── questions.ts          # 15 assessment questions and scoring weights
│   │   └── recommendations.ts   # Rule-based action plans and tabletop scenarios
│   ├── engine/
│   │   └── score.ts              # Scoring logic and risk band calculation
│   ├── pages/
│   │   ├── Landing.tsx           # Start screen and organisation details form
│   │   ├── Assessment.tsx        # Paginated question flow
│   │   └── Results.tsx           # Full preparedness pack output
│   ├── App.tsx                   # App state and screen routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind imports and print styles
├── index.html
├── vite.config.ts
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

---

## How the scoring works

Each question is assigned a score from 0 to 3. Answers are grouped into five categories:

- Backup and Recovery
- Access Control
- Staff Awareness
- Incident Response
- Updates and Patching

Each category receives an independent percentage score. The overall score is the total points earned as a percentage of the maximum possible. Score bands (Critical, High, Moderate, Good, Strong) determine which action plan recommendations are shown.

All logic is rule-based. There is no AI or LLM involved in generating the output.

---

## Print and export

The results page is split into six tabbed sections. Each tab can be read independently or printed on its own.

- **Print this section** - prints only the currently visible tab
- **Print full pack** - prints all six sections in sequence

Both options use the browser's built-in print dialog, which supports saving to PDF.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your descriptive message"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a pull request against `main`

Please keep pull requests focused on a single change. For larger changes, open an issue first to discuss the approach.

---

## Built with AI-assisted coding

RansomReady was designed and built using **Claude Code** (Anthropic) during a 2-day sprint at the Virtual Routes Ransomware Defence Summer Bootcamp, Amsterdam Business School, June 2026.

### What the AI did

- Generated the initial project structure (React, TypeScript, Vite, Tailwind CSS)
- Scaffolded all UI components and pages from natural language specifications
- Wrote the 15 assessment questions and answer scoring logic
- Generated the rule-based recommendation templates for each risk category
- Produced the tabletop exercise scenarios and facilitator inject events
- Iterated on layout, visual design, and print styles based on feedback

### What the team did

- Defined the product direction, scope, and constraints
- Reviewed and validated all cybersecurity guidance for accuracy and appropriateness
- Tested the tool against real user flows and refined based on feedback
- Made all design and content decisions - the AI was the builder, not the decision-maker

### Important notes

- The tool runs entirely in the browser - no data is transmitted or stored at any point
- All scoring is rule-based - no LLM is involved in generating the output at runtime
- The recommendations are general guidance and do not constitute a professional security audit
- No external APIs are called during use

---

## Licence

MIT License. See `LICENSE` for details.

---

## Disclaimer

RansomReady is an awareness and education tool. It does not constitute a professional cybersecurity audit or legal advice. Organisations with high-risk profiles should engage a qualified cybersecurity provider for a formal assessment.
