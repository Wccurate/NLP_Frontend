import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

// Combine Framer Motion props with HTML Button props
type CombinedButtonProps = ButtonProps & HTMLMotionProps<'button'>

export const Button = forwardRef<HTMLButtonElement, CombinedButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-blue-500/80 hover:bg-blue-600/80 text-white shadow-lg shadow-blue-500/20 border border-blue-400/20 backdrop-blur-md',
            secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md',
            ghost: 'hover:bg-white/10 text-slate-300 hover:text-white',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-8 py-3 text-base',
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : null}
                {children}
            </motion.button>
        )
    }
)

Button.displayName = 'Button'
