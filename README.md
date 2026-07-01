# RansomReady

A client-side ransomware preparedness tool for Local Community Organisations (LCOs). Built for the Virtual Routes Ransomware Defence Summer Bootcamp, Amsterdam Business School, June 2026.

## What it does

RansomReady helps non-technical staff understand and improve their organisation's ransomware readiness. It combines a structured self-assessment with interactive practice tools, all running in the browser with no data stored or transmitted.

**Readiness assessment**

A 15-question assessment across five risk areas generates a personalised preparedness pack:

- Readiness score with breakdown across 5 categories
- Personalised 30-day action plan, prioritised by week
- First-hour incident response checklist
- Board briefing summary (print-ready)
- Staff awareness guide (print-ready)
- Tabletop exercise scenario with facilitator injects and discussion questions

The board-level cyber summary can optionally be generated through a backend API so the Google AI API key is never exposed to the client.

**Practice tools (Practise menu)**

- Tabletop Exercises - self-guided interactive incident response scenarios
- Interactive Game - bite-sized levels that build ransomware instincts. Level 1 (Phishing Alley) is a live 8-round email classifier where users identify phishing vs legitimate emails, with red-flag explanations after each round and a scored result.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (CSS-first config in `index.css`) |
| Components | shadcn/ui + @base-ui/react |
| Icons | lucide-react |
| Runtime | Browser-only app with optional serverless summary API |

## Prerequisites

- Node.js v20 or higher (required by Vite 8)
- npm v8 or higher

Check your versions:

```bash
node -v
npm -v
```

To upgrade Node, install nvm then run:

```bash
nvm install 20
nvm use 20
```

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

Open your browser at `http://127.0.0.1:5173`. This starts Vite and serves `POST /api/cyber-summary` from the same local server.

To run the React app without the local API:

```bash
npm run dev:vite
```

### Optional: dynamic cyber summary API

The results page calls `POST /api/cyber-summary` to generate a tailored cyber risk summary using the organisation name, sector, size, readiness score, and category scores.

Set these environment variables in `.env.local` for local development, and on your deployment platform for production:

```bash
GOOGLE_AI_API_KEY=your_google_ai_studio_key
GOOGLE_AI_MODEL=gemini-2.5-flash-lite
```

`GOOGLE_AI_MODEL` is optional and defaults to `gemini-2.5-flash-lite`. If the API is unavailable or not configured, the app falls back to the rule-based static summary without any error shown to the user.

For a non-Vercel backend, also set:

```bash
VITE_CYBER_SUMMARY_API_URL=https://your-domain.example/api/cyber-summary
```

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with the cyber summary API enabled |
| `npm run dev:vite` | Start Vite only, without the local summary API |
| `npm run build` | Type-check and build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

## Project structure

```
RansomReady/
+-- src/
|   +-- components/
|   |   +-- Header.tsx              # Persistent nav: Dashboard, Learn, Practise, user menu
|   |   +-- CategoryIcon.tsx        # SVG icons for each risk category
|   |   +-- ui/                     # shadcn/ui primitives (button, card, progress, etc.)
|   +-- data/
|   |   +-- questions.ts            # 15 assessment questions and scoring weights
|   |   +-- recommendations.ts      # Rule-based action plans and band config
|   |   +-- tabletopScenarios.ts    # Tabletop exercise scenarios and inject events
|   +-- engine/
|   |   +-- score.ts                # Scoring logic and risk band calculation
|   +-- lib/
|   |   +-- userPerformance.ts      # User performance tracking utilities
|   |   +-- utils.ts                # Shared utility functions (cn, etc.)
|   +-- pages/
|   |   +-- Dashboard.tsx           # Home screen: My Learning + Test Your Readiness
|   |   +-- Learn.tsx               # Learning modules (in development)
|   |   +-- Tabletop.tsx            # Self-guided interactive tabletop exercises
|   |   +-- InteractiveGame.tsx     # Game level selector
|   |   +-- games/
|   |   |   +-- PhishingAlleyGame.tsx  # 8-round phishing email classifier
|   |   +-- Landing.tsx             # Organisation details form before assessment
|   |   +-- Assessment.tsx          # Paginated 15-question flow
|   |   +-- Results.tsx             # Full preparedness pack output (6 tabbed sections)
|   +-- services/
|   |   +-- cyberSummary.ts         # API client for the optional AI summary endpoint
|   +-- App.tsx                     # App state and screen routing
|   +-- main.tsx                    # Entry point
|   +-- index.css                   # Tailwind 4 theme tokens and print styles
+-- index.html
+-- vite.config.ts
+-- tsconfig.json
+-- package.json
```

## How the scoring works

Each of the 15 questions is scored 0 to 3. Answers are grouped into five categories:

- Backup and Recovery
- Access Control
- Staff Awareness
- Incident Response
- Updates and Patching

Each category receives an independent percentage score. The overall score is total points earned as a percentage of the maximum possible (45 pts). Score bands (Critical, High, Moderate, Good, Strong) determine which action plan recommendations are included in the output pack.

Scoring and all recommendations are fully rule-based and run in the browser. Only the board-level cyber summary uses an LLM, and only when the optional API is configured.

## Print and export

The results page is split into six tabbed sections. Each tab can be read independently or printed on its own.

- **Print this section** - prints only the currently visible tab
- **Print full pack** - prints all six sections in sequence

Both options use the browser print dialog, which supports saving to PDF.

## App navigation

The app uses client-side routing with a persistent header. Screens:

| Screen | Route trigger | Description |
|---|---|---|
| Dashboard | Logo or Dashboard nav | Home: learning paths + readiness assessment entry |
| Learn | Learn nav | Learning modules (in development) |
| Tabletop | Practise > Exercises | Self-guided tabletop incident scenarios |
| Interactive Game | Practise > Game | Level selector for practice games |
| Phishing Alley | Level 1 Play button | 8-round email classifier game |
| Assessment | Test Your Readiness button | 15-question readiness flow |
| Results | On assessment completion | Full preparedness pack |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your descriptive message"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a pull request against `main`

Keep pull requests focused on a single change. For larger changes, open an issue first to discuss the approach.

## Built with AI-assisted coding

RansomReady was designed and built using **Claude Code** (Anthropic) during a sprint at the Virtual Routes Ransomware Defence Summer Bootcamp, Amsterdam Business School, June 2026.

**What the AI did**

- Generated the initial project structure and all UI components from natural language specifications
- Wrote the 15 assessment questions, scoring logic, and rule-based recommendation templates
- Produced the tabletop exercise scenarios and facilitator inject events
- Built the Phishing Alley game including all 8 email scenarios and educational feedback
- Iterated on layout, visual design, and print styles based on feedback
- Handled git merge conflict resolution across team branches

**What the team did**

- Defined the product direction, scope, and constraints
- Reviewed and validated all cybersecurity guidance for accuracy
- Tested the tool against real user flows and refined based on feedback
- Made all design and content decisions - the AI was the builder, not the decision-maker

**Important notes**

- All assessment scoring runs in the browser - no data is stored or transmitted by default
- Organisation details and scores may be sent to the configured summary API if enabled
- The recommendations are general guidance and do not constitute a professional security audit
- If configured, the summary API calls Google AI from the backend server, never directly from the browser

## Licence

MIT License. See `LICENSE` for details.

## Disclaimer

RansomReady is an awareness and education tool. It does not constitute a professional cybersecurity audit or legal advice. Organisations with high-risk profiles should engage a qualified cybersecurity provider for a formal assessment.
