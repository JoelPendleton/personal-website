"use client"

import { useState, useEffect } from "react"

// Design tokens matching the site
const colors = {
  accent: "hsl(220, 100%, 70%)",
  good: "hsl(142, 70%, 45%)",
  bad: "hsl(0, 70%, 50%)",
}

// Get quality color from red (bad) to green (good)
function getQualityColor(quality: number): string {
  const normalizedQuality = Math.max(0, Math.min(1, (quality - 0.85) / 0.15))
  const hue = normalizedQuality * 142
  return `hsl(${hue}, 70%, 50%)`
}

// ============================================
// SWAP Gate Decomposition Visualizer
// ============================================
export function SwapGateVisualizer({ isDarkMode }: { isDarkMode: boolean }) {
  const [showDecomposition, setShowDecomposition] = useState(false)
  
  const stroke = isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)"
  const strokeDim = isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
      <div className="px-6 py-5">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <svg width="140" height="80" viewBox="0 0 140 80">
              <line x1="20" y1="25" x2="120" y2="25" stroke={stroke} strokeWidth="1" />
              <line x1="20" y1="55" x2="120" y2="55" stroke={stroke} strokeWidth="1" />
              <text x="12" y="29" fill={stroke} fontSize="13" fontFamily="monospace" textAnchor="end">q₁</text>
              <text x="12" y="59" fill={stroke} fontSize="13" fontFamily="monospace" textAnchor="end">q₂</text>
              <line x1="65" y1="20" x2="75" y2="30" stroke={stroke} strokeWidth="1.5" />
              <line x1="75" y1="20" x2="65" y2="30" stroke={stroke} strokeWidth="1.5" />
              <line x1="65" y1="50" x2="75" y2="60" stroke={stroke} strokeWidth="1.5" />
              <line x1="75" y1="50" x2="65" y2="60" stroke={stroke} strokeWidth="1.5" />
              <line x1="70" y1="30" x2="70" y2="50" stroke={stroke} strokeWidth="1" />
            </svg>
            
            <span className="text-xl opacity-40">=</span>
            
            <svg width={showDecomposition ? "300" : "140"} height="80" viewBox={showDecomposition ? "0 0 300 80" : "0 0 140 80"} className="transition-all duration-300">
              <line x1="20" y1="25" x2={showDecomposition ? "280" : "120"} y2="25" stroke={stroke} strokeWidth="1" />
              <line x1="20" y1="55" x2={showDecomposition ? "280" : "120"} y2="55" stroke={stroke} strokeWidth="1" />
              {showDecomposition ? (
                <>
                  <circle cx="70" cy="55" r="4" fill={stroke} />
                  <line x1="70" y1="55" x2="70" y2="25" stroke={stroke} strokeWidth="1" />
                  <circle cx="70" cy="25" r="8" fill="none" stroke={stroke} strokeWidth="1" />
                  <line x1="70" y1="17" x2="70" y2="33" stroke={stroke} strokeWidth="1" />
                  <circle cx="150" cy="25" r="4" fill={stroke} />
                  <line x1="150" y1="25" x2="150" y2="55" stroke={stroke} strokeWidth="1" />
                  <circle cx="150" cy="55" r="8" fill="none" stroke={stroke} strokeWidth="1" />
                  <line x1="150" y1="47" x2="150" y2="63" stroke={stroke} strokeWidth="1" />
                  <circle cx="230" cy="55" r="4" fill={stroke} />
                  <line x1="230" y1="55" x2="230" y2="25" stroke={stroke} strokeWidth="1" />
                  <circle cx="230" cy="25" r="8" fill="none" stroke={stroke} strokeWidth="1" />
                  <line x1="230" y1="17" x2="230" y2="33" stroke={stroke} strokeWidth="1" />
                </>
              ) : (
                <text x="70" y="44" fill={strokeDim} fontSize="13" textAnchor="middle" fontFamily="monospace">3 × CNOT</text>
              )}
            </svg>
          </div>
          
          <button
            onClick={() => setShowDecomposition(!showDecomposition)}
            className={`text-sm transition-opacity hover:opacity-70 ${isDarkMode ? "text-white/60" : "text-black/60"}`}
          >
            {showDecomposition ? "← Collapse" : "Show decomposition →"}
          </button>
        </div>
      </div>
      <div className={`px-6 py-4 text-sm opacity-50`}>
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

const TOPOLOGY_QUBITS: QubitNode[] = [
  { id: 0, x: 50, y: 35, quality: 0.95 },
  { id: 1, x: 120, y: 35, quality: 0.92 },
  { id: 2, x: 190, y: 35, quality: 0.98 },
  { id: 3, x: 260, y: 35, quality: 0.91 },
  { id: 4, x: 85, y: 85, quality: 0.88 },
  { id: 5, x: 155, y: 85, quality: 0.96 },
  { id: 6, x: 225, y: 85, quality: 0.94 },
  { id: 7, x: 50, y: 135, quality: 0.97 },
  { id: 8, x: 120, y: 135, quality: 0.93 },
  { id: 9, x: 190, y: 135, quality: 0.99 },
  { id: 10, x: 260, y: 135, quality: 0.90 },
]

const TOPOLOGY_EDGES: QubitEdge[] = [
  { from: 0, to: 1, quality: 0.97 },
  { from: 1, to: 2, quality: 0.92 },
  { from: 2, to: 3, quality: 0.95 },
  { from: 0, to: 4, quality: 0.88 },
  { from: 1, to: 5, quality: 0.94 },
  { from: 2, to: 6, quality: 0.96 },
  { from: 4, to: 5, quality: 0.91 },
  { from: 5, to: 6, quality: 0.99 },
  { from: 4, to: 7, quality: 0.93 },
  { from: 4, to: 8, quality: 0.87 },
  { from: 5, to: 8, quality: 0.95 },
  { from: 5, to: 9, quality: 0.98 },
  { from: 6, to: 9, quality: 0.94 },
  { from: 6, to: 10, quality: 0.89 },
  { from: 7, to: 8, quality: 0.96 },
  { from: 8, to: 9, quality: 0.97 },
  { from: 9, to: 10, quality: 0.92 },
]

export function ConnectivityGraph({ isDarkMode }: { isDarkMode: boolean }) {
  const [hoveredQubit, setHoveredQubit] = useState<number | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<{from: number, to: number} | null>(null)
  const [selectedQubits, setSelectedQubits] = useState<number[]>([])
  const [lastHovered, setLastHovered] = useState<{ type: 'qubit' | 'edge', qubit?: number, edge?: {from: number, to: number} } | null>(null)

  // Update last hovered when hovering changes
  const handleQubitHover = (id: number | null) => {
    setHoveredQubit(id)
    if (id !== null) {
      setLastHovered({ type: 'qubit', qubit: id })
    }
  }

  const handleEdgeHover = (edge: {from: number, to: number} | null) => {
    setHoveredEdge(edge)
    if (edge !== null) {
      setLastHovered({ type: 'edge', edge })
    }
  }

  const toggleQubitSelection = (id: number) => {
    if (selectedQubits.includes(id)) {
      setSelectedQubits(selectedQubits.filter(q => q !== id))
    } else if (selectedQubits.length < 3) {
      setSelectedQubits([...selectedQubits, id])
    }
  }

  const isConnected = (qubits: number[]): boolean => {
    if (qubits.length <= 1) return true
    const edges = TOPOLOGY_EDGES.filter(e => 
      qubits.includes(e.from) && qubits.includes(e.to)
    )
    return edges.length >= qubits.length - 1
  }

  // BFS to find shortest path between two qubits
  const findShortestPath = (start: number, end: number): number[] | null => {
    if (start === end) return [start]
    const queue: number[][] = [[start]]
    const visited = new Set<number>([start])
    
    while (queue.length > 0) {
      const path = queue.shift()!
      const current = path[path.length - 1]
      
      // Find neighbors
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

  // Calculate SWAP info for non-connected selections
  const getSwapInfo = (): { swaps: number; via: number[] } | null => {
    if (selectedQubits.length !== 2) return null
    const path = findShortestPath(selectedQubits[0], selectedQubits[1])
    if (!path || path.length <= 2) return null
    return {
      swaps: path.length - 2,
      via: path.slice(1, -1)
    }
  }

  const connected = isConnected(selectedQubits)
  const swapInfo = !connected ? getSwapInfo() : null

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <svg width="310" height="170" viewBox="0 0 310 170">
              {TOPOLOGY_EDGES.map((edge, i) => {
                const fromQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.from)!
                const toQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.to)!
                const isHovered = hoveredEdge?.from === edge.from && hoveredEdge?.to === edge.to
                const isSelected = selectedQubits.includes(edge.from) && selectedQubits.includes(edge.to)
                return (
                  <line
                    key={i}
                    x1={fromQubit.x}
                    y1={fromQubit.y}
                    x2={toQubit.x}
                    y2={toQubit.y}
                    stroke={isSelected ? colors.accent : getQualityColor(edge.quality)}
                    strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                    opacity={isSelected ? 1 : isHovered ? 0.9 : 0.5}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => handleEdgeHover(edge)}
                    onMouseLeave={() => handleEdgeHover(null)}
                  />
                )
              })}
              {TOPOLOGY_QUBITS.map((qubit) => {
                const isSelected = selectedQubits.includes(qubit.id)
                const isHovered = hoveredQubit === qubit.id
                const nodeColor = isSelected ? colors.accent : getQualityColor(qubit.quality)
                return (
                  <g key={qubit.id} onClick={() => toggleQubitSelection(qubit.id)} className="cursor-pointer">
                    <circle
                      cx={qubit.x}
                      cy={qubit.y}
                      r={isHovered || isSelected ? 14 : 12}
                      fill={nodeColor}
                      opacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
                      className="transition-all duration-150"
                      onMouseEnter={() => handleQubitHover(qubit.id)}
                      onMouseLeave={() => handleQubitHover(null)}
                    />
                    <text
                      x={qubit.x}
                      y={qubit.y + 4}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="11"
                      fontWeight="500"
                      fontFamily="monospace"
                      className="pointer-events-none select-none"
                    >
                      {qubit.id}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
          
          <div className="flex-1 text-sm space-y-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.bad }} />
                <span className="opacity-60">Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.good }} />
                <span className="opacity-60">High</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="opacity-50 text-xs">Select up to 3 qubits</p>
                {selectedQubits.length > 0 && (
                  <button
                    onClick={() => setSelectedQubits([])}
                    className={`text-xs px-2 py-0.5 rounded transition-opacity hover:opacity-80 ${isDarkMode ? "bg-white/10 text-white/60" : "bg-black/10 text-black/60"}`}
                  >
                    Clear
                  </button>
                )}
              </div>
              {selectedQubits.length > 0 ? (
                <>
                  <p className="font-mono">
                    {selectedQubits.map((q, i) => {
                      const qubit = TOPOLOGY_QUBITS.find(qb => qb.id === q)!
                      return (
                        <span key={q}>
                          {i > 0 && <span className="opacity-40"> → </span>}
                          <span>Q{q}</span>
                          <span className="opacity-50 text-xs ml-1">({(qubit.quality * 100).toFixed(0)}%)</span>
                        </span>
                      )
                    })}
                  </p>
                  {selectedQubits.length > 1 && (
                    <p className="text-sm mt-1" style={{ color: connected ? colors.good : colors.bad }}>
                      {connected 
                        ? "Connected" 
                        : swapInfo 
                          ? `Not connected — needs ${swapInfo.swaps} SWAP${swapInfo.swaps > 1 ? 's' : ''} (via ${swapInfo.via.map(q => `Q${q}`).join(', ')})`
                          : "Not connected — needs SWAP"}
                    </p>
                  )}
                </>
              ) : (
                <div className={`px-3 py-2 rounded border border-dashed ${isDarkMode ? "border-white/20" : "border-black/20"}`}>
                  <p className="opacity-50 text-sm">Click qubits in the graph to select them</p>
                </div>
              )}
            </div>

            {/* Info panel - shows active hover or last hovered */}
            <div className={`font-mono text-xs transition-opacity ${hoveredQubit !== null || hoveredEdge ? "opacity-80" : "opacity-50"}`}>
              {hoveredQubit !== null ? (
                <p>Q{hoveredQubit}: <span style={{ color: getQualityColor(TOPOLOGY_QUBITS[hoveredQubit].quality) }}>{(TOPOLOGY_QUBITS[hoveredQubit].quality * 100).toFixed(0)}%</span> fidelity</p>
              ) : hoveredEdge ? (
                <p>Q{hoveredEdge.from}↔Q{hoveredEdge.to}: <span style={{ color: getQualityColor(TOPOLOGY_EDGES.find(e => e.from === hoveredEdge.from && e.to === hoveredEdge.to)!.quality) }}>{(TOPOLOGY_EDGES.find(e => e.from === hoveredEdge.from && e.to === hoveredEdge.to)!.quality * 100).toFixed(0)}%</span> gate fidelity</p>
              ) : lastHovered?.type === 'qubit' && lastHovered.qubit !== undefined ? (
                <p>Q{lastHovered.qubit}: <span style={{ color: getQualityColor(TOPOLOGY_QUBITS[lastHovered.qubit].quality) }}>{(TOPOLOGY_QUBITS[lastHovered.qubit].quality * 100).toFixed(0)}%</span> fidelity</p>
              ) : lastHovered?.type === 'edge' && lastHovered.edge ? (
                <p>Q{lastHovered.edge.from}↔Q{lastHovered.edge.to}: <span style={{ color: getQualityColor(TOPOLOGY_EDGES.find(e => e.from === lastHovered.edge!.from && e.to === lastHovered.edge!.to)!.quality) }}>{(TOPOLOGY_EDGES.find(e => e.from === lastHovered.edge!.from && e.to === lastHovered.edge!.to)!.quality * 100).toFixed(0)}%</span> gate fidelity</p>
              ) : (
                <p className="opacity-60">Hover over qubits or edges to see quality</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const stroke = isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"
  const strokeDim = isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
  const height = numQubits * 40 + 20
  const gateSpacing = 50
  const startX = 50
  const qubitY = (i: number) => 20 + i * 40

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: numQubits }).map((_, i) => (
        <g key={i}>
          <line x1="30" y1={qubitY(i)} x2={width - 10} y2={qubitY(i)} stroke={strokeDim} strokeWidth="1" />
          {labels && (
            <text x="8" y={qubitY(i) + 4} fill={stroke} fontSize="12" fontFamily="monospace">{labels[i]}</text>
          )}
        </g>
      ))}
      {gates.map((gate, gateIdx) => {
        const x = startX + gateIdx * gateSpacing
        const gateStroke = gate.highlight ? colors.accent : stroke

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
  const stroke = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
  
  return (
    <svg width="280" height="155" viewBox="0 0 310 170">
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
            stroke={isSelected ? colors.accent : stroke}
            strokeWidth={isSelected ? 2 : 1}
            opacity={isSelected ? 1 : 0.2}
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
              fill={isSelected ? colors.accent : (isDarkMode ? "#555" : "#aaa")}
              opacity={isSelected ? 1 : 0.4}
            />
            <text
              x={qubit.x}
              y={qubit.y + 4}
              textAnchor="middle"
              fill={isSelected ? "#000" : (isDarkMode ? "#fff" : "#000")}
              fontSize="12"
              fontWeight={isSelected ? "600" : "normal"}
              fontFamily="monospace"
              opacity={isSelected ? 1 : 0.6}
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
    <div className={`rounded-lg ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
      <div className="p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider opacity-50 mb-3">Input circuit</p>
          <QuantumCircuit numQubits={3} gates={originalGates} labels={["q₀", "q₁", "q₂"]} width={220} isDarkMode={isDarkMode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.bad }} />
              <span className="text-sm" style={{ color: colors.bad }}>Random</span>
            </div>
            <PlacementTopology highlightQubits={[0, 3, 10]} isDarkMode={isDarkMode} />
            <div className="mt-3 overflow-x-auto">
              <QuantumCircuit numQubits={4} gates={randomRoutedGates} labels={["q₀", "q₁", "q₂", ""]} width={300} isDarkMode={isDarkMode} />
            </div>
            <div className="mt-3 flex gap-6 text-sm font-mono">
              <span><span className="opacity-50">SWAPs:</span> <span style={{ color: colors.bad }}>4</span></span>
              <span><span className="opacity-50">Fidelity:</span> <span style={{ color: colors.bad }}>~52%</span></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.good }} />
              <span className="text-sm" style={{ color: colors.good }}>Noise-aware</span>
            </div>
            <PlacementTopology highlightQubits={[5, 8, 9]} isDarkMode={isDarkMode} />
            <div className="mt-3">
              <QuantumCircuit numQubits={3} gates={smartRoutedGates} labels={["q₀", "q₁", "q₂"]} width={260} isDarkMode={isDarkMode} />
            </div>
            <div className="mt-3 flex gap-6 text-sm font-mono">
              <span><span className="opacity-50">SWAPs:</span> <span style={{ color: colors.good }}>1</span></span>
              <span><span className="opacity-50">Fidelity:</span> <span style={{ color: colors.good }}>~89%</span></span>
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

  const stroke = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"

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
    <div className={`rounded-lg ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
      <div className="p-6">
        <p className="text-sm opacity-60 mb-5">
          Moving state from <span className="font-mono" style={{ color: colors.accent }}>Q0</span> to <span className="font-mono" style={{ color: colors.accent }}>Q5</span>
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          <svg width="280" height="120" viewBox="0 0 280 120" className="flex-shrink-0">
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
                  stroke={onPath ? colors.accent : stroke}
                  strokeWidth={onPath ? 2 : 1}
                  opacity={onPath ? 1 : 0.25}
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
                  fill={isDarkMode ? "#fff" : "#000"}
                  fontSize="10"
                  fontFamily="monospace"
                  opacity={onPath ? 0.8 : 0.4}
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
                    fill={onPath || isEndpoint ? nodeColor : (isDarkMode ? "#444" : "#999")}
                    opacity={isEndpoint || onPath ? 1 : 0.35}
                  />
                  <text 
                    x={q.x} 
                    y={q.y + 4} 
                    textAnchor="middle" 
                    fill="#fff"
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

          <div className="flex-1 space-y-2">
            <button
              onClick={() => setSelectedPath("short")}
              className={`w-full text-left px-3 py-2.5 rounded-md transition-all ${
                selectedPath === "short" ? (isDarkMode ? "bg-white/10" : "bg-black/10") : "opacity-50 hover:opacity-80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Short path</span>
                <span className="text-xs font-mono opacity-60">0→3→5</span>
              </div>
              <div className="text-xs opacity-50 mt-0.5">2 SWAPs · fidelities: 88%, 85%</div>
            </button>

            <button
              onClick={() => setSelectedPath("quality")}
              className={`w-full text-left px-3 py-2.5 rounded-md transition-all ${
                selectedPath === "quality" ? (isDarkMode ? "bg-white/10" : "bg-black/10") : "opacity-50 hover:opacity-80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quality path</span>
                <span className="text-xs font-mono opacity-60">0→1→2→4→5</span>
              </div>
              <div className="text-xs opacity-50 mt-0.5">4 SWAPs · fidelities: 97%, 99%, 98%, 96%</div>
            </button>

            <div className="pt-3 flex items-center justify-between">
              <span className="text-sm opacity-50">Total fidelity</span>
              <span className="text-xl font-mono" style={{ color: selectedPath === "short" ? colors.bad : colors.good }}>
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

  const totalFidelity = Math.pow(gateFidelity, gateCount)
  const improvedFidelity = Math.pow(gateFidelity + 0.005, gateCount)
  const improvement = improvedFidelity - totalFidelity

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
      <div className="p-6 space-y-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="opacity-60">Two-qubit gates</span>
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
                background: isDarkMode 
                  ? `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(gateCount - 10) / 1.9}%, rgba(255,255,255,0.1) ${(gateCount - 10) / 1.9}%, rgba(255,255,255,0.1) 100%)`
                  : `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(gateCount - 10) / 1.9}%, rgba(0,0,0,0.1) ${(gateCount - 10) / 1.9}%, rgba(0,0,0,0.1) 100%)`
              }}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="opacity-60">Per-gate fidelity</span>
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
                background: isDarkMode 
                  ? `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(gateFidelity - 0.95) / 0.049 * 100}%, rgba(255,255,255,0.1) ${(gateFidelity - 0.95) / 0.049 * 100}%, rgba(255,255,255,0.1) 100%)`
                  : `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(gateFidelity - 0.95) / 0.049 * 100}%, rgba(0,0,0,0.1) ${(gateFidelity - 0.95) / 0.049 * 100}%, rgba(0,0,0,0.1) 100%)`
              }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-xs opacity-50 mb-1">Circuit fidelity</p>
            <p className="text-2xl font-mono">{(totalFidelity * 100).toFixed(1)}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-50 mb-1">With +0.5% per gate</p>
            <p className="text-2xl font-mono" style={{ color: colors.good }}>{(improvedFidelity * 100).toFixed(1)}%</p>
          </div>
        </div>

        <p className="text-sm opacity-50 pt-1">
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

  const steps = [
    { label: "Start", fidelity: 1.0 },
    { label: "CNOT", fidelity: 0.99 },
    { label: "CNOT", fidelity: 0.98 },
    { label: "SWAP", fidelity: 0.94 },
    { label: "CNOT", fidelity: 0.92 },
    { label: "Measure", fidelity: 0.89 },
  ]

  const currentFidelity = steps[step].fidelity
  const stroke = isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)"
  const strokeDim = isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setStep(s => (s + 1) % steps.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [steps.length, isPlaying])

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
      <div className="p-6">
        <svg width="100%" height="60" viewBox="0 0 480 60" preserveAspectRatio="xMidYMid meet">
          <line x1="50" y1="30" x2="460" y2="30" stroke={strokeDim} strokeWidth="1" />
          <text x="20" y="34" fill={stroke} fontSize="11" fontFamily="monospace">|ψ⟩</text>
          
          {steps.slice(1).map((s, i) => {
            const x = 100 + i * 70
            const isActive = i < step
            const isCurrent = i === step - 1
            const boxFill = isCurrent 
              ? colors.accent 
              : (isDarkMode ? "#1a1a1a" : "#f0f0f0")
            return (
              <g key={i}>
                <rect
                  x={x - 27}
                  y={10}
                  width="54"
                  height="40"
                  rx="4"
                  fill={boxFill}
                  stroke={isActive ? (isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)") : strokeDim}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={35}
                  textAnchor="middle"
                  fill={isCurrent ? "#000" : (isDarkMode ? "#fff" : "#000")}
                  fontSize="11"
                  fontWeight={isCurrent ? "600" : "normal"}
                  fontFamily="monospace"
                  opacity={isActive ? 1 : 0.5}
                >
                  {s.label}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="flex items-end justify-between mt-5">
          <div>
            <p className="text-xs opacity-50 mb-1">Fidelity</p>
            <p className="text-2xl font-mono" style={{ color: currentFidelity < 0.95 ? colors.bad : colors.good }}>
              {(currentFidelity * 100).toFixed(0)}%
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1 rounded transition-all opacity-50 hover:opacity-100`}
            >
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            <div className="flex gap-0.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setStep(i); setIsPlaying(false); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === step ? "opacity-100" : "opacity-30 hover:opacity-60"
                  }`}
                  style={{ backgroundColor: i <= step ? (currentFidelity < 0.95 ? colors.bad : colors.good) : (isDarkMode ? "#fff" : "#000") }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
