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
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const bgColor = isDarkMode ? "#0d0d0d" : "#f5f5f5"
  const textColor = isDarkMode ? "#a3a3a3" : "#525252"

  const CopyButton = () => (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 text-xs px-2 py-1 rounded transition-all hover:opacity-80 z-10"
      style={{ 
        backgroundColor: isDarkMode ? "rgba(38, 38, 38, 0.9)" : "rgba(229, 229, 229, 0.9)",
        color: textColor,
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )

  if (isLoading) {
    return (
      <div 
        className="relative my-6 rounded-lg overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <CopyButton />
        <div className="max-h-[50vh] overflow-y-auto">
          <pre className="p-4 m-0 text-sm overflow-x-auto">
            <code className="whitespace-pre">{code}</code>
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative my-6 rounded-lg overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <CopyButton />
      <div className="max-h-[50vh] overflow-y-auto">
        <div 
          className="text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent [&_code]:whitespace-pre"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </div>
    </div>
  )
}
