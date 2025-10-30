import type { FC } from 'react'

type IntentStyle = {
  label: string
  classes: string
}

const INTENT_STYLES: Record<string, IntentStyle> = {
  normal_chat: {
    label: 'Normal Chat',
    classes: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  mock_interview: {
    label: 'Mock Interview',
    classes: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  evaluate_resume: {
    label: 'Evaluate Resume',
    classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  recommend_job: {
    label: 'Recommend Job',
    classes: 'bg-violet-100 text-violet-700 border border-violet-200',
  },
}

const DEFAULT_STYLE: IntentStyle = {
  label: 'Unknown',
  classes: 'bg-slate-200 text-slate-700 border border-slate-300',
}

export interface IntentBadgeProps {
  intent?: string
  className?: string
}

export const IntentBadge: FC<IntentBadgeProps> = ({ intent, className = '' }) => {
  if (!intent) {
    return null
  }

  const normalized = intent.toLowerCase()
  const variant = INTENT_STYLES[normalized] ?? {
    ...DEFAULT_STYLE,
    label: intent,
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${variant.classes} ${className}`}
    >
      {variant.label}
    </span>
  )
}
