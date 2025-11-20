import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

interface GlassCardProps extends HTMLMotionProps<'div'> {
    className?: string
    children: React.ReactNode
    hoverEffect?: boolean
}

export function GlassCard({ className, children, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
                'glass-panel rounded-2xl p-6',
                hoverEffect && 'hover:bg-white/20 transition-colors duration-300',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    )
}
