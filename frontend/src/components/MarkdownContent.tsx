import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export interface MarkdownContentProps {
  content: string
  className?: string
}

const components: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="mt-4 text-lg font-semibold text-slate-900 first:mt-0" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="mt-4 text-base font-semibold text-slate-900 first:mt-0" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mt-3 text-base font-medium text-slate-900 first:mt-0" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-800" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="mt-3 list-disc pl-5 marker:text-slate-500" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="mt-3 list-decimal pl-5 marker:text-slate-500" {...props} />
  ),
  li: ({ node, ...props }) => <li className="mt-1 leading-relaxed" {...props} />,
  a: ({ node, ...props }) => (
    <a
      className="font-medium text-blue-600 underline decoration-blue-400 hover:text-blue-700"
      {...props}
    />
  ),
  code: (props) => {
    const { inline, className, children, ...rest } = props as {
      inline?: boolean
      className?: string
      children: ReactNode
    }

    const inlineClasses =
      'rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900'
    const blockClasses = 'font-mono text-xs'

    return (
      <code
        className={`${className ?? ''} ${inline ? inlineClasses : blockClasses}`.trim()}
        {...(rest as ComponentPropsWithoutRef<'code'>)}
      >
        {children}
      </code>
    )
  },
  pre: ({ className, children, ...props }) => (
    <pre
      className={`mt-3 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-xs text-slate-100 ${className ?? ''}`}
      {...(props as ComponentPropsWithoutRef<'pre'>)}
    >
      {children}
    </pre>
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="mt-3 border-l-4 border-blue-200 bg-blue-50 px-3 py-2 italic text-slate-700"
      {...props}
    />
  ),
  table: ({ node, ...props }) => (
    <div className="mt-3 overflow-x-auto">
      <table
        className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700"
        {...props}
      />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-slate-100" {...props} />,
  th: ({ node, ...props }) => <th className="px-3 py-2 font-semibold" {...props} />,
  td: ({ node, ...props }) => <td className="px-3 py-2 align-top" {...props} />,
}

export const MarkdownContent: FC<MarkdownContentProps> = ({
  content,
  className = '',
}) => {
  if (!content) {
    return null
  }

  return (
    <div className={`markdown-content text-sm leading-relaxed ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
