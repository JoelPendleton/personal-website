"use client"

import { useState, useEffect } from "react"

// Design tokens matching the site
const colors = {
  accent: "hsl(220, 100%, 70%)", // Blue accent from dithering
  accentDim: "hsl(220, 60%, 50%)",
  good: "hsl(142, 70%, 45%)", // Green for high quality
  bad: "hsl(0, 70%, 50%)", // Red for low quality
  warning: "hsl(45, 80%, 50%)", // Yellow/orange for medium
}

// Get quality color from red (bad) to green (good)
function getQualityColor(quality: number): string {
  // Map 0.85-1.0 quality to hue from 0 (red) to 142 (green)
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
    <div className={`rounded-lg ${isDarkMode ? "bg-white/[0.02]" : "bg-black/[0.02]"}`}>
      <div className="px-6 py-5">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {/* SWAP Gate Symbol */}
            <svg width="140" height="80" viewBox="0 0 140 80">
              <line x1="20" y1="25" x2="120" y2="25" stroke={stroke} strokeWidth="1" />
              <line x1="20" y1="55" x2="120" y2="55" stroke={stroke} strokeWidth="1" />
              
              <text x="12" y="29" fill={stroke} fontSize="13" fontFamily="monospace" textAnchor="end">q₁</text>
              <text x="12" y="59" fill={stroke} fontSize="13" fontFamily="monospace" textAnchor="end">q₂</text>
              
              {/* SWAP X symbols */}
              <line x1="65" y1="20" x2="75" y2="30" stroke={stroke} strokeWidth="1.5" />
              <line x1="75" y1="20" x2="65" y2="30" stroke={stroke} strokeWidth="1.5" />
              <line x1="65" y1="50" x2="75" y2="60" stroke={stroke} strokeWidth="1.5" />
              <line x1="75" y1="50" x2="65" y2="60" stroke={stroke} strokeWidth="1.5" />
              <line x1="70" y1="30" x2="70" y2="50" stroke={stroke} strokeWidth="1" />
            </svg>
            
            <span className="text-xl opacity-40">=</span>
            
            {/* Three CNOT Gates */}
            <svg width={showDecomposition ? "300" : "140"} height="80" viewBox={showDecomposition ? "0 0 300 80" : "0 0 140 80"} className="transition-all duration-300">
              <line x1="20" y1="25" x2={showDecomposition ? "280" : "120"} y2="25" stroke={stroke} strokeWidth="1" />
              <line x1="20" y1="55" x2={showDecomposition ? "280" : "120"} y2="55" stroke={stroke} strokeWidth="1" />
              
              {showDecomposition ? (
                <>
                  {/* CNOT 1 */}
                  <circle cx="70" cy="55" r="4" fill={stroke} />
                  <line x1="70" y1="55" x2="70" y2="25" stroke={stroke} strokeWidth="1" />
                  <circle cx="70" cy="25" r="8" fill="none" stroke={stroke} strokeWidth="1" />
                  <line x1="70" y1="17" x2="70" y2="33" stroke={stroke} strokeWidth="1" />
                  
                  {/* CNOT 2 */}
                  <circle cx="150" cy="25" r="4" fill={stroke} />
                  <line x1="150" y1="25" x2="150" y2="55" stroke={stroke} strokeWidth="1" />
                  <circle cx="150" cy="55" r="8" fill="none" stroke={stroke} strokeWidth="1" />
                  <line x1="150" y1="47" x2="150" y2="63" stroke={stroke} strokeWidth="1" />
                  
                  {/* CNOT 3 */}
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
      <div className={`px-6 py-4 text-sm opacity-60 border-t ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
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

function getQualityOpacity(quality: number): number {
  // Map 0.85-1.0 to 0.3-1.0 opacity
  return 0.3 + (quality - 0.85) * (0.7 / 0.15)
}

export function ConnectivityGraph({ isDarkMode }: { isDarkMode: boolean }) {
  const [hoveredQubit, setHoveredQubit] = useState<number | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<{from: number, to: number} | null>(null)
  const [selectedQubits, setSelectedQubits] = useState<number[]>([])
  
  const stroke = isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"

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

  const connected = isConnected(selectedQubits)

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/[0.02]" : "bg-black/[0.02]"}`}>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <svg width="310" height="170" viewBox="0 0 310 170">
              {/* Edges drawn first (behind nodes) */}
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
                    strokeWidth={isHovered || isSelected ? 3 : 2}
                    opacity={isSelected ? 1 : isHovered ? 0.9 : 0.5}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredEdge(edge)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                )
              })}
              {/* Qubit nodes drawn last (on top of edges) */}
              {TOPOLOGY_QUBITS.map((qubit) => {
                const isSelected = selectedQubits.includes(qubit.id)
                const isHovered = hoveredQubit === qubit.id
                const nodeColor = isSelected ? colors.accent : getQualityColor(qubit.quality)
                return (
                  <g key={qubit.id} onClick={() => toggleQubitSelection(qubit.id)} className="cursor-pointer">
                    <circle
                      cx={qubit.x}
                      cy={qubit.y}
                      r={isHovered || isSelected ? 15 : 13}
                      fill={nodeColor}
                      opacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
                      className="transition-all duration-150"
                      onMouseEnter={() => setHoveredQubit(qubit.id)}
                      onMouseLeave={() => setHoveredQubit(null)}
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
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.bad }} />
                <span className="opacity-70">Low quality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.good }} />
                <span className="opacity-70">High quality</span>
              </div>
            </div>

            <div className={`p-4 rounded ${isDarkMode ? "bg-white/[0.03]" : "bg-black/[0.03]"}`}>
              <p className="opacity-70 mb-2">Select up to 3 qubits</p>
              {selectedQubits.length > 0 ? (
                <>
                  <p className="font-mono">{selectedQubits.map(q => `Q${q}`).join(" → ")}</p>
                  {selectedQubits.length > 1 && (
                    <p className={`mt-1`} style={{ color: connected ? colors.good : colors.bad }}>
                      {connected ? "✓ Connected" : "✗ Not directly connected — needs SWAP"}
                    </p>
                  )}
                </>
              ) : (
                <p className="opacity-50">Click qubits to select</p>
              )}
            </div>

            {(hoveredQubit !== null || hoveredEdge) && (
              <div className="font-mono text-xs opacity-80">
                {hoveredQubit !== null && (
                  <p>Q{hoveredQubit} · T₂ quality: <span style={{ color: getQualityColor(TOPOLOGY_QUBITS[hoveredQubit].quality) }}>{(TOPOLOGY_QUBITS[hoveredQubit].quality * 100).toFixed(0)}%</span></p>
                )}
                {hoveredEdge && (
                  <p>Q{hoveredEdge.from}↔Q{hoveredEdge.to} · Gate fidelity: <span style={{ color: getQualityColor(TOPOLOGY_EDGES.find(e => e.from === hoveredEdge.from && e.to === hoveredEdge.to)!.quality) }}>{(TOPOLOGY_EDGES.find(e => e.from === hoveredEdge.from && e.to === hoveredEdge.to)!.quality * 100).toFixed(0)}%</span></p>
                )}
              </div>
            )}
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
  physicalLabels,
  width = 320, 
  isDarkMode 
}: {
  numQubits: number
  gates: Gate[]
  labels?: string[]
  physicalLabels?: string[]
  width?: number
  isDarkMode: boolean
}) {
  const stroke = isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"
  const strokeDim = isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
  const height = numQubits * 40 + 20
  const gateSpacing = 50
  const startX = physicalLabels ? 70 : 50
  const qubitY = (i: number) => 20 + i * 40

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Qubit lines */}
      {Array.from({ length: numQubits }).map((_, i) => (
        <g key={i}>
          <line x1="30" y1={qubitY(i)} x2={width - 10} y2={qubitY(i)} stroke={strokeDim} strokeWidth="1" />
          {labels && (
            <text x="8" y={qubitY(i) + 4} fill={stroke} fontSize="12" fontFamily="monospace">{labels[i]}</text>
          )}
          {physicalLabels && (
            <text x="28" y={qubitY(i) + 4} fill={strokeDim} fontSize="10" fontFamily="monospace">({physicalLabels[i]})</text>
          )}
        </g>
      ))}

      {/* Gates */}
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

// Mini topology for placement comparison
function PlacementTopology({ 
  highlightQubits, 
  isDarkMode,
  label 
}: { 
  highlightQubits: number[]
  isDarkMode: boolean
  label: string
}) {
  const stroke = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
  
  return (
    <div>
      <svg width="200" height="120" viewBox="0 0 310 170">
        {/* Draw edges first */}
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
              strokeWidth={isSelected ? 2.5 : 1}
              opacity={isSelected ? 1 : 0.2}
            />
          )
        })}
        {/* Draw nodes on top */}
        {TOPOLOGY_QUBITS.map((qubit) => {
          const isSelected = highlightQubits.includes(qubit.id)
          const logicalIdx = highlightQubits.indexOf(qubit.id)
          return (
            <g key={qubit.id}>
              <circle
                cx={qubit.x}
                cy={qubit.y}
                r={isSelected ? 14 : 10}
                fill={isSelected ? colors.accent : (isDarkMode ? "#555" : "#aaa")}
                opacity={isSelected ? 1 : 0.3}
              />
              <text
                x={qubit.x}
                y={qubit.y + 4}
                textAnchor="middle"
                fill={isSelected ? "#000" : (isDarkMode ? "#fff" : "#000")}
                fontSize="10"
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
      <p className="text-xs opacity-60 mt-1 font-mono">{label}</p>
    </div>
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

  const randomHighlight = [0, 3, 10]
  const smartHighlight = [5, 8, 9]

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/[0.02]" : "bg-black/[0.02]"}`}>
      <div className="p-6">
        {/* Original logical circuit */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider opacity-60 mb-3">Logical circuit (input)</p>
          <QuantumCircuit
            numQubits={3}
            gates={originalGates}
            labels={["q₀", "q₁", "q₂"]}
            width={240}
            isDarkMode={isDarkMode}
          />
          <p className="text-xs opacity-50 mt-2">
            The highlighted CNOT requires qubits q₀ and q₂ to be adjacent
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Random placement */}
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-white/[0.03]" : "bg-black/[0.03]"}`}>
            <p className="text-sm font-medium mb-4" style={{ color: colors.bad }}>Random placement</p>
            
            <PlacementTopology 
              highlightQubits={randomHighlight}
              isDarkMode={isDarkMode}
              label="q0→Q0, q1→Q3, q2→Q10"
            />
            
            <p className="text-xs uppercase tracking-wider opacity-60 mt-4 mb-2">After routing</p>
            <QuantumCircuit
              numQubits={4}
              gates={randomRoutedGates}
              labels={["q₀", "q₁", "q₂", ""]}
              width={320}
              isDarkMode={isDarkMode}
            />
            
            <div className="mt-4 pt-3 border-t border-current/10">
              <p className="font-mono text-sm">
                <span className="opacity-60">SWAPs: </span>
                <span style={{ color: colors.bad }}>4</span>
              </p>
              <p className="font-mono text-sm">
                <span className="opacity-60">Fidelity: </span>
                <span style={{ color: colors.bad }}>~52%</span>
              </p>
            </div>
          </div>

          {/* Noise-aware placement */}
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-white/[0.03]" : "bg-black/[0.03]"}`}>
            <p className="text-sm font-medium mb-4" style={{ color: colors.good }}>Noise-aware placement</p>
            
            <PlacementTopology 
              highlightQubits={smartHighlight}
              isDarkMode={isDarkMode}
              label="q0→Q5, q1→Q8, q2→Q9"
            />
            
            <p className="text-xs uppercase tracking-wider opacity-60 mt-4 mb-2">After routing</p>
            <QuantumCircuit
              numQubits={3}
              gates={smartRoutedGates}
              labels={["q₀", "q₁", "q₂"]}
              width={280}
              isDarkMode={isDarkMode}
            />
            
            <div className="mt-4 pt-3 border-t border-current/10">
              <p className="font-mono text-sm">
                <span className="opacity-60">SWAPs: </span>
                <span style={{ color: colors.good }}>1</span>
              </p>
              <p className="font-mono text-sm">
                <span className="opacity-60">Fidelity: </span>
                <span style={{ color: colors.good }}>~89%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={`px-6 py-4 border-t ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
        <p className="text-sm opacity-70">
          Choosing qubits that are already well-connected reduces the number of SWAPs needed, 
          improving overall circuit fidelity by <span className="font-mono" style={{ color: colors.good }}>+37%</span>.
        </p>
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
    <div className={`rounded-lg ${isDarkMode ? "bg-white/[0.02]" : "bg-black/[0.02]"}`}>
      <div className="p-6">
        <p className="text-sm opacity-60 mb-6">
          Moving state from Q0 to Q5. Which path?
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          <svg width="280" height="120" viewBox="0 0 280 120" className="flex-shrink-0">
            {/* Draw edges first (behind nodes) */}
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
                  strokeWidth={onPath ? 2.5 : 1.5}
                  opacity={onPath ? 1 : 0.3}
                />
              )
            })}
            {/* Draw edge labels */}
            {miniEdges.map((edge, i) => {
              const from = miniQubits.find(q => q.id === edge.from)!
              const to = miniQubits.find(q => q.id === edge.to)!
              const onPath = isOnPath(edge.from, edge.to)
              return (
                <text
                  key={`edge-label-${i}`}
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 8}
                  textAnchor="middle"
                  fill={isDarkMode ? "#fff" : "#000"}
                  fontSize="10"
                  fontFamily="monospace"
                  opacity={onPath ? 0.9 : 0.5}
                >
                  {(edge.quality * 100).toFixed(0)}%
                </text>
              )
            })}
            {/* Draw nodes last (on top of edges) */}
            {miniQubits.map((q) => {
              const isEndpoint = q.id === 0 || q.id === 5
              const onPath = currentPath.flat().includes(q.id)
              // Find the edge quality associated with this node if on path
              const nodeEdge = miniEdges.find(e => 
                (e.from === q.id || e.to === q.id) && isOnPath(e.from, e.to)
              )
              const nodeQuality = nodeEdge?.quality ?? 0.9
              const nodeColor = isEndpoint ? colors.accent : getQualityColor(nodeQuality)
              return (
                <g key={q.id}>
                  <circle
                    cx={q.x}
                    cy={q.y}
                    r={isEndpoint ? 14 : 12}
                    fill={onPath || isEndpoint ? nodeColor : (isDarkMode ? "#444" : "#999")}
                    opacity={isEndpoint || onPath ? 1 : 0.4}
                  />
                  <text 
                    x={q.x} 
                    y={q.y + 4} 
                    textAnchor="middle" 
                    fill={isEndpoint || onPath ? "#fff" : (isDarkMode ? "#fff" : "#000")} 
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

          <div className="flex-1 space-y-3">
            <button
              onClick={() => setSelectedPath("short")}
              className={`w-full text-left p-3 rounded transition-all ${
                selectedPath === "short"
                  ? (isDarkMode ? "bg-white/10" : "bg-black/10")
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <div className="text-sm font-medium">Short path</div>
              <div className="text-xs opacity-60 font-mono mt-0.5">0 → 3 → 5 · 2 SWAPs · 88%, 85%</div>
            </button>

            <button
              onClick={() => setSelectedPath("quality")}
              className={`w-full text-left p-3 rounded transition-all ${
                selectedPath === "quality"
                  ? (isDarkMode ? "bg-white/10" : "bg-black/10")
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <div className="text-sm font-medium">Quality path</div>
              <div className="text-xs opacity-60 font-mono mt-0.5">0 → 1 → 2 → 4 → 5 · 4 SWAPs · 97%, 99%, 98%, 96%</div>
            </button>
          </div>
        </div>
      </div>

      <div className={`px-6 py-4 border-t ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="opacity-60">Fidelity: </span>
            <span className="font-mono text-lg" style={{ color: colors.accent }}>
              {((selectedPath === "short" ? shortPathFidelity : qualityPathFidelity) * 100).toFixed(0)}%
            </span>
          </div>
          {selectedPath === "short" && (
            <span className="opacity-60">
              Quality path is {((qualityPathFidelity - shortPathFidelity) * 100).toFixed(0)}% better
            </span>
          )}
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

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/[0.02]" : "bg-black/[0.02]"}`}>
      <div className="p-6 space-y-6">
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

        <div className="flex gap-6">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider opacity-40 mb-1">Circuit fidelity</p>
            <p className="text-2xl font-mono">{(totalFidelity * 100).toFixed(1)}%</p>
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider opacity-40 mb-1">With +0.5% per gate</p>
            <p className="text-2xl font-mono" style={{ color: colors.accent }}>{(improvedFidelity * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className={`px-6 py-4 text-sm opacity-60 border-t ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
        Small per-gate improvements compound to +{((improvedFidelity - totalFidelity) * 100).toFixed(0)}% total fidelity
      </div>
    </div>
  )
}

// ============================================
// Error Accumulation Visualization
// ============================================
export function ErrorAccumulation({ isDarkMode }: { isDarkMode: boolean }) {
  const [step, setStep] = useState(0)

  const steps = [
    { label: "Initial", fidelity: 1.0 },
    { label: "CNOT", fidelity: 0.99 },
    { label: "CNOT", fidelity: 0.98 },
    { label: "SWAP", fidelity: 0.94 },
    { label: "CNOT", fidelity: 0.92 },
    { label: "Measure", fidelity: 0.89 },
  ]

  const currentFidelity = steps[step].fidelity
  const stroke = isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)"
  const strokeDim = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % steps.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <div className={`rounded-lg ${isDarkMode ? "bg-white/[0.02]" : "bg-black/[0.02]"}`}>
      <div className="p-6">
        {/* Circuit */}
        <svg width="100%" height="60" viewBox="0 0 400 60" preserveAspectRatio="xMidYMid meet">
          <line x1="20" y1="30" x2="380" y2="30" stroke={strokeDim} strokeWidth="1" />
          <text x="8" y="34" fill={stroke} fontSize="11" fontFamily="monospace">|ψ⟩</text>
          
          {steps.slice(1).map((s, i) => {
            const x = 70 + i * 60
            const isActive = i < step
            const isCurrent = i === step - 1
            return (
              <g key={i}>
                <rect
                  x={x - 22}
                  y={10}
                  width="44"
                  height="40"
                  rx="3"
                  fill={isCurrent ? colors.accent : (isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")}
                  stroke={isActive ? (isDarkMode ? "#fff" : "#000") : strokeDim}
                  strokeWidth={isCurrent ? 2 : 1}
                  opacity={isActive ? (isCurrent ? 1 : 0.7) : 0.4}
                />
                <text
                  x={x}
                  y={34}
                  textAnchor="middle"
                  fill={isCurrent ? "#000" : (isDarkMode ? "#fff" : "#000")}
                  fontSize="10"
                  fontWeight={isCurrent ? "600" : "normal"}
                  fontFamily="monospace"
                  opacity={isActive ? 1 : 0.6}
                >
                  {s.label}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Fidelity display */}
        <div className="flex items-end justify-between mt-6">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Fidelity</p>
            <p className="text-3xl font-mono" style={{ color: currentFidelity < 0.95 ? colors.bad : colors.good }}>
              {(currentFidelity * 100).toFixed(0)}%
            </p>
          </div>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? "bg-current" : "bg-current/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
