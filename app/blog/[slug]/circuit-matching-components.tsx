"use client"

import { useState, useEffect, useCallback } from "react"

// ============================================
// SWAP Gate Decomposition Visualizer
// Shows that SWAP = 3 CNOTs
// ============================================
export function SwapGateVisualizer({ isDarkMode }: { isDarkMode: boolean }) {
  const [showDecomposition, setShowDecomposition] = useState(false)
  
  const strokeColor = isDarkMode ? "#fff" : "#000"
  const bgColor = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
      <h4 className="text-sm font-medium mb-4 opacity-75">Interactive: SWAP Gate Decomposition</h4>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* SWAP Gate Symbol */}
          <svg width="120" height="80" viewBox="0 0 120 80">
            {/* Qubit lines */}
            <line x1="10" y1="25" x2="110" y2="25" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="10" y1="55" x2="110" y2="55" stroke={strokeColor} strokeWidth="1.5" />
            
            {/* Labels */}
            <text x="5" y="29" fill={strokeColor} fontSize="12" textAnchor="end">q₁</text>
            <text x="5" y="59" fill={strokeColor} fontSize="12" textAnchor="end">q₂</text>
            
            {/* SWAP symbol (X's connected) */}
            <line x1="55" y1="20" x2="65" y2="30" stroke={strokeColor} strokeWidth="2" />
            <line x1="65" y1="20" x2="55" y2="30" stroke={strokeColor} strokeWidth="2" />
            <line x1="55" y1="50" x2="65" y2="60" stroke={strokeColor} strokeWidth="2" />
            <line x1="65" y1="50" x2="55" y2="60" stroke={strokeColor} strokeWidth="2" />
            <line x1="60" y1="30" x2="60" y2="50" stroke={strokeColor} strokeWidth="1.5" />
          </svg>
          
          <span className="text-2xl">=</span>
          
          {/* Three CNOT Gates */}
          <svg width={showDecomposition ? "280" : "120"} height="80" viewBox={showDecomposition ? "0 0 280 80" : "0 0 120 80"}>
            {/* Qubit lines */}
            <line x1="10" y1="25" x2={showDecomposition ? "270" : "110"} y2="25" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="10" y1="55" x2={showDecomposition ? "270" : "110"} y2="55" stroke={strokeColor} strokeWidth="1.5" />
            
            {showDecomposition ? (
              <>
                {/* CNOT 1: control on q2, target on q1 */}
                <circle cx="60" cy="55" r="5" fill={strokeColor} />
                <line x1="60" y1="55" x2="60" y2="25" stroke={strokeColor} strokeWidth="1.5" />
                <circle cx="60" cy="25" r="10" fill="none" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="60" y1="15" x2="60" y2="35" stroke={strokeColor} strokeWidth="1.5" />
                
                {/* CNOT 2: control on q1, target on q2 */}
                <circle cx="140" cy="25" r="5" fill={strokeColor} />
                <line x1="140" y1="25" x2="140" y2="55" stroke={strokeColor} strokeWidth="1.5" />
                <circle cx="140" cy="55" r="10" fill="none" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="140" y1="45" x2="140" y2="65" stroke={strokeColor} strokeWidth="1.5" />
                
                {/* CNOT 3: control on q2, target on q1 */}
                <circle cx="220" cy="55" r="5" fill={strokeColor} />
                <line x1="220" y1="55" x2="220" y2="25" stroke={strokeColor} strokeWidth="1.5" />
                <circle cx="220" cy="25" r="10" fill="none" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="220" y1="15" x2="220" y2="35" stroke={strokeColor} strokeWidth="1.5" />
              </>
            ) : (
              <text x="60" y="45" fill={strokeColor} fontSize="14" textAnchor="middle">3 × CNOT</text>
            )}
          </svg>
        </div>
        
        <button
          onClick={() => setShowDecomposition(!showDecomposition)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isDarkMode 
              ? "bg-white/10 hover:bg-white/20" 
              : "bg-black/10 hover:bg-black/20"
          }`}
        >
          {showDecomposition ? "Hide Decomposition" : "Show CNOT Decomposition"}
        </button>
        
        <p className="text-sm opacity-75 text-center max-w-md">
          A SWAP gate exchanges quantum states between two qubits. It decomposes into 3 CNOT gates, 
          meaning each SWAP inherits the error of three two-qubit operations.
        </p>
      </div>
    </div>
  )
}

// ============================================
// Qubit Topology with Circuit Placement
// ============================================
interface QubitNode {
  id: number
  x: number
  y: number
  fidelity: number
  label?: string
}

interface QubitEdge {
  from: number
  to: number
  fidelity: number
}

// Heavy-hex inspired topology
const TOPOLOGY_QUBITS: QubitNode[] = [
  { id: 0, x: 60, y: 40, fidelity: 0.95 },
  { id: 1, x: 140, y: 40, fidelity: 0.92 },
  { id: 2, x: 220, y: 40, fidelity: 0.98 },
  { id: 3, x: 300, y: 40, fidelity: 0.91 },
  { id: 4, x: 100, y: 100, fidelity: 0.88 },
  { id: 5, x: 180, y: 100, fidelity: 0.96 },
  { id: 6, x: 260, y: 100, fidelity: 0.94 },
  { id: 7, x: 60, y: 160, fidelity: 0.97 },
  { id: 8, x: 140, y: 160, fidelity: 0.93 },
  { id: 9, x: 220, y: 160, fidelity: 0.99 },
  { id: 10, x: 300, y: 160, fidelity: 0.90 },
]

const TOPOLOGY_EDGES: QubitEdge[] = [
  { from: 0, to: 1, fidelity: 0.97 },
  { from: 1, to: 2, fidelity: 0.92 },
  { from: 2, to: 3, fidelity: 0.95 },
  { from: 0, to: 4, fidelity: 0.88 },
  { from: 1, to: 5, fidelity: 0.94 },
  { from: 2, to: 6, fidelity: 0.96 },
  { from: 4, to: 5, fidelity: 0.91 },
  { from: 5, to: 6, fidelity: 0.99 },
  { from: 4, to: 7, fidelity: 0.93 },
  { from: 4, to: 8, fidelity: 0.87 },
  { from: 5, to: 8, fidelity: 0.95 },
  { from: 5, to: 9, fidelity: 0.98 },
  { from: 6, to: 9, fidelity: 0.94 },
  { from: 6, to: 10, fidelity: 0.89 },
  { from: 7, to: 8, fidelity: 0.96 },
  { from: 8, to: 9, fidelity: 0.97 },
  { from: 9, to: 10, fidelity: 0.92 },
]

function getFidelityColor(fidelity: number): string {
  if (fidelity >= 0.95) return "hsl(120, 70%, 45%)"
  if (fidelity >= 0.90) return "hsl(45, 80%, 50%)"
  return "hsl(0, 70%, 50%)"
}

export function ConnectivityGraph({ isDarkMode }: { isDarkMode: boolean }) {
  const [hoveredQubit, setHoveredQubit] = useState<number | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<{from: number, to: number} | null>(null)
  const [selectedQubits, setSelectedQubits] = useState<number[]>([])
  
  const strokeColor = isDarkMode ? "#fff" : "#000"

  const toggleQubitSelection = (id: number) => {
    if (selectedQubits.includes(id)) {
      setSelectedQubits(selectedQubits.filter(q => q !== id))
    } else if (selectedQubits.length < 3) {
      setSelectedQubits([...selectedQubits, id])
    }
  }

  // Calculate if selected qubits form a connected path
  const isConnected = (qubits: number[]): boolean => {
    if (qubits.length <= 1) return true
    const edges = TOPOLOGY_EDGES.filter(e => 
      qubits.includes(e.from) && qubits.includes(e.to)
    )
    return edges.length >= qubits.length - 1
  }

  const connected = isConnected(selectedQubits)

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
      <h4 className="text-sm font-medium mb-4 opacity-75">Interactive: Qubit Topology &amp; Connectivity</h4>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <svg width="360" height="200" viewBox="0 0 360 200" className="w-full max-w-md">
            {/* Edges */}
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
                  stroke={isSelected ? "hsl(220, 100%, 60%)" : getFidelityColor(edge.fidelity)}
                  strokeWidth={isHovered || isSelected ? 4 : 2}
                  opacity={isHovered || isSelected ? 1 : 0.5}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredEdge(edge)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
              )
            })}
            {/* Qubit nodes */}
            {TOPOLOGY_QUBITS.map((qubit) => {
              const isSelected = selectedQubits.includes(qubit.id)
              const isHovered = hoveredQubit === qubit.id
              return (
                <g key={qubit.id} onClick={() => toggleQubitSelection(qubit.id)} className="cursor-pointer">
                  <circle
                    cx={qubit.x}
                    cy={qubit.y}
                    r={isHovered || isSelected ? 18 : 14}
                    fill={isSelected ? "hsl(220, 100%, 60%)" : getFidelityColor(qubit.fidelity)}
                    stroke={isSelected ? "#fff" : "none"}
                    strokeWidth={2}
                    className="transition-all"
                    onMouseEnter={() => setHoveredQubit(qubit.id)}
                    onMouseLeave={() => setHoveredQubit(null)}
                  />
                  <text
                    x={qubit.x}
                    y={qubit.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    Q{qubit.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        
        <div className="flex-1 text-sm space-y-4">
          <div>
            <p className="font-medium mb-2">Legend (Node/Edge Quality)</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(120, 70%, 45%)" }} />
                <span>High (≥95%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(45, 80%, 50%)" }} />
                <span>Medium (90-95%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(0, 70%, 50%)" }} />
                <span>Low (&lt;90%)</span>
              </div>
            </div>
          </div>

          <div className={`p-3 rounded ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
            <p className="font-medium mb-1">Click to select qubits (max 3)</p>
            {selectedQubits.length > 0 ? (
              <>
                <p>Selected: Q{selectedQubits.join(", Q")}</p>
                {selectedQubits.length > 1 && (
                  <p className={connected ? "text-green-400" : "text-red-400"}>
                    {connected ? "✓ Connected" : "✗ Not directly connected - needs SWAP"}
                  </p>
                )}
              </>
            ) : (
              <p className="opacity-75">Select qubits to see connectivity</p>
            )}
          </div>

          {hoveredQubit !== null && (
            <div className={`p-3 rounded ${isDarkMode ? "bg-white/10" : "bg-black/10"}`}>
              <strong>Qubit {hoveredQubit}</strong><br />
              T₂ Quality: {(TOPOLOGY_QUBITS[hoveredQubit].fidelity * 100).toFixed(1)}%
            </div>
          )}
          {hoveredEdge && (
            <div className={`p-3 rounded ${isDarkMode ? "bg-white/10" : "bg-black/10"}`}>
              <strong>Edge Q{hoveredEdge.from}↔Q{hoveredEdge.to}</strong><br />
              Gate Fidelity: {(TOPOLOGY_EDGES.find(e => e.from === hoveredEdge.from && e.to === hoveredEdge.to)!.fidelity * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Circuit Diagram Component
// ============================================
interface Gate {
  type: "cnot" | "swap" | "h" | "x"
  qubits: number[]
  highlight?: "red" | "blue" | "green"
}

interface CircuitProps {
  numQubits: number
  gates: Gate[]
  qubitLabels?: string[]
  physicalLabels?: string[]
  width?: number
  isDarkMode: boolean
  title?: string
}

function QuantumCircuit({ numQubits, gates, qubitLabels, physicalLabels, width = 400, isDarkMode, title }: CircuitProps) {
  const strokeColor = isDarkMode ? "#fff" : "#000"
  const height = numQubits * 50 + 40
  const gateSpacing = 60
  const startX = 80
  const qubitY = (i: number) => 30 + i * 50

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-sm font-medium mb-2 opacity-75">{title}</p>}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Qubit lines */}
        {Array.from({ length: numQubits }).map((_, i) => (
          <g key={i}>
            <line
              x1="40"
              y1={qubitY(i)}
              x2={width - 20}
              y2={qubitY(i)}
              stroke={strokeColor}
              strokeWidth="1.5"
            />
            {/* Logical qubit labels */}
            {qubitLabels && (
              <text x="15" y={qubitY(i) + 4} fill={strokeColor} fontSize="12" textAnchor="end">
                {qubitLabels[i]}
              </text>
            )}
            {/* Physical qubit labels in parentheses */}
            {physicalLabels && (
              <text x="35" y={qubitY(i) + 4} fill={strokeColor} fontSize="10" opacity={0.6}>
                ({physicalLabels[i]})
              </text>
            )}
          </g>
        ))}

        {/* Gates */}
        {gates.map((gate, gateIdx) => {
          const x = startX + gateIdx * gateSpacing
          const highlightColor = gate.highlight === "red" ? "hsl(0, 70%, 50%)" :
                                gate.highlight === "blue" ? "hsl(220, 100%, 60%)" :
                                gate.highlight === "green" ? "hsl(120, 70%, 45%)" : strokeColor

          if (gate.type === "cnot") {
            const control = gate.qubits[0]
            const target = gate.qubits[1]
            const controlY = qubitY(control)
            const targetY = qubitY(target)
            
            return (
              <g key={gateIdx}>
                {/* Vertical line */}
                <line
                  x1={x}
                  y1={Math.min(controlY, targetY)}
                  x2={x}
                  y2={Math.max(controlY, targetY)}
                  stroke={highlightColor}
                  strokeWidth="1.5"
                />
                {/* Control dot */}
                <circle cx={x} cy={controlY} r="5" fill={highlightColor} />
                {/* Target (⊕) */}
                <circle cx={x} cy={targetY} r="10" fill="none" stroke={highlightColor} strokeWidth="1.5" />
                <line x1={x} y1={targetY - 10} x2={x} y2={targetY + 10} stroke={highlightColor} strokeWidth="1.5" />
                <line x1={x - 10} y1={targetY} x2={x + 10} y2={targetY} stroke={highlightColor} strokeWidth="1.5" />
              </g>
            )
          }

          if (gate.type === "swap") {
            const q1 = gate.qubits[0]
            const q2 = gate.qubits[1]
            const y1 = qubitY(q1)
            const y2 = qubitY(q2)
            
            return (
              <g key={gateIdx}>
                {/* Vertical line */}
                <line x1={x} y1={y1} x2={x} y2={y2} stroke={highlightColor} strokeWidth="1.5" />
                {/* X on first qubit */}
                <line x1={x - 6} y1={y1 - 6} x2={x + 6} y2={y1 + 6} stroke={highlightColor} strokeWidth="2" />
                <line x1={x + 6} y1={y1 - 6} x2={x - 6} y2={y1 + 6} stroke={highlightColor} strokeWidth="2" />
                {/* X on second qubit */}
                <line x1={x - 6} y1={y2 - 6} x2={x + 6} y2={y2 + 6} stroke={highlightColor} strokeWidth="2" />
                <line x1={x + 6} y1={y2 - 6} x2={x - 6} y2={y2 + 6} stroke={highlightColor} strokeWidth="2" />
              </g>
            )
          }

          if (gate.type === "h" || gate.type === "x") {
            const q = gate.qubits[0]
            const y = qubitY(q)
            return (
              <g key={gateIdx}>
                <rect
                  x={x - 15}
                  y={y - 15}
                  width="30"
                  height="30"
                  fill={isDarkMode ? "#1a1a1a" : "#fff"}
                  stroke={highlightColor}
                  strokeWidth="1.5"
                />
                <text x={x} y={y + 5} textAnchor="middle" fill={highlightColor} fontSize="14" fontWeight="bold">
                  {gate.type.toUpperCase()}
                </text>
              </g>
            )
          }

          return null
        })}
      </svg>
    </div>
  )
}

// ============================================
// Circuit Placement Demo
// Shows original circuit → placed on topology → routed circuit
// ============================================
export function PlacementComparison({ isDarkMode }: { isDarkMode: boolean }) {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [placementType, setPlacementType] = useState<"random" | "smart">("random")

  const strokeColor = isDarkMode ? "#fff" : "#000"

  // Original logical circuit
  const originalGates: Gate[] = [
    { type: "cnot", qubits: [0, 1] },
    { type: "cnot", qubits: [1, 2] },
    { type: "cnot", qubits: [0, 2], highlight: "red" }, // This one needs routing!
  ]

  // Random placement: Q0→Q0, Q1→Q3, Q2→Q10 (spread out, bad connectivity)
  const randomPlacedGates: Gate[] = [
    { type: "cnot", qubits: [0, 1] }, // Q0-Q3 not connected!
    { type: "cnot", qubits: [1, 2] }, // Q3-Q10 not connected!
    { type: "cnot", qubits: [0, 2], highlight: "red" },
  ]

  // Random routed (needs many SWAPs)
  const randomRoutedGates: Gate[] = [
    { type: "swap", qubits: [0, 1], highlight: "red" }, // Move Q0 closer
    { type: "cnot", qubits: [1, 2] },
    { type: "swap", qubits: [1, 2], highlight: "red" },
    { type: "swap", qubits: [2, 3], highlight: "red" },
    { type: "cnot", qubits: [2, 3] },
    { type: "swap", qubits: [2, 3], highlight: "red" },
    { type: "cnot", qubits: [0, 3], highlight: "red" },
  ]

  // Smart placement: Q0→Q5, Q1→Q8, Q2→Q9 (all connected via high-fidelity edges)
  const smartPlacedGates: Gate[] = [
    { type: "cnot", qubits: [0, 1], highlight: "green" },
    { type: "cnot", qubits: [1, 2], highlight: "green" },
    { type: "cnot", qubits: [0, 2], highlight: "blue" }, // Needs 1 SWAP
  ]

  // Smart routed (minimal SWAPs through good edges)
  const smartRoutedGates: Gate[] = [
    { type: "cnot", qubits: [0, 1], highlight: "green" },
    { type: "cnot", qubits: [1, 2], highlight: "green" },
    { type: "swap", qubits: [0, 1], highlight: "blue" },
    { type: "cnot", qubits: [1, 2], highlight: "green" },
  ]

  const randomPhysical = ["Q0", "Q3", "Q10"]
  const smartPhysical = ["Q5", "Q8", "Q9"]

  // Topology highlighting
  const randomHighlight = [0, 3, 10]
  const smartHighlight = [5, 8, 9]
  const currentHighlight = placementType === "random" ? randomHighlight : smartHighlight

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
      <h4 className="text-sm font-medium mb-4 opacity-75">Interactive: Circuit Placement &amp; Routing</h4>

      {/* Placement type selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setPlacementType("random"); setStep(0); }}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            placementType === "random"
              ? "bg-red-500/30 text-red-300"
              : isDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
          }`}
        >
          Random Placement
        </button>
        <button
          onClick={() => { setPlacementType("smart"); setStep(0); }}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            placementType === "smart"
              ? "bg-green-500/30 text-green-300"
              : isDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
          }`}
        >
          Noise-Aware Placement
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Topology View */}
        <div>
          <p className="text-sm font-medium mb-2 opacity-75">Physical Qubit Topology</p>
          <svg width="360" height="200" viewBox="0 0 360 200" className="w-full max-w-md">
            {/* Edges */}
            {TOPOLOGY_EDGES.map((edge, i) => {
              const fromQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.from)!
              const toQubit = TOPOLOGY_QUBITS.find(q => q.id === edge.to)!
              const isSelected = currentHighlight.includes(edge.from) && currentHighlight.includes(edge.to)
              return (
                <line
                  key={i}
                  x1={fromQubit.x}
                  y1={fromQubit.y}
                  x2={toQubit.x}
                  y2={toQubit.y}
                  stroke={isSelected ? (placementType === "smart" ? "hsl(120, 70%, 45%)" : "hsl(0, 70%, 50%)") : getFidelityColor(edge.fidelity)}
                  strokeWidth={isSelected ? 4 : 2}
                  opacity={isSelected ? 1 : 0.3}
                />
              )
            })}
            {/* Qubit nodes */}
            {TOPOLOGY_QUBITS.map((qubit) => {
              const isSelected = currentHighlight.includes(qubit.id)
              const logicalIdx = currentHighlight.indexOf(qubit.id)
              return (
                <g key={qubit.id}>
                  <circle
                    cx={qubit.x}
                    cy={qubit.y}
                    r={isSelected ? 18 : 12}
                    fill={isSelected ? (placementType === "smart" ? "hsl(120, 70%, 45%)" : "hsl(0, 70%, 50%)") : getFidelityColor(qubit.fidelity)}
                    opacity={isSelected ? 1 : 0.4}
                  />
                  <text
                    x={qubit.x}
                    y={qubit.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={isSelected ? "10" : "9"}
                    fontWeight="bold"
                  >
                    {isSelected ? `q${logicalIdx}` : `Q${qubit.id}`}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className="text-xs opacity-50 mt-2">
            {placementType === "random" 
              ? "Random: q0→Q0, q1→Q3, q2→Q10 (spread across device)"
              : "Smart: q0→Q5, q1→Q8, q2→Q9 (high-fidelity region)"
            }
          </p>
        </div>

        {/* Circuit View */}
        <div>
          {step === 0 && (
            <QuantumCircuit
              numQubits={3}
              gates={originalGates}
              qubitLabels={["q₀", "q₁", "q₂"]}
              width={280}
              isDarkMode={isDarkMode}
              title="Original Circuit (Logical)"
            />
          )}
          {step === 1 && (
            <QuantumCircuit
              numQubits={3}
              gates={placementType === "random" ? randomPlacedGates : smartPlacedGates}
              qubitLabels={["q₀", "q₁", "q₂"]}
              physicalLabels={placementType === "random" ? randomPhysical : smartPhysical}
              width={280}
              isDarkMode={isDarkMode}
              title="Mapped to Physical Qubits"
            />
          )}
          {step === 2 && (
            <QuantumCircuit
              numQubits={3}
              gates={placementType === "random" ? randomRoutedGates : smartRoutedGates}
              qubitLabels={["q₀", "q₁", "q₂"]}
              physicalLabels={placementType === "random" ? randomPhysical : smartPhysical}
              width={placementType === "random" ? 500 : 320}
              isDarkMode={isDarkMode}
              title="After Routing (SWAPs Inserted)"
            />
          )}
        </div>
      </div>

      {/* Step controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setStep(Math.max(0, step - 1) as 0 | 1 | 2)}
          disabled={step === 0}
          className={`px-3 py-1 rounded text-sm ${isDarkMode ? "bg-white/10 disabled:opacity-30" : "bg-black/10 disabled:opacity-30"}`}
        >
          ← Previous
        </button>
        <div className="flex gap-2">
          {[0, 1, 2].map(s => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step 
                  ? "bg-blue-400 scale-125" 
                  : isDarkMode ? "bg-white/20" : "bg-black/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setStep(Math.min(2, step + 1) as 0 | 1 | 2)}
          disabled={step === 2}
          className={`px-3 py-1 rounded text-sm ${isDarkMode ? "bg-white/10 disabled:opacity-30" : "bg-black/10 disabled:opacity-30"}`}
        >
          Next →
        </button>
      </div>

      {/* Results comparison */}
      <div className={`p-4 rounded ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className={placementType === "random" ? "opacity-100" : "opacity-50"}>
            <p className="font-medium text-red-400 mb-1">Random Placement</p>
            <p>SWAPs needed: <strong>4</strong></p>
            <p>Estimated fidelity: <strong className="text-red-400">~52%</strong></p>
          </div>
          <div className={placementType === "smart" ? "opacity-100" : "opacity-50"}>
            <p className="font-medium text-green-400 mb-1">Noise-Aware Placement</p>
            <p>SWAPs needed: <strong>1</strong></p>
            <p>Estimated fidelity: <strong className="text-green-400">~89%</strong></p>
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

  const strokeColor = isDarkMode ? "#fff" : "#000"

  // Mini topology for this example
  const miniQubits = [
    { id: 0, x: 40, y: 70 },
    { id: 1, x: 100, y: 40 },
    { id: 2, x: 160, y: 70 },
    { id: 3, x: 100, y: 100 },
    { id: 4, x: 220, y: 40 },
    { id: 5, x: 280, y: 70 },
  ]

  const miniEdges = [
    { from: 0, to: 1, fidelity: 0.97, label: "97%" },
    { from: 1, to: 2, fidelity: 0.99, label: "99%" },
    { from: 0, to: 3, fidelity: 0.88, label: "88%" },
    { from: 2, to: 3, fidelity: 0.91, label: "91%" },
    { from: 2, to: 4, fidelity: 0.98, label: "98%" },
    { from: 4, to: 5, fidelity: 0.96, label: "96%" },
    { from: 3, to: 5, fidelity: 0.85, label: "85%" },
  ]

  // Short path: Q0 → Q3 → Q5 (2 edges, low fidelity)
  const shortPathEdges = [[0, 3], [3, 5]]
  const shortPathFidelity = Math.pow(0.88, 3) * Math.pow(0.85, 3) // ~42%

  // Quality path: Q0 → Q1 → Q2 → Q4 → Q5 (4 edges, high fidelity)
  const qualityPathEdges = [[0, 1], [1, 2], [2, 4], [4, 5]]
  const qualityPathFidelity = Math.pow(0.97, 3) * Math.pow(0.99, 3) * Math.pow(0.98, 3) * Math.pow(0.96, 3) // ~77%

  const currentPath = selectedPath === "short" ? shortPathEdges : qualityPathEdges

  const isOnPath = (from: number, to: number) => {
    return currentPath.some(([a, b]) => (a === from && b === to) || (a === to && b === from))
  }

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
      <h4 className="text-sm font-medium mb-4 opacity-75">Interactive: Short Path vs Quality Path</h4>
      
      <p className="text-sm mb-4 opacity-75">
        To move a quantum state from <strong>Q0</strong> to <strong>Q5</strong>, which path should we take?
      </p>

      <div className="flex flex-col lg:flex-row gap-6 mb-4">
        {/* Topology */}
        <svg width="320" height="140" viewBox="0 0 320 140" className="flex-shrink-0">
          {/* Edges */}
          {miniEdges.map((edge, i) => {
            const from = miniQubits.find(q => q.id === edge.from)!
            const to = miniQubits.find(q => q.id === edge.to)!
            const onPath = isOnPath(edge.from, edge.to)
            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={onPath ? (selectedPath === "short" ? "hsl(0, 70%, 50%)" : "hsl(120, 70%, 45%)") : strokeColor}
                  strokeWidth={onPath ? 4 : 1.5}
                  opacity={onPath ? 1 : 0.3}
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 8}
                  textAnchor="middle"
                  fill={onPath ? (selectedPath === "short" ? "hsl(0, 70%, 60%)" : "hsl(120, 70%, 55%)") : strokeColor}
                  fontSize="10"
                  opacity={onPath ? 1 : 0.5}
                >
                  {edge.label}
                </text>
              </g>
            )
          })}
          {/* Qubits */}
          {miniQubits.map((q) => {
            const isEndpoint = q.id === 0 || q.id === 5
            const onPath = currentPath.flat().includes(q.id)
            return (
              <g key={q.id}>
                <circle
                  cx={q.x}
                  cy={q.y}
                  r={isEndpoint ? 16 : 12}
                  fill={isEndpoint ? "hsl(220, 100%, 60%)" : onPath ? (selectedPath === "short" ? "hsl(0, 70%, 50%)" : "hsl(120, 70%, 45%)") : (isDarkMode ? "#333" : "#ccc")}
                />
                <text x={q.x} y={q.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                  Q{q.id}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Path selection */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSelectedPath("short")}
            className={`p-3 rounded border-2 text-left transition-all ${
              selectedPath === "short"
                ? "border-red-400 bg-red-400/10"
                : isDarkMode ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30"
            }`}
          >
            <div className="font-medium">Short Path (SABRE)</div>
            <div className="text-sm opacity-75">Q0 → Q3 → Q5</div>
            <div className="text-sm">2 SWAPs, edges: 88%, 85%</div>
          </button>

          <button
            onClick={() => setSelectedPath("quality")}
            className={`p-3 rounded border-2 text-left transition-all ${
              selectedPath === "quality"
                ? "border-green-400 bg-green-400/10"
                : isDarkMode ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30"
            }`}
          >
            <div className="font-medium">Quality Path (NACRE)</div>
            <div className="text-sm opacity-75">Q0 → Q1 → Q2 → Q4 → Q5</div>
            <div className="text-sm">4 SWAPs, edges: 97%, 99%, 98%, 96%</div>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className={`p-4 rounded ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">SABRE&apos;s logic:</p>
            <p className="opacity-75">&quot;Fewer SWAPs = better&quot;</p>
            <p className={selectedPath === "short" ? "text-green-400" : "text-red-400"}>
              {selectedPath === "short" ? "✓ Would choose this" : "✗ Rejects this"}
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">NACRE&apos;s logic:</p>
            <p className="opacity-75">&quot;Higher fidelity = better&quot;</p>
            <p className={selectedPath === "quality" ? "text-green-400" : "text-red-400"}>
              {selectedPath === "quality" ? "✓ Would choose this" : "✗ Rejects this"}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-current/10">
          <p className="text-sm">
            <strong>Path fidelity:</strong>{" "}
            <span className={`font-mono text-lg ${selectedPath === "quality" ? "text-green-400" : "text-red-400"}`}>
              {((selectedPath === "short" ? shortPathFidelity : qualityPathFidelity) * 100).toFixed(1)}%
            </span>
          </p>
          <p className="text-xs opacity-50 mt-1">
            Each SWAP = 3 CNOTs, so fidelity = (edge_fidelity)³ for each edge
          </p>
          {selectedPath === "short" && (
            <p className="text-sm mt-2 text-yellow-400">
              The quality path has <strong>{((qualityPathFidelity - shortPathFidelity) * 100).toFixed(0)}%</strong> higher fidelity despite 2× more SWAPs!
            </p>
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
    <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
      <h4 className="text-sm font-medium mb-4 opacity-75">Interactive: Fidelity Multiplication</h4>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm opacity-75 block mb-2">
            Number of two-qubit gates: <strong>{gateCount}</strong>
          </label>
          <input
            type="range"
            min="10"
            max="200"
            value={gateCount}
            onChange={(e) => setGateCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm opacity-75 block mb-2">
            Per-gate fidelity: <strong>{(gateFidelity * 100).toFixed(1)}%</strong>
          </label>
          <input
            type="range"
            min="0.95"
            max="0.999"
            step="0.001"
            value={gateFidelity}
            onChange={(e) => setGateFidelity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className={`p-4 rounded ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm opacity-75 mb-1">Current Fidelity</p>
              <p className="text-2xl font-mono">{(totalFidelity * 100).toFixed(1)}%</p>
              <p className="text-xs opacity-50">{gateFidelity}^{gateCount}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">With +0.5% per gate</p>
              <p className="text-2xl font-mono text-green-400">{(improvedFidelity * 100).toFixed(1)}%</p>
              <p className="text-xs opacity-50">{(gateFidelity + 0.005).toFixed(3)}^{gateCount}</p>
            </div>
          </div>
          <p className="text-sm opacity-75 mt-4 text-center">
            A tiny improvement per gate ({((0.005) * 100).toFixed(1)}%) leads to{" "}
            <strong>{((improvedFidelity - totalFidelity) * 100).toFixed(1)}%</strong> higher total fidelity!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Error Accumulation Visualization
// ============================================
export function ErrorAccumulation({ isDarkMode }: { isDarkMode: boolean }) {
  const [step, setStep] = useState(0)
  const maxSteps = 5

  const steps = [
    { label: "Initial State", fidelity: 1.0, description: "Perfect quantum state |ψ⟩" },
    { label: "CNOT Gate 1", fidelity: 0.99, description: "First two-qubit gate" },
    { label: "CNOT Gate 2", fidelity: 0.98, description: "Error compounds" },
    { label: "SWAP (3 CNOTs)", fidelity: 0.94, description: "SWAP = 3× error" },
    { label: "CNOT Gate 3", fidelity: 0.92, description: "More accumulation" },
    { label: "Measurement", fidelity: 0.89, description: "Readout fidelity" },
  ]

  const currentFidelity = steps[step].fidelity

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % (maxSteps + 1))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const strokeColor = isDarkMode ? "#fff" : "#000"

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
      <h4 className="text-sm font-medium mb-4 opacity-75">Animation: Error Accumulation Through a Circuit</h4>
      
      {/* Circuit visualization */}
      <svg width="100%" height="80" viewBox="0 0 500 80" className="mb-4">
        {/* Qubit line */}
        <line x1="20" y1="40" x2="480" y2="40" stroke={strokeColor} strokeWidth="1.5" />
        <text x="10" y="44" fill={strokeColor} fontSize="12">|ψ⟩</text>
        
        {/* Gates */}
        {["CNOT", "CNOT", "SWAP", "CNOT", "M"].map((gate, i) => {
          const x = 80 + i * 90
          const isActive = i < step
          const isCurrent = i === step - 1
          return (
            <g key={i}>
              <rect
                x={x - 20}
                y={20}
                width="40"
                height="40"
                fill={isCurrent ? "hsl(220, 100%, 60%)" : isActive ? (isDarkMode ? "#333" : "#ddd") : (isDarkMode ? "#1a1a1a" : "#f5f5f5")}
                stroke={isActive ? strokeColor : (isDarkMode ? "#333" : "#ccc")}
                strokeWidth="1.5"
                rx="4"
              />
              <text
                x={x}
                y={45}
                textAnchor="middle"
                fill={isCurrent ? "#fff" : isActive ? strokeColor : (isDarkMode ? "#666" : "#999")}
                fontSize="10"
                fontWeight="bold"
              >
                {gate}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Fidelity bar */}
      <div className="relative h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden mb-4">
        <div 
          className="absolute top-0 bottom-0 right-0 transition-all duration-500"
          style={{ 
            width: `${(1 - currentFidelity) * 100}%`,
            backgroundColor: isDarkMode ? "#000" : "#fff",
            opacity: 0.7
          }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-800 transition-all duration-500"
          style={{ left: `calc(${currentFidelity * 100}% - 8px)` }}
        />
      </div>

      <div className="text-center mb-4">
        <p className="text-3xl font-mono">{(currentFidelity * 100).toFixed(0)}%</p>
        <p className="text-sm opacity-75">{steps[step].label}</p>
        <p className="text-xs opacity-50">{steps[step].description}</p>
      </div>

      <div className="flex justify-center gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === step 
                ? "bg-blue-400 scale-125" 
                : isDarkMode ? "bg-white/20 hover:bg-white/40" : "bg-black/20 hover:bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
