const DOCUMENT_BLOCK_REGEX = /<document>[\s\S]*?<\/document>/gi

export function extractDisplayText(content: string): {
  text: string
  hasFile: boolean
} {
  if (!content) {
    return { text: '', hasFile: false }
  }

  const hasFile = DOCUMENT_BLOCK_REGEX.test(content)
  DOCUMENT_BLOCK_REGEX.lastIndex = 0

  const text = content.replace(DOCUMENT_BLOCK_REGEX, '').trim()

  return {
    text,
    hasFile,
  }
}
