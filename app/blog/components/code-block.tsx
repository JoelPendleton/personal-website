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
        const theme: BundledTheme = isDarkMode ? "min-dark" : "min-light"
        const highlighted = await codeToHtml(code, {
          lang: language as BundledLanguage,
          theme,
        })
        setHtml(highlighted)
      } catch {
        // Fallback to plaintext if language isn't supported
        const theme: BundledTheme = isDarkMode ? "min-dark" : "min-light"
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

  // Override theme background to match site's component background
  const bgColor = isDarkMode ? "#0d0d0d" : "#f5f5f5"
  
  return (
    <div 
      className="code-block my-6 rounded-lg overflow-hidden text-sm leading-relaxed [&_pre]:p-6 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_code]:p-0 [&_code]:m-0 [&_code]:leading-relaxed"
      style={{ backgroundColor: bgColor }}
      dangerouslySetInnerHTML={{ __html: html.replace(/background(-color)?:\s*[^;]+;?/g, `background-color: ${bgColor};`).replace(/margin[^;]*;?/g, '') }} 
    />
  )
}
