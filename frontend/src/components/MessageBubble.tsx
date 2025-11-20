import { motion } from 'framer-motion'
import { UserCircleIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { MarkdownContent } from './MarkdownContent'
import { SourceList } from './SourceList'
import { FileBadge } from './FileBadge'
import { IntentBadge } from './IntentBadge'
import type { UiMessage } from '../types'
import { cn } from '../lib/utils'

interface MessageBubbleProps {
  message: UiMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex w-full gap-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
          <ComputerDesktopIcon className="h-5 w-5 text-blue-200" />
        </div>
      )}

      <div
        className={cn(
          'relative max-w-[85%] rounded-2xl px-5 py-4 shadow-sm backdrop-blur-md transition-all',
          isUser
            ? 'bg-blue-500/80 text-white border border-blue-400/30 rounded-tr-sm'
            : 'bg-white/10 text-slate-100 border border-white/10 rounded-tl-sm'
        )}
      >
        {/* Header info */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs opacity-80">
          <span className="font-medium">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-[10px] opacity-60">
            {new Date(message.timestamp ?? Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.intent && <IntentBadge intent={message.intent} />}
        </div>

        {/* File attachment */}
        {message.hasFile && (
          <div className="mb-3">
            <FileBadge />
          </div>
        )}

        {/* Content */}
        <div className={cn('prose prose-sm max-w-none break-words', isUser ? 'prose-invert' : 'prose-invert')}>
          <MarkdownContent content={message.displayText} />
        </div>

        {/* Sources (Assistant only) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="mb-2 text-xs font-medium text-slate-300">Sources</p>
            <SourceList sources={message.sources} />
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30">
          <UserCircleIcon className="h-5 w-5 text-blue-200" />
        </div>
      )}
    </motion.div>
  )
}
