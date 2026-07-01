interface OrgInfo {
  name: string
  sector: string
  size: string
  date: string
}

interface CategoryResult {
  label: string
  percent: number
}

interface ScoredResult {
  percent: number
  band: string
  categoryResults: CategoryResult[]
}

interface CyberSummaryRequest {
  orgInfo?: OrgInfo
  result?: ScoredResult
}

interface VercelRequest {
  method?: string
  body?: CyberSummaryRequest
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

const GOOGLE_AI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).json({})
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'GOOGLE_AI_API_KEY is not configured' })
    return
  }

  const { orgInfo, result } = req.body ?? {}
  if (!orgInfo?.name || !orgInfo.sector || !orgInfo.size || !result) {
    res.status(400).json({ error: 'Missing organisation or assessment data' })
    return
  }

  const categoryScores = result.categoryResults
    .map(category => `${category.label}: ${category.percent}%`)
    .join('; ')

  const prompt = [
    'Generate a concise cybersecurity readiness summary for a non-technical leadership audience.',
    'Focus on ransomware preparedness and practical business risk.',
    'Write in British English, in one paragraph, 80-110 words.',
    'Do not invent facts, vendors, incidents, certifications, or legal conclusions.',
    'Avoid generic filler and avoid saying this is AI-generated.',
    '',
    `Company name: ${orgInfo.name}`,
    `Company type / sector: ${orgInfo.sector}`,
    `Number of employees: ${orgInfo.size}`,
    `Readiness score: ${result.percent}%`,
    `Risk band: ${result.band}`,
    `Category scores: ${categoryScores}`,
  ].join('\n')

  try {
    const model = process.env.GOOGLE_AI_MODEL || 'gemini-2.5-flash-lite'
    const googleAiResponse = await fetch(`${GOOGLE_AI_API_BASE_URL}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 180,
        },
      }),
    })

    if (!googleAiResponse.ok) {
      const detail = await googleAiResponse.text()
      res.status(googleAiResponse.status).json({ error: 'Google AI request failed', detail })
      return
    }

    const data = await googleAiResponse.json()
    const summary = extractResponseText(data)

    if (!summary) {
      res.status(502).json({ error: 'Google AI response did not include text' })
      return
    }

    res.status(200).json({ summary })
  } catch (error) {
    res.status(500).json({
      error: 'Cyber summary generation failed',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

function extractResponseText(data: unknown): string {
  if (!data || typeof data !== 'object') return ''

  const candidates = (data as { candidates?: unknown }).candidates
  if (!Array.isArray(candidates)) return ''

  return candidates
    .flatMap(candidate => {
      if (!candidate || typeof candidate !== 'object') return []
      const content = (candidate as { content?: unknown }).content
      if (!content || typeof content !== 'object') return []
      const parts = (content as { parts?: unknown }).parts
      return Array.isArray(parts) ? parts : []
    })
    .map(part => {
      if (!part || typeof part !== 'object') return ''
      const text = (part as { text?: unknown }).text
      return typeof text === 'string' ? text : ''
    })
    .join(' ')
    .trim()
}
