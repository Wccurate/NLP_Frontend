import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, getHealth, getHistory, postGenerate } from './api'
import { extractDisplayText } from './parse'
import { ErrorBanner } from './components/ErrorBanner'
import { MessageBubble } from './components/MessageBubble'
import { GlassCard } from './components/ui/GlassCard'
import { Button } from './components/ui/Button'
import type { UiMessage } from './types'
import { PaperClipIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      const { text: displayText, hasFile: hasDocumentBlock } = extractDisplayText(input)

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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black selection:bg-blue-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vh] rounded-full bg-purple-600/20 blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] h-[60vh] w-[60vh] rounded-full bg-blue-600/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] h-[60vh] w-[60vh] rounded-full bg-pink-600/20 blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <h1 className="ml-4 text-xl font-semibold tracking-tight text-white/90">
                RAG QA <span className="text-white/40 font-light">Assistant</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${healthOk ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                {healthOk ? 'System Online' : 'Offline'}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6">
          {healthOk === false && (
            <ErrorBanner message="Backend connection failed. Please check if the API server is running." />
          )}

          {historyError && (
            <ErrorBanner message={historyError} onClose={() => setHistoryError(null)} />
          )}

          {sendError && (
            <ErrorBanner message={sendError} onClose={() => setSendError(null)} />
          )}

          <GlassCard className="flex-1 mb-6 overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {isLoadingHistory ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : hasMessages ? (
                <>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-white/40">
                  <div className="rounded-full bg-white/5 p-6 backdrop-blur-sm">
                    <PaperAirplaneIcon className="h-8 w-8 -rotate-45 opacity-50" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white/80">Welcome to RAG QA</p>
                    <p className="text-sm">Start a conversation or upload a document.</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl bg-white/10 p-2 backdrop-blur-xl border border-white/20 shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <textarea
                className="min-h-[60px] w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none custom-scrollbar"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
                disabled={isSending}
              />

              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={isSending}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`group flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${file
                        ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}
                  >
                    <PaperClipIcon className="h-4 w-4" />
                    {file ? (
                      <span className="max-w-[150px] truncate">{file.name}</span>
                    ) : (
                      'Attach file'
                    )}
                  </button>
                  {file && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-xs text-white/40 hover:text-white"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={(!input.trim() && !file) || isSending}
                  isLoading={isSending}
                  className="rounded-lg px-4 py-1.5"
                  size="sm"
                >
                  <PaperAirplaneIcon className="h-4 w-4 -rotate-45 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </motion.form>
        </main>
      </div>
    </div>
  )
}

export default App
