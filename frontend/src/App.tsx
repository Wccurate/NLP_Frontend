import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, getHealth, getHistory, postGenerate } from './api'
import { extractDisplayText } from './parse'
import { ErrorBanner } from './components/ErrorBanner'
import { MessageBubble } from './components/MessageBubble'
import type { UiMessage } from './types'

function App() {
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [healthOk, setHealthOk] = useState<boolean | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        const ok = await getHealth()
        setHealthOk(ok)
      } catch (error) {
        console.error(error)
        setHealthOk(false)
      }

      try {
        const history = await getHistory(20)
        setMessages(
          history.map((entry, index) => {
            const { text, hasFile } = extractDisplayText(entry.content ?? '')
            return {
              id: `history-${index}`,
              role: entry.role,
              intent: entry.intent,
              content: entry.content,
              displayText: text,
              hasFile,
              sources: undefined,
              toolCalls: undefined,
              timestamp: entry.timestamp,
            }
          }),
        )
      } catch (error) {
        console.error(error)
        setHistoryError('Failed to load conversation history.')
      } finally {
        setIsLoadingHistory(false)
      }
    }

    void initialize()
  }, [])

  const hasMessages = useMemo(() => messages.length > 0, [messages])

  const createId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSendError(null)

    const trimmedInput = input.trim()

    if (!trimmedInput && !file) {
      setSendError('Input text or file is required.')
      return
    }

    const formData = new FormData()
    formData.append('web_search', 'false')
    formData.append('return_stream', 'false')
    formData.append('persist_documents', 'false')

    formData.append('input', trimmedInput)

    if (file) {
      formData.append('file', file)
    }

    setIsSending(true)

    try {
      const response = await postGenerate(formData)
      const { text: assistantText, intent, sources, tool_calls: toolCalls } = response
      const { text: displayText, hasFile: hasDocumentBlock } = extractDisplayText(
        input,
      )

      const userMessage: UiMessage = {
        id: createId('user'),
        role: 'user',
        intent,
        content: input,
        displayText,
        hasFile: Boolean(file) || hasDocumentBlock,
        sources: undefined,
        toolCalls: undefined,
        timestamp: new Date().toISOString(),
      }

      const assistantMessage: UiMessage = {
        id: createId('assistant'),
        role: 'assistant',
        intent,
        content: assistantText,
        displayText: assistantText,
        hasFile: false,
        sources,
        toolCalls: toolCalls ?? undefined,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setInput('')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error(error)
      if (error instanceof ApiError) {
        setSendError(error.message)
      } else {
        setSendError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-semibold text-slate-900">
            RAG QA Demo
          </h1>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Single session
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-3 py-6 sm:px-6">
        {healthOk === false ? (
          <ErrorBanner message="Backend health check failed. Ensure the API is running on http://localhost:8000." />
        ) : null}

        {historyError ? (
          <ErrorBanner message={historyError} onClose={() => setHistoryError(null)} />
        ) : null}

        {sendError ? (
          <ErrorBanner message={sendError} onClose={() => setSendError(null)} />
        ) : null}

        <section className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4 shadow-inner">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12 text-sm text-slate-500">
              Loading conversation…
            </div>
          ) : hasMessages ? (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-slate-500">
              <p>No messages yet.</p>
              <p>Ask a question or attach a document to begin.</p>
            </div>
          )}
        </section>

        <form
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Your message
            <textarea
              aria-label="Message input"
              className="h-28 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ask a question or upload a resume/job description…"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isSending}
            />
          </label>

          <div className="flex flex-col gap-2 text-sm">
            <label className="font-medium text-slate-700">
              Attach a document (PDF, DOCX, or TXT)
            </label>
            <input
              ref={fileInputRef}
              aria-label="Attach a file"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(event) => {
                const nextFile = event.target.files?.[0]
                setFile(nextFile ?? null)
              }}
              disabled={isSending}
              className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:border-slate-400"
            />
            <p className="text-xs text-slate-500">
              Input text or file is required.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              aria-label="Send message"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default App
