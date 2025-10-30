import { PaperClipIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'

export interface FileBadgeProps {
  className?: string
}

export const FileBadge: FC<FileBadgeProps> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 ${className}`}
    title="File attached"
  >
    <PaperClipIcon className="h-3.5 w-3.5" aria-hidden />
    File
  </span>
)
