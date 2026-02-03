"use client"

import { useState, useEffect } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

// ==============================================
// Unified color palette matching the site style
// ==============================================

// Import Tailwind colors directly for use in SVG elements (which require hex values)
import twColors from "tailwindcss/colors"

const tailwindColors = {
  green: twColors.green[600],
  red: twColors.red[600],
  yellow: twColors.yellow[600],
  amber: twColors.amber[600],
  blue: twColors.blue[600],
}

// Core colors - using Tailwind 500 values
const colors = {
  accent: tailwindColors.blue,
  red: tailwindColors.red,
  amber: tailwindColors.amber,
  yellow: tailwindColors.yellow,
  green: tailwindColors.green,
  good: tailwindColors.green,
  bad: tailwindColors.red,
}

// Muted colors for dark/light mode (replacing transparency)
const getMutedColors = (isDarkMode: boolean) => ({
  // Text colors - neutral grays
  textPrimary: isDarkMode ? "#e5e5e5" : "#171717",
  textSecondary: isDarkMode ? "#a3a3a3" : "#525252",
  textMuted: isDarkMode ? "#737373" : "#737373",
  // Stroke colors - neutral grays
  strokePrimary: isDarkMode ? "#d4d4d4" : "#262626",
  strokeSecondary: isDarkMode ? "#737373" : "#a3a3a3",
  strokeMuted: isDarkMode ? "#525252" : "#d4d4d4",
  // Background colors - matches bg-white/5 on black for tables/code blocks
  bgSubtle: isDarkMode ? "#0d0d0d" : "#f5f5f5",
  bgMuted: isDarkMode ? "#1a1a1a" : "#e8e8e8",
  // Inactive/grayed elements
  nodeInactive: isDarkMode ? "#404040" : "#a3a3a3",
  edgeInactive: isDarkMode ? "#3a3a3a" : "#c4c4c4",
})

// Get quality color using four distinct colors: red, amber, yellow, green
// Maps quality (0.80-1.0) to discrete color stops
function getQualityColor(quality: number): string {
  // Normalize to 0-1 range (0.80 = 0, 1.0 = 1)
  const t = Math.max(0, Math.min(1, (quality - 0.80) / 0.20))
  
  // Four discrete colors based on quality range
  if (t < 0.25) {
    return colors.red      // 0.80-0.85: red
  } else if (t < 0.50) {
    return colors.amber    // 0.85-0.90: amber
  } else if (t < 0.75) {
    return colors.yellow   // 0.90-0.95: yellow
  } else {
    return colors.green    // 0.95-1.00: green
  }
}

// Get quality color for non-hovered states
// Uses the same vibrant colors - hover state differentiates via size/stroke
function getMutedQualityColor(quality: number, _isDarkMode: boolean): string {
  // Just use the same vibrant colors as getQualityColor
  // The hover state adds visual emphasis through size changes
  return getQualityColor(quality)
}

// Determine if text should be dark or light based on quality
// All quality colors are bright enough to need dark text
function getTextColorForQuality(_quality: number): string {
  return "#000"
}

// ============================================
// SWAP Gate Decomposition Visualizer
// ============================================
export function SwapGateVisualizer({ isDarkMode }: { isDarkMode: boolean }) {
  const [showDecomposition, setShowDecomposition] = useState(false)
  const muted = getMutedColors(isDarkMode)

  return (
    <div className="rounded-lg" style={{ backgroundColor: muted.bgSubtle }}>
      <div className="px-4 sm:px-6 py-5">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center overflow-x-auto max-w-full">
            <svg className="w-[100px] sm:w-[140px] h-auto flex-shrink-0" viewBox="0 0 140 80">
              <line x1="20" y1="25" x2="120" y2="25" stroke={muted.strokePrimary} strokeWidth="1" />
              <line x1="20" y1="55" x2="120" y2="55" stroke={muted.strokePrimary} strokeWidth="1" />
              <text x="12" y="29" fill={muted.strokePrimary} fontSize="13" fontFamily="monospace" textAnchor="end">q₁</text>
              <text x="12" y="59" fill={muted.strokePrimary} fontSize="13" fontFamily="monospace" textAnchor="end">q₂</text>
              <line x1="65" y1="20" x2="75" y2="30" stroke={muted.strokePrimary} strokeWidth="1.5" />
              <line x1="75" y1="20" x2="65" y2="30" stroke={muted.strokePrimary} strokeWidth="1.5" />
              <line x1="65" y1="50" x2="75" y2="60" stroke={muted.strokePrimary} strokeWidth="1.5" />
              <line x1="75" y1="50" x2="65" y2="60" stroke={muted.strokePrimary} strokeWidth="1.5" />
              <line x1="70" y1="30" x2="70" y2="50" stroke={muted.strokePrimary} strokeWidth="1" />
            </svg>
            
            <span className="text-lg sm:text-xl flex-shrink-0" style={{ color: muted.textMuted }}>=</span>
            
            <svg className={`h-auto flex-shrink-0 transition-all duration-300 ${showDecomposition ? "w-[200px] sm:w-[300px]" : "w-[100px] sm:w-[140px]"}`} viewBox={showDecomposition ? "0 0 300 80" : "0 0 140 80"}>
              <line x1="20" y1="25" x2={showDecomposition ? "280" : "120"} y2="25" stroke={muted.strokePrimary} strokeWidth="1" />
              <line x1="20" y1="55" x2={showDecomposition ? "280" : "120"} y2="55" stroke={muted.strokePrimary} strokeWidth="1" />
              {showDecomposition ? (
                <>
                  <circle cx="70" cy="55" r="4" fill={muted.strokePrimary} />
                  <line x1="70" y1="55" x2="70" y2="25" stroke={muted.strokePrimary} strokeWidth="1" />
                  <circle cx="70" cy="25" r="8" fill="none" stroke={muted.strokePrimary} strokeWidth="1" />
                  <line x1="70" y1="17" x2="70" y2="33" stroke={muted.strokePrimary} strokeWidth="1" />
                  <circle cx="150" cy="25" r="4" fill={muted.strokePrimary} />
                  <line x1="150" y1="25" x2="150" y2="55" stroke={muted.strokePrimary} strokeWidth="1" />
                  <circle cx="150" cy="55" r="8" fill="none" stroke={muted.strokePrimary} strokeWidth="1" />
                  <line x1="150" y1="47" x2="150" y2="63" stroke={muted.strokePrimary} strokeWidth="1" />
                  <circle cx="230" cy="55" r="4" fill={muted.strokePrimary} />
                  <line x1="230" y1="55" x2="230" y2="25" stroke={muted.strokePrimary} strokeWidth="1" />
                  <circle cx="230" cy="25" r="8" fill="none" stroke={muted.strokePrimary} strokeWidth="1" />
                  <line x1="230" y1="17" x2="230" y2="33" stroke={muted.strokePrimary} strokeWidth="1" />
                </>
              ) : (
                <text x="70" y="44" fill={muted.strokeSecondary} fontSize="13" textAnchor="middle" fontFamily="monospace">3 × CNOT</text>
              )}
            </svg>
          </div>
          
          <Button
            variant="outline"
            size="xs"
            onClick={() => setShowDecomposition(!showDecomposition)}
          >
            {showDecomposition ? "Collapse" : "Show decomposition"}
          </Button>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm" style={{ color: muted.textMuted }}>
        A SWAP gate exchanges quantum states between two qubits. It requires 3 CNOT operations, 
        so each SWAP inherits 3× the two-qubit gate error.
      </div>
    </div>
  )
}

// ============================================
// Qubit Topology Visualization
// ============================================
interface QubitNode {
  id: number
  x: number
  y: number
  quality: number
}

interface QubitEdge {
  from: number
  to: number
  quality: number
}

// Qubit fidelities distributed across the color spectrum:
// 0.80-0.87 = red, 0.87-0.93 = orange, 0.93-0.97 = yellow, 0.97-1.0 = green
const TOPOLOGY_QUBITS: QubitNode[] = [
  { id: 0, x: 50, y: 35, quality: 0.95 },   // yellow
  { id: 1, x: 120, y: 35, quality: 0.89 },  // orange
  { id: 2, x: 190, y: 35, quality: 0.98 },  // green
  { id: 3, x: 260, y: 35, quality: 0.82 },  // red
  { id: 4, x: 85, y: 85, quality: 0.84 },   // red
  { id: 5, x: 155, y: 85, quality: 0.97 },  // green
  { id: 6, x: 225, y: 85, quality: 0.94 },  // yellow
  { id: 7, x: 50, y: 135, quality: 0.99 },  // green
  { id: 8, x: 120, y: 135, quality: 0.91 }, // orange
  { id: 9, x: 190, y: 135, quality: 0.98 }, // green
  { id: 10, x: 260, y: 135, quality: 0.83 },// red
]

const TOPOLOGY_EDGES: QubitEdge[] = [
  { from: 0, to: 1, quality: 0.97 },  // green
  { from: 1, to: 2, quality: 0.90 },  // orange
  { from: 2, to: 3, quality: 0.82 },  // red
  { from: 0, to: 4, quality: 0.84 },  // red
  { from: 1, to: 5, quality: 0.94 },  // yellow
  { from: 2, to: 6, quality: 0.96 },  // yellow
  { from: 4, to: 5, quality: 0.88 },  // orange
  { from: 5, to: 6, quality: 0.99 },  // green
  { from: 4, to: 7, quality: 0.93 },  // yellow
  { from: 4, to: 8, quality: 0.85 },  // red
  { from: 5, to: 8, quality: 0.95 },  // yellow
  { from: 5, to: 9, quality: 0.98 },  // green
  { from: 6, to: 9, quality: 0.94 },  // yellow
  { from: 6, to: 10, quality: 0.81 }, // red
  { from: 7, to: 8, quality: 0.97 },  // green
  { from: 8, to: 9, quality: 0.96 },  // yellow
  { from: 9, to: 10, quality: 0.86 }, // red
]

export function ConnectivityGraph({ isDarkMode }: { isDarkMode: boolean }) {
  const [hoveredQubit, setHoveredQubit] = useState<number | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<{from: number, to: number} | null>(null)
  const [selectedQubits, setSelectedQubits] = useState<number[]>([])
  const muted = getMutedColors(isDarkMode)

  const toggleQubitSelection = (id: number) => {
    if (selectedQubits.includes(id)) {
      setSelectedQubits(selectedQubits.filter(q => q !== id))
    } else if (selectedQubits.length < 2) {
      setSelectedQubits([...selectedQubits, id])
    } else {
      setSelectedQubits([selectedQubits[1], id])
    }
  }

  // Check if two qubits are directly connected
  const areDirectlyConnected = (q1: number, q2: number): boolean => {
    return TOPOLOGY_EDGES.some(e => 
      (e.from === q1 && e.to === q2) || (e.from === q2 && e.to === q1)
    )
  }

  // BFS to find shortest path between two qubits
  const findShortestPath = (start: number, end: number): number[] | null => {
    if (start === end) return [start]
    const queue: number[][] = [[start]]
    const visited = new Set<number>([start])
    
    while (queue.length > 0) {
      const path = queue.shift()!
      const current = path[path.length - 1]
      
      const neighbors = TOPOLOGY_EDGES
        .filter(e => e.from === current || e.to === current)
        .map(e => e.from === current ? e.to : e.from)
      
      for (const neighbor of neighbors) {
        if (neighbor === end) return [...path, neighbor]
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push([...path, neighbor])
        }
      }
    }
    return null
  }

  // Get SWAP count for selected qubits
  const getSwapCount = (): number | null => {
    if (selectedQubits.length !== 2) return null
    if (areDirectlyConnected(selectedQubits[0], selectedQubits[1])) return 0
    const path = findShortestPath(selectedQubits[0], selectedQubits[1])
    return path ? path.length - 2 : null
  }

  const swapCount = getSwapCount()

  return (
    <TooltipProvider delayDuration={0}>
      <div className="rounded-lg" style={{ backgroundColor: muted.bgSubtle }}>
        <div className="p-4 sm:p-6 overflow-x-auto">
          <svg className="w-full max-w-[310px] h-auto mx-auto" viewBox="0 0 310 170">
            {TOPOLOGY_EDGES.map((edge, i) => {
              const fromQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.from)!
              const toQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.to)!
              const isHovered = hoveredEdge?.from === edge.from && hoveredEdge?.to === edge.to
              const isSelected = selectedQubits.includes(edge.from) && selectedQubits.includes(edge.to)
              const edgeColor = isSelected 
                ? colors.accent 
                : isHovered 
                  ? getQualityColor(edge.quality) 
                  : getMutedQualityColor(edge.quality, isDarkMode)
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <line
                      x1={fromQubit.x}
                      y1={fromQubit.y}
                      x2={toQubit.x}
                      y2={toQubit.y}
                      stroke={edgeColor}
                      strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredEdge(edge)}
                      onMouseLeave={() => setHoveredEdge(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="font-mono">
                    <span style={{ color: getQualityColor(edge.quality) }}>
                      {(edge.quality * 100).toFixed(0)}%
                    </span>
                    {" "}gate fidelity
                  </TooltipContent>
                </Tooltip>
              )
            })}
            {TOPOLOGY_QUBITS.map((qubit) => {
              const isSelected = selectedQubits.includes(qubit.id)
              const isHovered = hoveredQubit === qubit.id
              const nodeColor = isSelected 
                ? colors.accent 
                : isHovered 
                  ? getQualityColor(qubit.quality) 
                  : getMutedQualityColor(qubit.quality, isDarkMode)
              return (
                <Tooltip key={qubit.id}>
                  <TooltipTrigger asChild>
                    <g onClick={() => toggleQubitSelection(qubit.id)} className="cursor-pointer">
                      <circle
                        cx={qubit.x}
                        cy={qubit.y}
                        r={isHovered || isSelected ? 13 : 11}
                        fill={nodeColor}
                        className="transition-all duration-150"
                        onMouseEnter={() => setHoveredQubit(qubit.id)}
                        onMouseLeave={() => setHoveredQubit(null)}
                      />
                      <text
                        x={qubit.x}
                        y={qubit.y + 4}
                        textAnchor="middle"
                        fill={isSelected ? "#000" : getTextColorForQuality(qubit.quality)}
                        fontSize="10"
                        fontWeight="500"
                        fontFamily="monospace"
                        className="pointer-events-none select-none"
                      >
                        {qubit.id}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent className="font-mono">
                    Q{qubit.id}:{" "}
                    <span style={{ color: getQualityColor(qubit.quality) }}>
                      {(qubit.quality * 100).toFixed(0)}%
                    </span>
                    {" "}fidelity
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </svg>

          <div className="mt-4 text-center text-xs sm:text-sm font-mono min-h-[1.5rem]">
            {selectedQubits.length === 2 ? (
              <span>
                <span style={{ color: muted.textSecondary }}>Q{selectedQubits[0]} → Q{selectedQubits[1]}:</span>{" "}
                <span style={{ color: swapCount === 0 ? colors.good : colors.bad }}>
                  {swapCount === 0 ? "Connected" : `${swapCount} SWAP${swapCount !== 1 ? "s" : ""}`}
                </span>
              </span>
            ) : selectedQubits.length === 1 ? (
              <span style={{ color: muted.textMuted }}>Select another qubit</span>
            ) : (
              <span style={{ color: muted.textMuted }}>Click to select qubits</span>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

// ============================================
// Circuit Diagram Component
// ============================================
interface Gate {
  type: "cnot" | "swap"
  qubits: number[]
  highlight?: boolean
}

function QuantumCircuit({ 
  numQubits, 
  gates, 
  labels,
  width = 320, 
  isDarkMode 
}: {
  numQubits: number
  gates: Gate[]
  labels?: string[]
  width?: number
  isDarkMode: boolean
}) {
  const muted = getMutedColors(isDarkMode)
  const height = numQubits * 40 + 20
  const gateSpacing = 50
  const startX = 50
  const qubitY = (i: number) => 20 + i * 40

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: numQubits }).map((_, i) => (
        <g key={i}>
          <line x1="30" y1={qubitY(i)} x2={width - 10} y2={qubitY(i)} stroke={muted.strokeMuted} strokeWidth="1" />
          {labels && (
            <text x="8" y={qubitY(i) + 4} fill={muted.strokeSecondary} fontSize="12" fontFamily="monospace">{labels[i]}</text>
          )}
        </g>
      ))}
      {gates.map((gate, gateIdx) => {
        const x = startX + gateIdx * gateSpacing
        const gateStroke = gate.highlight ? colors.accent : muted.strokeSecondary

        if (gate.type === "cnot") {
          const [control, target] = gate.qubits
          const controlY = qubitY(control)
          const targetY = qubitY(target)
          return (
            <g key={gateIdx}>
              <line x1={x} y1={Math.min(controlY, targetY)} x2={x} y2={Math.max(controlY, targetY)} stroke={gateStroke} strokeWidth="1" />
              <circle cx={x} cy={controlY} r="3" fill={gateStroke} />
              <circle cx={x} cy={targetY} r="7" fill="none" stroke={gateStroke} strokeWidth="1" />
              <line x1={x} y1={targetY - 7} x2={x} y2={targetY + 7} stroke={gateStroke} strokeWidth="1" />
              <line x1={x - 7} y1={targetY} x2={x + 7} y2={targetY} stroke={gateStroke} strokeWidth="1" />
            </g>
          )
        }

        if (gate.type === "swap") {
          const [q1, q2] = gate.qubits
          const y1 = qubitY(q1)
          const y2 = qubitY(q2)
          return (
            <g key={gateIdx}>
              <line x1={x} y1={y1} x2={x} y2={y2} stroke={gateStroke} strokeWidth="1" />
              <line x1={x - 5} y1={y1 - 5} x2={x + 5} y2={y1 + 5} stroke={gateStroke} strokeWidth="1.5" />
              <line x1={x + 5} y1={y1 - 5} x2={x - 5} y2={y1 + 5} stroke={gateStroke} strokeWidth="1.5" />
              <line x1={x - 5} y1={y2 - 5} x2={x + 5} y2={y2 + 5} stroke={gateStroke} strokeWidth="1.5" />
              <line x1={x + 5} y1={y2 - 5} x2={x - 5} y2={y2 + 5} stroke={gateStroke} strokeWidth="1.5" />
            </g>
          )
        }
        return null
      })}
    </svg>
  )
}

// ============================================
// Circuit Placement Demo
// ============================================
function PlacementTopology({ highlightQubits, isDarkMode }: { highlightQubits: number[], isDarkMode: boolean }) {
  const muted = getMutedColors(isDarkMode)
  
  return (
    <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 310 170">
      {TOPOLOGY_EDGES.map((edge, i) => {
        const fromQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.from)!
        const toQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.to)!
        const isSelected = highlightQubits.includes(edge.from) && highlightQubits.includes(edge.to)
        return (
          <line
            key={i}
            x1={fromQubit.x}
            y1={fromQubit.y}
            x2={toQubit.x}
            y2={toQubit.y}
            stroke={isSelected ? colors.accent : muted.edgeInactive}
            strokeWidth={isSelected ? 2 : 1}
          />
        )
      })}
      {TOPOLOGY_QUBITS.map((qubit) => {
        const isSelected = highlightQubits.includes(qubit.id)
        const logicalIdx = highlightQubits.indexOf(qubit.id)
        return (
          <g key={qubit.id}>
            <circle
              cx={qubit.x}
              cy={qubit.y}
              r={isSelected ? 16 : 14}
              fill={isSelected ? colors.accent : muted.nodeInactive}
            />
            <text
              x={qubit.x}
              y={qubit.y + 4}
              textAnchor="middle"
              fill={isSelected ? "#000" : muted.textMuted}
              fontSize="12"
              fontWeight={isSelected ? "600" : "normal"}
              fontFamily="monospace"
            >
              {isSelected ? `q${logicalIdx}` : qubit.id}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function PlacementComparison({ isDarkMode }: { isDarkMode: boolean }) {
  const muted = getMutedColors(isDarkMode)
  
  const originalGates: Gate[] = [
    { type: "cnot", qubits: [0, 1] },
    { type: "cnot", qubits: [1, 2] },
    { type: "cnot", qubits: [0, 2], highlight: true },
  ]

  const randomRoutedGates: Gate[] = [
    { type: "swap", qubits: [0, 1], highlight: true },
    { type: "cnot", qubits: [1, 2] },
    { type: "swap", qubits: [1, 2], highlight: true },
    { type: "swap", qubits: [2, 3], highlight: true },
    { type: "cnot", qubits: [2, 3] },
  ]

  const smartRoutedGates: Gate[] = [
    { type: "cnot", qubits: [0, 1] },
    { type: "cnot", qubits: [1, 2] },
    { type: "swap", qubits: [0, 1], highlight: true },
    { type: "cnot", qubits: [1, 2] },
  ]

  return (
    <div className="rounded-lg" style={{ backgroundColor: muted.bgSubtle }}>
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 overflow-x-auto">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: muted.textMuted }}>Input circuit</p>
          <QuantumCircuit numQubits={3} gates={originalGates} labels={["q₀", "q₁", "q₂"]} width={220} isDarkMode={isDarkMode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.bad }} />
              <span className="text-sm" style={{ color: colors.bad }}>Random</span>
            </div>
            <PlacementTopology highlightQubits={[0, 3, 10]} isDarkMode={isDarkMode} />
            <div className="mt-3 overflow-x-auto">
              <QuantumCircuit numQubits={4} gates={randomRoutedGates} labels={["q₀", "q₁", "q₂", ""]} width={300} isDarkMode={isDarkMode} />
            </div>
            <div className="mt-3 flex gap-4 sm:gap-6 text-xs sm:text-sm font-mono">
              <span><span style={{ color: muted.textMuted }}>SWAPs:</span> <span style={{ color: colors.bad }}>4</span></span>
              <span><span style={{ color: muted.textMuted }}>Fidelity:</span> <span style={{ color: colors.bad }}>~52%</span></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.good }} />
              <span className="text-sm" style={{ color: colors.good }}>Noise-aware</span>
            </div>
            <PlacementTopology highlightQubits={[5, 8, 9]} isDarkMode={isDarkMode} />
            <div className="mt-3 overflow-x-auto">
              <QuantumCircuit numQubits={3} gates={smartRoutedGates} labels={["q₀", "q₁", "q₂"]} width={260} isDarkMode={isDarkMode} />
            </div>
            <div className="mt-3 flex gap-4 sm:gap-6 text-xs sm:text-sm font-mono">
              <span><span style={{ color: muted.textMuted }}>SWAPs:</span> <span style={{ color: colors.good }}>1</span></span>
              <span><span style={{ color: muted.textMuted }}>Fidelity:</span> <span style={{ color: colors.good }}>~89%</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SABRE vs NACRE Path Decision
// ============================================
export function CostFunctionComparison({ isDarkMode }: { isDarkMode: boolean }) {
  const [selectedPath, setSelectedPath] = useState<"short" | "quality">("short")
  const muted = getMutedColors(isDarkMode)

  const miniQubits = [
    { id: 0, x: 30, y: 60 },
    { id: 1, x: 85, y: 30 },
    { id: 2, x: 140, y: 60 },
    { id: 3, x: 85, y: 90 },
    { id: 4, x: 195, y: 30 },
    { id: 5, x: 250, y: 60 },
  ]

  const miniEdges = [
    { from: 0, to: 1, quality: 0.97 },
    { from: 1, to: 2, quality: 0.99 },
    { from: 0, to: 3, quality: 0.88 },
    { from: 2, to: 3, quality: 0.91 },
    { from: 2, to: 4, quality: 0.98 },
    { from: 4, to: 5, quality: 0.96 },
    { from: 3, to: 5, quality: 0.85 },
  ]

  const shortPathEdges = [[0, 3], [3, 5]]
  const qualityPathEdges = [[0, 1], [1, 2], [2, 4], [4, 5]]
  const currentPath = selectedPath === "short" ? shortPathEdges : qualityPathEdges

  const shortPathFidelity = Math.pow(0.88, 3) * Math.pow(0.85, 3)
  const qualityPathFidelity = Math.pow(0.97, 3) * Math.pow(0.99, 3) * Math.pow(0.98, 3) * Math.pow(0.96, 3)

  const isOnPath = (from: number, to: number) => {
    return currentPath.some(([a, b]) => (a === from && b === to) || (a === to && b === from))
  }

  return (
    <div className="rounded-lg" style={{ backgroundColor: muted.bgSubtle }}>
      <div className="p-4 sm:p-6">
        <p className="text-xs sm:text-sm mb-4 sm:mb-5" style={{ color: muted.textSecondary }}>
          Moving state from <span className="font-mono" style={{ color: colors.accent }}>Q0</span> to <span className="font-mono" style={{ color: colors.accent }}>Q5</span>
        </p>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <svg className="w-full max-w-[280px] h-auto flex-shrink-0 mx-auto lg:mx-0" viewBox="0 0 280 120">
            {miniEdges.map((edge, i) => {
              const from = miniQubits.find(q => q.id === edge.from)!
              const to = miniQubits.find(q => q.id === edge.to)!
              const onPath = isOnPath(edge.from, edge.to)
              return (
                <line
                  key={`edge-${i}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={onPath ? colors.accent : muted.edgeInactive}
                  strokeWidth={onPath ? 2 : 1}
                />
              )
            })}
            {miniEdges.map((edge, i) => {
              const from = miniQubits.find(q => q.id === edge.from)!
              const to = miniQubits.find(q => q.id === edge.to)!
              const onPath = isOnPath(edge.from, edge.to)
              return (
                <text
                  key={`label-${i}`}
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 8}
                  textAnchor="middle"
                  fill={onPath ? muted.textPrimary : muted.textMuted}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {(edge.quality * 100).toFixed(0)}%
                </text>
              )
            })}
            {miniQubits.map((q) => {
              const isEndpoint = q.id === 0 || q.id === 5
              const onPath = currentPath.flat().includes(q.id)
              const nodeEdge = miniEdges.find(e => (e.from === q.id || e.to === q.id) && isOnPath(e.from, e.to))
              const nodeQuality = nodeEdge?.quality ?? 0.9
              const nodeColor = isEndpoint ? colors.accent : getQualityColor(nodeQuality)
              return (
                <g key={q.id}>
                  <circle
                    cx={q.x}
                    cy={q.y}
                    r={isEndpoint ? 13 : 11}
                    fill={onPath || isEndpoint ? nodeColor : muted.nodeInactive}
                  />
                  <text 
                    x={q.x} 
                    y={q.y + 4} 
                    textAnchor="middle" 
                    fill={isEndpoint ? "#000" : (onPath ? getTextColorForQuality(nodeQuality) : "#fff")}
                    fontSize="10" 
                    fontWeight="500"
                    fontFamily="monospace"
                  >
                    {q.id}
                  </text>
                </g>
              )
            })}
          </svg>

          <div className="flex-1 space-y-2 min-w-0">
            <button
              onClick={() => setSelectedPath("short")}
              className="w-full text-left px-3 py-2.5 rounded-md transition-colors"
              style={{ 
                backgroundColor: selectedPath === "short" ? muted.bgMuted : "transparent",
                color: selectedPath === "short" ? muted.textPrimary : muted.textSecondary
              }}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-medium">Short path</span>
                <span className="text-xs font-mono tracking-tight" style={{ color: muted.textSecondary }}>0 → 3 → 5</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: muted.textMuted }}>2 SWAPs · fidelities: 88%, 85%</div>
            </button>

            <button
              onClick={() => setSelectedPath("quality")}
              className="w-full text-left px-3 py-2.5 rounded-md transition-colors"
              style={{ 
                backgroundColor: selectedPath === "quality" ? muted.bgMuted : "transparent",
                color: selectedPath === "quality" ? muted.textPrimary : muted.textSecondary
              }}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-medium">Quality path</span>
                <span className="text-xs font-mono tracking-tight" style={{ color: muted.textSecondary }}>0 → 1 → 2 → 4 → 5</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: muted.textMuted }}>4 SWAPs · fidelities: 97%, 99%, 98%, 96%</div>
            </button>

            <div className="pt-3 flex items-center justify-between">
              <span className="text-xs sm:text-sm" style={{ color: muted.textMuted }}>Total fidelity</span>
              <span className="text-lg sm:text-xl font-mono" style={{ color: selectedPath === "short" ? colors.bad : colors.good }}>
                {((selectedPath === "short" ? shortPathFidelity : qualityPathFidelity) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Fidelity Calculator
// ============================================
export function FidelityCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [gateCount, setGateCount] = useState(50)
  const [gateFidelity, setGateFidelity] = useState(0.99)
  const muted = getMutedColors(isDarkMode)

  const totalFidelity = Math.pow(gateFidelity, gateCount)
  const improvedFidelity = Math.pow(gateFidelity + 0.005, gateCount)
  const improvement = improvedFidelity - totalFidelity

  const sliderTrack = muted.strokeMuted

  return (
    <div className="rounded-lg not-prose" style={{ backgroundColor: muted.bgSubtle }}>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span style={{ color: muted.textSecondary }}>Two-qubit gates</span>
              <span className="font-mono">{gateCount}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={gateCount}
              onChange={(e) => setGateCount(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ 
                background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(gateCount - 10) / 1.9}%, ${sliderTrack} ${(gateCount - 10) / 1.9}%, ${sliderTrack} 100%)`
              }}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span style={{ color: muted.textSecondary }}>Per-gate fidelity</span>
              <span className="font-mono">{(gateFidelity * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.95"
              max="0.999"
              step="0.001"
              value={gateFidelity}
              onChange={(e) => setGateFidelity(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ 
                background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(gateFidelity - 0.95) / 0.049 * 100}%, ${sliderTrack} ${(gateFidelity - 0.95) / 0.049 * 100}%, ${sliderTrack} 100%)`
              }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between pt-2 gap-4">
          <div>
            <p className="text-xs leading-none" style={{ color: muted.textMuted, margin: 0 }}>Circuit fidelity</p>
            <p className="text-xl sm:text-2xl font-mono leading-none" style={{ margin: 0, marginTop: '4px' }}>{(totalFidelity * 100).toFixed(1)}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs leading-none" style={{ color: muted.textMuted, margin: 0 }}>With +0.5% per gate</p>
            <p className="text-xl sm:text-2xl font-mono leading-none" style={{ color: colors.good, margin: 0, marginTop: '4px' }}>{(improvedFidelity * 100).toFixed(1)}%</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm pt-1" style={{ color: muted.textMuted, margin: 0 }}>
          Small improvements compound to <span className="font-mono" style={{ color: colors.good }}>+{(improvement * 100).toFixed(0)}%</span> total
        </p>
      </div>
    </div>
  )
}

// ============================================
// Error Accumulation Visualization
// ============================================
export function ErrorAccumulation({ isDarkMode }: { isDarkMode: boolean }) {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const muted = getMutedColors(isDarkMode)

  const steps = [
    { label: "Start", fidelity: 1.0 },
    { label: "CNOT", fidelity: 0.99 },
    { label: "CNOT", fidelity: 0.98 },
    { label: "SWAP", fidelity: 0.94 },
    { label: "CNOT", fidelity: 0.88 },
    { label: "Measure", fidelity: 0.82 },
  ]

  const currentFidelity = steps[step].fidelity

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setStep(s => (s + 1) % steps.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [steps.length, isPlaying])

  return (
    <div className="rounded-lg not-prose" style={{ backgroundColor: muted.bgSubtle }}>
      <div className="p-4 sm:p-6 overflow-x-auto">
        <svg className="w-full min-w-[400px] h-[60px]" viewBox="0 0 480 60" preserveAspectRatio="xMidYMid meet">
          <line x1="50" y1="30" x2="460" y2="30" stroke={muted.strokeMuted} strokeWidth="1" />
          <text x="20" y="34" fill={muted.strokePrimary} fontSize="11" fontFamily="monospace">|ψ⟩</text>
          
          {steps.slice(1).map((s, i) => {
            const x = 105 + i * 78
            const isVisited = i < step
            const isCurrent = i === step - 1
            const isFuture = !isVisited && !isCurrent
            const boxFill = isCurrent 
              ? colors.accent 
              : (isFuture ? muted.bgSubtle : muted.bgMuted)
            return (
              <g key={i}>
                <rect
                  x={x - 32}
                  y={10}
                  width="64"
                  height="40"
                  rx="4"
                  fill={boxFill}
                  stroke={isCurrent ? "none" : (isFuture ? muted.strokeMuted : muted.edgeInactive)}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={35}
                  textAnchor="middle"
                  fill={isCurrent ? "#000" : (isFuture ? muted.textMuted : muted.textSecondary)}
                  fontSize="11"
                  fontWeight={isCurrent ? "600" : "normal"}
                  fontFamily="monospace"
                >
                  {s.label}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="flex items-end justify-between mt-4 sm:mt-5 gap-4">
          <div>
            <p className="text-xs leading-none" style={{ color: muted.textMuted, margin: 0 }}>Fidelity</p>
            <p className="text-xl sm:text-2xl font-mono leading-none" style={{ color: getQualityColor(currentFidelity), margin: 0, marginTop: '2px' }}>
              {(currentFidelity * 100).toFixed(0)}%
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 sm:p-1 rounded transition-colors"
              style={{ color: muted.textSecondary }}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3 sm:h-3">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3 sm:h-3">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            <div className="flex gap-1 sm:gap-0.5">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setStep(i); setIsPlaying(false); }}
                  className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full transition-colors"
                  style={{ 
                    backgroundColor: i <= step 
                      ? getQualityColor(s.fidelity) 
                      : muted.nodeInactive 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
