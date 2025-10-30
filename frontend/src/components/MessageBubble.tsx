import type { FC, ReactNode } from 'react'
import type { UiMessage } from '../types'
import { IntentBadge } from './IntentBadge'
import { FileBadge } from './FileBadge'
import { SourceList } from './SourceList'
import { MarkdownContent } from './MarkdownContent'

export interface MessageBubbleProps {
  message: UiMessage
  children?: ReactNode
}

const roleLabel: Record<UiMessage['role'], string> = {
  user: 'User',
  assistant: 'Assistant',
}

export const MessageBubble: FC<MessageBubbleProps> = ({
  message,
  children,
}) => {
  const isUser = message.role === 'user'
  const alignment = isUser ? 'justify-end text-right' : 'justify-start text-left'
  const bubbleColor = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-white text-slate-800 border border-slate-200'

  return (
    <div className={`flex w-full ${alignment}`}>
      <div className={`max-w-2xl rounded-2xl px-4 py-3 shadow-sm ${bubbleColor}`}>
        <div
          className={`mb-2 flex flex-wrap items-center ${isUser ? 'justify-end gap-2' : 'gap-2'}`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${isUser ? 'text-white/80' : 'text-slate-500/80'
              }`}
          >
            {roleLabel[message.role]}
          </span>
          <IntentBadge
            intent={message.intent}
            className={isUser ? 'ml-auto bg-white/20 text-white border-white/30' : ''}
          />
          {message.hasFile ? (
            <FileBadge
              className={isUser ? 'ml-auto bg-white/20 text-white' : ''}
            />
          ) : null}
        </div>
        {message.displayText ? (
          message.role === 'assistant' ? (
            <MarkdownContent content={message.displayText} />
          ) : (
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {message.displayText}
            </p>
          )
        ) : (
          <p className="italic text-sm opacity-70">No visible text</p>
        )}
        {children}
        {message.sources?.length ? (
          <details open className={`mt-3 ${isUser ? 'text-left' : ''}`}>
            <summary className="cursor-pointer select-none text-sm font-semibold text-slate-700">
              Sources
            </summary>
            <div className="mt-3">
              <SourceList sources={message.sources} />
            </div>
          </details>
        ) : null}
        {message.toolCalls?.length ? (
          <div
            className={`mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 ${isUser ? 'text-left' : ''
              }`}
          >
            <span className="mr-1 font-semibold">Tool calls:</span>
            {message.toolCalls.join(', ')}
          </div>
        ) : null}
      </div>
    </div>
  )
}
