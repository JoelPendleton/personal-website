"use client"

import { useEffect, useRef } from "react"
import katex from "katex"

interface MathProps {
  children: string
  display?: boolean
  className?: string
}

// Block math (centered, display style)
export function Math({ children, className = "" }: MathProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      katex.render(children, containerRef.current, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      })
    }
  }, [children])

  return (
    <div 
      ref={containerRef} 
      className={`my-6 overflow-x-auto ${className}`}
    />
  )
}

// Inline math
export function InlineMath({ children, className = "" }: Omit<MathProps, "display">) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      katex.render(children, containerRef.current, {
        displayMode: false,
        throwOnError: false,
        strict: false,
      })
    }
  }, [children])

  return (
    <span 
      ref={containerRef} 
      className={className}
    />
  )
}
