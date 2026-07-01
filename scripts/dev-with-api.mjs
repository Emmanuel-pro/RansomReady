import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const preferredPort = Number(process.env.PORT || 5173)
const GOOGLE_AI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

loadEnvFile(path.join(root, '.env'))
loadEnvFile(path.join(root, '.env.local'))

let vite
const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/cyber-summary')) {
    await handleCyberSummary(req, res)
    return
  }

  vite.middlewares(req, res, error => {
    if (error) {
      vite.ssrFixStacktrace(error)
      res.statusCode = 500
      res.end(error.stack)
    }
  })
})

vite = await createViteServer({
  root,
  server: {
    middlewareMode: true,
    hmr: { server },
  },
  appType: 'spa',
})

const port = await listenOnAvailablePort(server, preferredPort)
console.log(`RansomReady local dev server: http://127.0.0.1:${port}`)
console.log('Serving React with Vite and /api/cyber-summary locally.')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function listenOnAvailablePort(server, startPort) {
  const maxAttempts = 20

  return new Promise((resolve, reject) => {
    function tryPort(port, attempt) {
      const handleError = error => {
        server.off('listening', handleListening)

        if (error?.code === 'EADDRINUSE' && attempt < maxAttempts) {
          console.warn(`Port ${port} is already in use. Trying ${port + 1}...`)
          tryPort(port + 1, attempt + 1)
          return
        }

        reject(error)
      }

      const handleListening = () => {
        server.off('error', handleError)
        resolve(port)
      }

      server.once('error', handleError)
      server.once('listening', handleListening)
      server.listen(port, '127.0.0.1')
    }

    tryPort(startPort, 1)
  })
}

async function handleCyberSummary(req, res) {
  setJsonHeaders(res)

  if (req.method === 'OPTIONS') {
    writeJson(res, 204, {})
    return
  }

  if (req.method !== 'POST') {
    writeJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    writeJson(res, 500, { error: 'GOOGLE_AI_API_KEY is not configured' })
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    writeJson(res, 400, { error: 'Invalid JSON request body' })
    return
  }

  const { orgInfo, result } = body ?? {}
  if (!orgInfo?.name || !orgInfo.sector || !orgInfo.size || !result) {
    writeJson(res, 400, { error: 'Missing organisation or assessment data' })
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
      headers: { 'Content-Type': 'application/json' },
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
      writeJson(res, googleAiResponse.status, { error: 'Google AI request failed', detail })
      return
    }

    const data = await googleAiResponse.json()
    const summary = extractResponseText(data)

    if (!summary) {
      writeJson(res, 502, { error: 'Google AI response did not include text' })
      return
    }

    writeJson(res, 200, { summary })
  } catch (error) {
    writeJson(res, 500, {
      error: 'Cyber summary generation failed',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

function setJsonHeaders(res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function writeJson(res, statusCode, body) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', chunk => {
      raw += chunk
      if (raw.length > 1024 * 1024) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function extractResponseText(data) {
  if (!data || typeof data !== 'object') return ''

  const candidates = data.candidates
  if (!Array.isArray(candidates)) return ''

  return candidates
    .flatMap(candidate => {
      if (!candidate || typeof candidate !== 'object') return []
      const content = candidate.content
      if (!content || typeof content !== 'object') return []
      const parts = content.parts
      return Array.isArray(parts) ? parts : []
    })
    .map(part => {
      if (!part || typeof part !== 'object') return ''
      return typeof part.text === 'string' ? part.text : ''
    })
    .join(' ')
    .trim()
}
