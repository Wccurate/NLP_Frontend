import type { GenerateResponse, HistoryEntry } from './types'

const normalizeBaseUrl = (value: string | undefined): string => {
  if (!value) {
    return '/api'
  }

  if (value.endsWith('/')) {
    return value.slice(0, -1)
  }

  return value
}

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

const buildUrl = (path: string) => `${BASE_URL}${path}`

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function handleJson<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) {
    return {} as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new ApiError(response.status, 'Invalid JSON response')
  }
}

export async function getHealth(): Promise<boolean> {
  const response = await fetch(buildUrl('/health'))
  if (!response.ok) {
    throw new ApiError(response.status, 'Health check failed')
  }

  const data = await handleJson<{ status?: string }>(response)
  return data.status === 'ok'
}

export async function getHistory(limit = 20): Promise<HistoryEntry[]> {
  const response = await fetch(buildUrl(`/history?limit=${limit}`))
  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to load history')
  }

  return handleJson<HistoryEntry[]>(response)
}

export async function postGenerate(form: FormData): Promise<GenerateResponse> {
  const response = await fetch(buildUrl('/generate'), {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    let message = 'Generation failed.'

    try {
      const data = await response.json()
      if (data?.detail) {
        message = data.detail
      }
    } catch {
      // ignore parse error; use fallback message
    }

    if (response.status === 422) {
      message = 'Input text or file is required.'
    } else if (response.status === 500 && message === 'Generation failed.') {
      message = 'Generation failed.'
    }

    throw new ApiError(response.status, message)
  }

  return handleJson<GenerateResponse>(response)
}
