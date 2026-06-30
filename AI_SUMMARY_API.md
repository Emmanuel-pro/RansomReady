# AI Summary API Integration

## Overview

RansomReady now supports an optional AI-generated cyber risk summary on the results page. The assessment and scoring logic still run locally in the browser, while the summary text is generated through a backend-style API endpoint so the Google AI API key is never exposed to client-side React code.

If the AI request fails, the app falls back to the existing static risk-band summary and remains fully usable.

## What Was Added

- A local/serverless API endpoint at `api/cyber-summary.ts`.
- A frontend API client at `src/services/cyberSummary.ts`.
- Runtime integration in `src/pages/Results.tsx`.
- A local development server at `scripts/dev-with-api.mjs` that serves both the Vite app and `/api/cyber-summary`.
- Environment configuration examples in `.env.example`.
- Updated npm scripts in `package.json`.

## Runtime Flow

1. The user enters organisation details on the landing page.
2. The user completes the ransomware readiness assessment.
3. The results page calculates the score and risk band locally.
4. `Results.tsx` calls `fetchCyberSummary()`.
5. `fetchCyberSummary()` sends organisation details and score data to `POST /api/cyber-summary`.
6. The API endpoint calls Google AI using `GOOGLE_AI_API_KEY`.
7. The generated summary is displayed in the readiness score and board briefing sections.
8. If Google AI returns an error or is temporarily unavailable, the static summary is shown and the user can retry.

## Environment Variables

Create `.env.local` for local development:

```bash
GOOGLE_AI_API_KEY=your_google_ai_studio_key
GOOGLE_AI_MODEL=gemini-2.5-flash-lite
```

`.env.local` is intentionally ignored by Git. Do not commit real API keys.

## Local Development

Use:

```bash
npm run dev
```

This starts the custom local server on `http://127.0.0.1:5173` by default. The same server provides both the React app and the AI summary API.

If port `5173` is already in use, the server automatically tries the next available port and prints the correct URL.

For Vite-only development without the summary API, use:

```bash
npm run dev:vite
```

## Error Handling

The frontend retries temporary Google AI failures such as `429` and `503`. If the request still fails, the UI displays the static summary and a `Retry AI summary` action.

This keeps the user flow resilient even when the external model is busy or quota-limited.

## Security Notes

- The Google AI API key is read only by the backend/local server.
- No `VITE_*` API key is used, because Vite exposes those variables to the browser bundle.
- The browser sends only the organisation details and assessment result needed to generate the summary.
- The scoring and action-plan logic remain rule-based.
