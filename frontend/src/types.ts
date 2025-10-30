export type Role = 'user' | 'assistant'

export interface HistoryEntry {
  role: Role
  content: string
  intent: string
  timestamp?: string
}

export interface SourceItem {
  source: string
  text: string
  hybrid_score: number
  dense_score: number
  bm25_score: number
  score?: number | null
  bm25_raw_score?: number | null
  dense_distance?: number | null
}

export interface GenerateResponse {
  intent: string
  text: string
  sources?: SourceItem[]
  tool_calls?: string[]
}

export interface UiMessage {
  id: string
  role: Role
  intent: string
  content: string
  displayText: string
  hasFile: boolean
  sources?: SourceItem[]
  toolCalls?: string[]
  timestamp?: string
}
