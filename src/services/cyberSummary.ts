import type { OrgInfo } from '../App'
import type { ScoredResult } from '../engine/score'

export interface CyberSummaryRequest {
  orgInfo: OrgInfo
  result: ScoredResult
}

export interface CyberSummaryResponse {
  summary: string
}

export async function fetchCyberSummary(payload: CyberSummaryRequest, signal?: AbortSignal): Promise<string> {
  const endpoint = import.meta.env.VITE_CYBER_SUMMARY_API_URL || '/api/cyber-summary'
  const retryDelays = [0, 1500, 3000]

  for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
    if (retryDelays[attempt] > 0) {
      await wait(retryDelays[attempt], signal)
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })

    if (!response.ok) {
      if ((response.status === 429 || response.status === 503) && attempt < retryDelays.length - 1) {
        continue
      }
      throw new Error(`Cyber summary request failed with status ${response.status}`)
    }

    const data = await response.json() as CyberSummaryResponse
    if (!data.summary?.trim()) {
      throw new Error('Cyber summary response did not include a summary')
    }

    return data.summary.trim()
  }

  throw new Error('Cyber summary request failed')
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeoutId)
      reject(new DOMException('Aborted', 'AbortError'))
    }, { once: true })
  })
}
