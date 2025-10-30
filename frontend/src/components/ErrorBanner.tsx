import type { FC, ReactNode } from 'react'

export interface ErrorBannerProps {
  message: ReactNode
  onClose?: () => void
}

export const ErrorBanner: FC<ErrorBannerProps> = ({ message, onClose }) => {
  if (!message) {
    return null
  }

  return (
    <div className="mb-4 flex items-start justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      <div>{message}</div>
      {onClose ? (
        <button
          type="button"
          aria-label="Dismiss error"
          className="ml-4 rounded border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          onClick={onClose}
        >
          Dismiss
        </button>
      ) : null}
    </div>
  )
}
