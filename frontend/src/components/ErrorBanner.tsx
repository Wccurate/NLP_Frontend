import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

interface ErrorBannerProps {
  message: string
  onClose?: () => void
}

export function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="relative mb-4 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-200 backdrop-blur-md shadow-lg"
      >
        <XCircleIcon className="h-5 w-5 shrink-0 text-red-400" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-red-400 hover:bg-red-500/20 transition-colors"
            aria-label="Dismiss error"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
