"use client"

import { useEffect, useState } from "react"
import { codeToHtml, BundledLanguage, BundledTheme } from "shiki"

interface CodeBlockProps {
  code: string
  language?: string
  isDarkMode?: boolean
}

export function CodeBlock({ code, language = "plaintext", isDarkMode = true }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const highlight = async () => {
      setIsLoading(true)
      try {
        const theme: BundledTheme = isDarkMode ? "github-dark" : "github-light"
        const highlighted = await codeToHtml(code, {
          lang: language as BundledLanguage,
          theme,
        })
        setHtml(highlighted)
      } catch {
        // Fallback to plaintext if language isn't supported
        const theme: BundledTheme = isDarkMode ? "github-dark" : "github-light"
        const highlighted = await codeToHtml(code, {
          lang: "plaintext",
          theme,
        })
        setHtml(highlighted)
      }
      setIsLoading(false)
    }
    highlight()
  }, [code, language, isDarkMode])

  if (isLoading) {
    return (
      <pre className={`p-4 rounded text-sm overflow-x-auto ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div 
      className="code-block rounded overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  )
}
