"use client"

import { useState } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, ErrorBar } from "recharts"
import { CodeBlock } from "../components"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Import benchmark data from JSON file
import benchmarkJson from "./benchmark-data.json"

// Types for the benchmark data
interface FidelityStats {
  min: number
  max: number
  mean: number
  median: number
  std: number
}

interface RunData {
  seed: number
  nacre_fidelity: number
  sabre_fidelity: number
}

interface CircuitResult {
  circuit_name: string
  circuit_qubits: number
  circuit_depth: number
  fidelity_regime: string
  n_runs: number
  nacre_fidelity: FidelityStats
  nacre_swaps: FidelityStats
  sabre_fidelity: FidelityStats
  sabre_swaps: FidelityStats
  fidelity_gain_pct: number
  runs: RunData[]
}

interface BenchmarkData {
  metadata: {
    preset: string
    runs_per_circuit: number
    device_qubits: number
    topology: string
    timestamp: string
  }
  fidelity_regime_results: {
    noisy: CircuitResult[]
    good: CircuitResult[]
    excellent: CircuitResult[]
  }
}

// Cast imported JSON to typed data
const benchmarkData = benchmarkJson as BenchmarkData

// Standard circuits we want to display (in order)
const standardCircuits = [
  'GHZ-4', 'GHZ-8', 'GHZ-12', 'GHZ-16',
  'QFT-4', 'QFT-6', 'QFT-8',
  'QAOA-4-p2', 'QAOA-6-p2', 'QAOA-8-p2',
  'VQE-4-L2', 'VQE-6-L2', 'VQE-8-L2',
  'Random-4-D8', 'Random-8-D8', 'Random-12-D8'
]

// Map circuit names for display
const displayNames: Record<string, string> = {
  'QAOA-4-p2': 'QAOA-4',
  'QAOA-6-p2': 'QAOA-6',
  'QAOA-8-p2': 'QAOA-8',
  'VQE-4-L2': 'VQE-4',
  'VQE-6-L2': 'VQE-6',
  'VQE-8-L2': 'VQE-8',
  'Random-4-D8': 'Random-4',
  'Random-8-D8': 'Random-8',
  'Random-12-D8': 'Random-12'
}

// Process benchmark data for a given regime
function processRegimeData(regime: 'noisy' | 'good' | 'excellent') {
  const regimeData = benchmarkData.fidelity_regime_results[regime]
  
  // For 'good' regime, also include VQE circuits from size_sweep_results
  // (VQE was only benchmarked at the 'good' fidelity regime)
  const sizeSweepData = regime === 'good' 
    ? (benchmarkData as BenchmarkData & { size_sweep_results?: CircuitResult[] }).size_sweep_results || []
    : []
  
  // Combine regime data with size sweep data
  const allData = [...regimeData, ...sizeSweepData]
  
  return standardCircuits
    .map(circuitName => {
      const item = allData.find(r => r.circuit_name === circuitName)
      if (!item) return null
      
      // Compute per-run gain as percentage point difference (matching fidelity_gain_pct)
      // fidelity_gain_pct = (nacre_mean - sabre_mean) * 100
      const perRunGains = item.runs.map(run => 
        (run.nacre_fidelity - run.sabre_fidelity) * 100
      )
      const meanGain = perRunGains.reduce((sum, g) => sum + g, 0) / perRunGains.length
      const fidGainStd = Math.sqrt(
        perRunGains.reduce((sum, g) => sum + Math.pow(g - meanGain, 2), 0) / perRunGains.length
      )
      
      return {
        circuit: displayNames[circuitName] || circuitName,
        nacreFid: item.nacre_fidelity.mean,
        sabreFid: item.sabre_fidelity.mean,
        nacreSwaps: item.nacre_swaps.mean,
        sabreSwaps: item.sabre_swaps.mean,
        fidGain: item.fidelity_gain_pct,
        nacreFidStd: item.nacre_fidelity.std,
        sabreFidStd: item.sabre_fidelity.std,
        fidGainStd: fidGainStd,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

// Process all regimes
const benchmarkDataNoisy = processRegimeData('noisy')
const benchmarkDataGood = processRegimeData('good')
const benchmarkDataExcellent = processRegimeData('excellent')

// Calculate average gain for a regime
function calculateAverageGain(data: typeof benchmarkDataNoisy) {
  return data.reduce((sum, d) => sum + d.fidGain, 0) / data.length
}

// Calculate standard deviation of gains for a regime
function calculateStdGain(data: typeof benchmarkDataNoisy) {
  const mean = calculateAverageGain(data)
  const squaredDiffs = data.map(d => Math.pow(d.fidGain - mean, 2))
  const avgSquaredDiff = squaredDiffs.reduce((sum, d) => sum + d, 0) / data.length
  return Math.sqrt(avgSquaredDiff)
}

// Import Tailwind colors directly for use in Recharts (which requires hex values)
import twColors from "tailwindcss/colors"

const tailwindColors = {
  green: twColors.green[600],
  red: twColors.red[600],
  yellow: twColors.yellow[600],
  amber: twColors.amber[600],
  blue: twColors.blue[600],
  gray: twColors.gray[600],
}

// Regime comparison data - computed from actual benchmark data
// Using distinct colors: green (best), amber (medium), yellow (lowest)
const regimeComparisonData = [
  { 
    regime: "Noisy (90-99%)", 
    avgGain: Math.round(calculateAverageGain(benchmarkDataNoisy) * 10) / 10, 
    stdGain: Math.round(calculateStdGain(benchmarkDataNoisy) * 10) / 10,
    description: "Older/degraded devices", 
    color: tailwindColors.green  // Green (highest gain)
  },
  { 
    regime: "Good (95-99%)", 
    avgGain: Math.round(calculateAverageGain(benchmarkDataGood) * 10) / 10, 
    stdGain: Math.round(calculateStdGain(benchmarkDataGood) * 10) / 10,
    description: "Current superconducting", 
    color: tailwindColors.green  // Green (medium gain)
  },
  { 
    regime: "Excellent (99-99.9%)", 
    avgGain: Math.round(calculateAverageGain(benchmarkDataExcellent) * 10) / 10, 
    stdGain: Math.round(calculateStdGain(benchmarkDataExcellent) * 10) / 10,
    description: "High-quality/trapped-ion", 
    color: tailwindColors.green  // Green (lowest gain)
  },
]

// Circuit code examples - these match the actual benchmark script (benchmark_nacre.py)
const circuitCodes: Record<string, { description: string; code: string }> = {
  "GHZ": {
    description: "GHZ (Greenberger–Horne–Zeilinger) state - maximally entangled state",
    code: `from qiskit import QuantumCircuit

def create_ghz_circuit(n_qubits: int) -> QuantumCircuit:
    """Create GHZ state preparation circuit."""
    qc = QuantumCircuit(n_qubits, name=f"GHZ-{n_qubits}")
    qc.h(0)
    for i in range(n_qubits - 1):
        qc.cx(i, i + 1)
    return qc

# Example: 8-qubit GHZ
qc = create_ghz_circuit(8)
print(qc.draw())`
  },
  "QFT": {
    description: "Quantum Fourier Transform - the quantum analog of the discrete Fourier transform",
    code: `from qiskit import QuantumCircuit
from qiskit.synthesis.qft import synth_qft_full

def create_qft_circuit(n_qubits: int) -> QuantumCircuit:
    """Create Quantum Fourier Transform circuit."""
    qft = synth_qft_full(n_qubits, do_swaps=False)
    qc = qft.decompose()
    qc.name = f"QFT-{n_qubits}"
    return qc

# Example: 4-qubit QFT
qc = create_qft_circuit(4)
print(qc.draw())`
  },
  "QAOA": {
    description: "Quantum Approximate Optimization Algorithm - for combinatorial optimization",
    code: `from qiskit import QuantumCircuit
import math
import numpy as np

def create_qaoa_circuit(n_qubits: int, p: int = 2, seed: int = 42) -> QuantumCircuit:
    """Create QAOA-style circuit."""
    rng = np.random.default_rng(seed)
    qc = QuantumCircuit(n_qubits, name=f"QAOA-{n_qubits}-p{p}")

    # Random graph edges
    n_edges = min(n_qubits * 2, n_qubits * (n_qubits - 1) // 2)
    all_edges = [(i, j) for i in range(n_qubits) for j in range(i + 1, n_qubits)]
    rng.shuffle(all_edges)
    edges = all_edges[:n_edges]

    # Initial superposition
    for q in range(n_qubits):
        qc.h(q)

    # QAOA layers
    for _ in range(p):
        gamma = rng.uniform(0, math.pi)
        for i, j in edges:
            qc.cx(i, j)
            qc.rz(2 * gamma, j)
            qc.cx(i, j)
        beta = rng.uniform(0, math.pi)
        for q in range(n_qubits):
            qc.rx(2 * beta, q)

    return qc

# Example: 6-qubit, 2-layer QAOA
qc = create_qaoa_circuit(6, p=2)
print(qc.draw())`
  },
  "VQE": {
    description: "Variational Quantum Eigensolver hardware-efficient ansatz",
    code: `from qiskit import QuantumCircuit
import math
import numpy as np

def create_vqe_circuit(n_qubits: int, layers: int, seed: int = 42) -> QuantumCircuit:
    """Create VQE hardware-efficient ansatz."""
    rng = np.random.default_rng(seed)
    qc = QuantumCircuit(n_qubits, name=f"VQE-{n_qubits}-L{layers}")

    for _ in range(layers):
        # Rotation layer
        for q in range(n_qubits):
            theta = rng.uniform(0, 2 * math.pi)
            phi = rng.uniform(0, 2 * math.pi)
            qc.ry(theta, q)
            qc.rz(phi, q)
        # Entangling layer (ring topology)
        for q in range(n_qubits):
            qc.cx(q, (q + 1) % n_qubits)

    return qc

# Example: 6-qubit, 2-layer VQE
qc = create_vqe_circuit(6, layers=2)
print(qc.draw())`
  },
  "Random": {
    description: "Random circuit - tests general routing performance",
    code: `from qiskit import QuantumCircuit
import numpy as np

def create_random_circuit(n_qubits: int, depth: int = 8, seed: int = 42) -> QuantumCircuit:
    """Create random circuit with mixed 1Q and 2Q gates."""
    rng = np.random.default_rng(seed)
    qc = QuantumCircuit(n_qubits, name=f"Random-{n_qubits}-D{depth}")

    for _ in range(depth):
        # Single-qubit gates
        for q in range(n_qubits):
            gate = rng.choice(["h", "x", "y", "z", "s", "t"])
            getattr(qc, gate)(q)
        # Two-qubit gates
        if n_qubits >= 2:
            n_2q = rng.integers(1, max(2, n_qubits // 2) + 1)
            for _ in range(n_2q):
                q1, q2 = rng.choice(n_qubits, size=2, replace=False)
                qc.cx(int(q1), int(q2))

    return qc

# Example: 8-qubit random circuit
qc = create_random_circuit(8, depth=8)
print(qc.draw())`
  },
}

// Colors for charts - using Tailwind 500 values
const colors = {
  nacre: tailwindColors.green,
  sabre: tailwindColors.red,
  neutral: "#6b7280", // Tailwind gray-500
}

// Chart configuration for tooltips and legends
const chartConfig = {
  nacreFid: {
    label: "NACRE Fidelity",
    color: colors.nacre,
  },
  sabreFid: {
    label: "SABRE Fidelity",
    color: colors.sabre,
  },
  fidGain: {
    label: "Fidelity Gain",
    color: colors.nacre,
  },
} satisfies ChartConfig

const getMutedColors = (isDarkMode: boolean) => ({
  textPrimary: isDarkMode ? "#e5e5e5" : "#171717",
  textSecondary: isDarkMode ? "#a3a3a3" : "#525252",
  textMuted: isDarkMode ? "#737373" : "#737373",
  bgSubtle: isDarkMode ? "#0d0d0d" : "#f5f5f5",
  bgMuted: isDarkMode ? "#1a1a1a" : "#e8e8e8",
  border: isDarkMode ? "#262626" : "#e5e5e5",
  gridLine: isDarkMode ? "#333333" : "#e0e0e0",
  errorBar: isDarkMode ? "#ffffff" : "#404040",
})

// Use "good" regime as the primary display (most representative of current hardware)
const primaryBenchmarkData = benchmarkDataGood

// Summary stats for good regime - computed from actual data
const avgNacreFid = primaryBenchmarkData.reduce((sum, d) => sum + d.nacreFid, 0) / primaryBenchmarkData.length
const avgSabreFid = primaryBenchmarkData.reduce((sum, d) => sum + d.sabreFid, 0) / primaryBenchmarkData.length
const avgFidGain = primaryBenchmarkData.reduce((sum, d) => sum + d.fidGain, 0) / primaryBenchmarkData.length
const nacreWins = primaryBenchmarkData.filter(d => d.fidGain > 0.01).length

// Count unique algorithm families from the circuit names (e.g., "GHZ-4" -> "GHZ")
const algorithmFamilies = new Set(primaryBenchmarkData.map(d => d.circuit.split("-")[0]))

// Compute win rates and max gains for each regime
const noisyWins = benchmarkDataNoisy.filter(d => d.fidGain > 0.01).length
const excellentWins = benchmarkDataExcellent.filter(d => d.fidGain > 0.01).length
const maxGainNoisy = benchmarkDataNoisy.reduce((max, d) => d.fidGain > max.fidGain ? d : max, benchmarkDataNoisy[0])
const maxGainExcellent = benchmarkDataExcellent.reduce((max, d) => d.fidGain > max.fidGain ? d : max, benchmarkDataExcellent[0])

// Export computed statistics for use in page.tsx
export const benchmarkStats = {
  metadata: benchmarkData.metadata,
  regimeGains: {
    noisy: regimeComparisonData[0].avgGain,
    good: regimeComparisonData[1].avgGain,
    excellent: regimeComparisonData[2].avgGain,
  },
  goodRegime: {
    avgNacreFid,
    avgSabreFid,
    avgFidGain,
    nacreWins,
    totalCircuits: primaryBenchmarkData.length,
  },
  noisyRegime: {
    nacreWins: noisyWins,
    totalCircuits: benchmarkDataNoisy.length,
  },
  excellentRegime: {
    nacreWins: excellentWins,
    totalCircuits: benchmarkDataExcellent.length,
  },
  // Find the circuit with maximum gain in each regime
  maxGainCircuit: primaryBenchmarkData.reduce((max, d) => d.fidGain > max.fidGain ? d : max, primaryBenchmarkData[0]),
  maxGainCircuitNoisy: maxGainNoisy,
  maxGainCircuitExcellent: maxGainExcellent,
  // Number of unique algorithm families tested
  algorithmFamilyCount: algorithmFamilies.size,
}

// Regime labels for display
const regimeLabels = {
  noisy: { label: "Noisy", range: "90-99%" },
  good: { label: "Good", range: "95-99%" },
  excellent: { label: "Excellent", range: "99-99.9%" },
}

// Type for processed benchmark data row
type BenchmarkRow = {
  circuit: string
  nacreFid: number
  sabreFid: number
  nacreSwaps: number
  sabreSwaps: number
  fidGain: number
  nacreFidStd: number
  sabreFidStd: number
  fidGainStd: number
}

// Type for circuit code info
type CircuitCodeInfo = {
  description: string
  code: string
}

// Detailed Results Table Component with Regime Toggle
function DetailedResultsTable({
  isDarkMode,
  muted,
  benchmarkDataNoisy,
  benchmarkDataGood,
  benchmarkDataExcellent,
  getCircuitType,
  circuitCodes,
  metadata,
}: {
  isDarkMode: boolean
  muted: ReturnType<typeof getMutedColors>
  benchmarkDataNoisy: BenchmarkRow[]
  benchmarkDataGood: BenchmarkRow[]
  benchmarkDataExcellent: BenchmarkRow[]
  getCircuitType: (name: string) => string
  circuitCodes: Record<string, CircuitCodeInfo>
  metadata: BenchmarkData['metadata']
}) {
  const [selectedRegime, setSelectedRegime] = useState<'noisy' | 'good' | 'excellent'>('good')
  
  const regimeDataMap = {
    noisy: benchmarkDataNoisy,
    good: benchmarkDataGood,
    excellent: benchmarkDataExcellent,
  }
  
  const currentData = regimeDataMap[selectedRegime]

  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: muted.bgSubtle }}>
      <div className="p-3 sm:p-4 border-b" style={{ borderColor: muted.border }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-xs sm:text-sm font-medium" style={{ color: muted.textPrimary }}>
              Detailed Benchmark Results
            </h4>
            <p className="text-[10px] sm:text-xs mt-1" style={{ color: muted.textMuted }}>
              {metadata.device_qubits}-qubit {metadata.topology} topology, {metadata.runs_per_circuit} runs per circuit
            </p>
          </div>
          {/* Regime Toggle */}
          <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: muted.bgMuted }}>
            {(['noisy', 'good', 'excellent'] as const).map((regime) => (
              <button
                key={regime}
                onClick={() => setSelectedRegime(regime)}
                className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium transition-colors"
                style={{
                  backgroundColor: selectedRegime === regime 
                    ? (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                    : 'transparent',
                  color: selectedRegime === regime ? muted.textPrimary : muted.textMuted,
                }}
              >
                {regimeLabels[regime].label}
                <span className="hidden sm:inline ml-1 opacity-60">({regimeLabels[regime].range})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[600px]">
          <thead>
            <tr style={{ backgroundColor: muted.bgMuted }}>
              <th className="text-left p-2 sm:p-3 font-medium whitespace-nowrap" style={{ color: muted.textPrimary }}>Circuit</th>
              <th className="text-right p-2 sm:p-3 font-medium whitespace-nowrap" style={{ color: muted.textPrimary }}>NACRE Fid.</th>
              <th className="text-right p-2 sm:p-3 font-medium whitespace-nowrap" style={{ color: muted.textPrimary }}>SABRE Fid.</th>
              <th className="text-right p-2 sm:p-3 font-medium whitespace-nowrap" style={{ color: muted.textPrimary }}>Gain</th>
              <th className="text-right p-2 sm:p-3 font-medium whitespace-nowrap" style={{ color: muted.textPrimary }}>NACRE SWAPs</th>
              <th className="text-right p-2 sm:p-3 font-medium whitespace-nowrap" style={{ color: muted.textPrimary }}>SABRE SWAPs</th>
              <th className="text-center p-2 sm:p-3 font-medium whitespace-nowrap" style={{ color: muted.textPrimary }}>Code</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row: BenchmarkRow) => {
              const circuitType = getCircuitType(row.circuit)
              const circuitInfo = circuitCodes[circuitType]
              return (
                <tr 
                  key={row.circuit} 
                  className="border-t transition-colors"
                  style={{ borderColor: muted.border }}
                >
                  <td className="p-2 sm:p-3 font-mono whitespace-nowrap" style={{ color: muted.textPrimary }}>{row.circuit}</td>
                  <td className="p-2 sm:p-3 text-right font-mono whitespace-nowrap" style={{ color: colors.nacre }}>
                    {(row.nacreFid * 100).toFixed(1)}%
                  </td>
                  <td className="p-2 sm:p-3 text-right font-mono whitespace-nowrap" style={{ color: colors.sabre }}>
                    {(row.sabreFid * 100).toFixed(1)}%
                  </td>
                  <td className="p-2 sm:p-3 text-right font-mono whitespace-nowrap" style={{ color: row.fidGain > 0 ? colors.nacre : colors.sabre }}>
                    {row.fidGain > 0 ? '+' : ''}{row.fidGain.toFixed(1)}%
                  </td>
                  <td className="p-2 sm:p-3 text-right font-mono whitespace-nowrap" style={{ color: muted.textSecondary }}>
                    {row.nacreSwaps.toFixed(1)}
                  </td>
                  <td className="p-2 sm:p-3 text-right font-mono whitespace-nowrap" style={{ color: muted.textSecondary }}>
                    {row.sabreSwaps.toFixed(1)}
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="text-xs px-2 py-1 rounded transition-colors hover:opacity-80"
                          style={{ 
                            backgroundColor: muted.bgMuted,
                            color: muted.textSecondary
                          }}
                        >
                          View
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{circuitType} Circuit - Qiskit Implementation</DialogTitle>
                          <DialogDescription>
                            {circuitInfo?.description}
                          </DialogDescription>
                        </DialogHeader>
                        {circuitInfo && (
                          <div className="mt-4">
                            <CodeBlock
                              isDarkMode={isDarkMode}
                              language="python"
                              code={circuitInfo.code}
                            />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function BenchmarkResults({ isDarkMode }: { isDarkMode: boolean }) {
  const muted = getMutedColors(isDarkMode)

  // Get circuit type from name (e.g., "GHZ-4" -> "GHZ")
  const getCircuitType = (name: string) => name.split("-")[0]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: muted.bgSubtle }}>
          <p className="text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ color: muted.textMuted }}>Avg Fidelity Gain</p>
          <p className="text-lg sm:text-2xl font-mono" style={{ color: colors.nacre }}>+{avgFidGain.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: muted.bgSubtle }}>
          <p className="text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ color: muted.textMuted }}>Max Circuit Gain</p>
          <p className="text-lg sm:text-2xl font-mono" style={{ color: colors.nacre }}>+{benchmarkStats.maxGainCircuit.fidGain.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: muted.bgSubtle }}>
          <p className="text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ color: muted.textMuted }}>NACRE Wins</p>
          <p className="text-lg sm:text-2xl font-mono" style={{ color: colors.nacre }}>{nacreWins}/{primaryBenchmarkData.length}</p>
        </div>
        <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: muted.bgSubtle }}>
          <p className="text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ color: muted.textMuted }}>Circuits Tested</p>
          <p className="text-lg sm:text-2xl font-mono" style={{ color: muted.textPrimary }}>{primaryBenchmarkData.length}</p>
        </div>
      </div>

      {/* Fidelity Gain by Regime Chart */}
      <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: muted.bgSubtle }}>
        <h4 className="text-xs sm:text-sm font-medium mb-2" style={{ color: muted.textPrimary }}>
          NACRE Advantage by Fidelity Regime
        </h4>
        <p className="text-[10px] sm:text-xs mb-4" style={{ color: muted.textMuted }}>
          NACRE&apos;s gains vary with device quality. Real NISQ devices have high noise variance.
        </p>
        <ChartContainer config={chartConfig} className="min-h-[100px] sm:min-h-[120px] h-[140px] sm:h-[160px] w-full !aspect-auto">
          <BarChart 
            accessibilityLayer
            data={regimeComparisonData} 
            layout="vertical"
            margin={{ top: 5, right: 30, bottom: 5, left: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={muted.gridLine} horizontal={true} vertical={false} />
            <XAxis 
              type="number"
              tick={{ fill: muted.textSecondary, fontSize: 11 }}
              tickFormatter={(value) => `+${value}%`}
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 5) * 5 + 5]}
              tickLine={{ stroke: muted.border }}
              axisLine={{ stroke: muted.border }}
              allowDataOverflow={true}
            />
            <YAxis 
              type="category"
              dataKey="regime"
              tick={{ fill: muted.textSecondary, fontSize: 11 }}
              tickLine={{ stroke: muted.border }}
              axisLine={{ stroke: muted.border }}
              width={115}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              content={
                <ChartTooltipContent
                  labelKey="regime"
                  formatter={(value, name, props) => {
                    const item = props.payload
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-neutral-500 dark:text-neutral-400">Avg Fidelity Gain</span>
                          <span className="font-mono font-medium tabular-nums text-neutral-950 dark:text-neutral-50">
                            +{(value as number).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.description}
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar 
              dataKey="avgGain" 
              radius={[0, 4, 4, 0]}
              maxBarSize={35}
            >
              {regimeComparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <ErrorBar 
                dataKey="stdGain" 
                direction="x"
                width={4}
                strokeWidth={1.5}
                stroke={muted.errorBar}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>


      {/* Fidelity Comparison Chart - Good Regime */}
      <div className="rounded-lg p-4 sm:p-6 overflow-x-auto" style={{ backgroundColor: muted.bgSubtle }}>
        <h4 className="text-xs sm:text-sm font-medium mb-4" style={{ color: muted.textPrimary }}>
          Fidelity Comparison: NACRE vs SABRE (Good Regime)
        </h4>
        <ChartContainer config={chartConfig} className="min-h-[180px] sm:min-h-[200px] h-[250px] sm:h-[300px] w-full min-w-[500px] !aspect-auto">
          <BarChart 
            accessibilityLayer
            data={primaryBenchmarkData} 
            margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={muted.gridLine} vertical={false} />
            <XAxis 
              dataKey="circuit" 
              tick={{ fill: muted.textSecondary, fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={50}
              tickLine={{ stroke: muted.border }}
              axisLine={{ stroke: muted.border }}
            />
            <YAxis 
              tick={{ fill: muted.textSecondary, fontSize: 11 }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              domain={[0, 1]}
              tickLine={{ stroke: muted.border }}
              axisLine={{ stroke: muted.border }}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.15)" }}
              content={
                <ChartTooltipContent
                  labelKey="circuit"
                  formatter={(value, name) => {
                    // name is the display name from Bar's name prop ("NACRE" or "SABRE")
                    const label = String(name)
                    return (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
                        <span className="font-mono font-medium tabular-nums text-neutral-950 dark:text-neutral-50">
                          {((value as number) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar 
              dataKey="nacreFid" 
              name="NACRE" 
              fill={colors.nacre} 
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            >
              <ErrorBar 
                dataKey="nacreFidStd" 
                direction="y"
                width={4}
                strokeWidth={1.5}
                stroke={muted.errorBar}
              />
            </Bar>
            <Bar 
              dataKey="sabreFid" 
              name="SABRE" 
              fill={colors.sabre} 
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            >
              <ErrorBar 
                dataKey="sabreFidStd" 
                direction="y"
                width={4}
                strokeWidth={1.5}
                stroke={muted.errorBar}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 sm:gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: colors.nacre }} />
            <span className="text-xs sm:text-sm" style={{ color: muted.textSecondary }}>NACRE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: colors.sabre }} />
            <span className="text-xs sm:text-sm" style={{ color: muted.textSecondary }}>SABRE</span>
          </div>
        </div>
      </div>

      {/* Fidelity Gain Chart */}
      <div className="rounded-lg p-4 sm:p-6 overflow-x-auto" style={{ backgroundColor: muted.bgSubtle }}>
        <h4 className="text-xs sm:text-sm font-medium mb-4" style={{ color: muted.textPrimary }}>
          Fidelity Improvement Over SABRE (%)
        </h4>
        <ChartContainer config={chartConfig} className="h-[240px] sm:h-[280px] w-full min-w-[500px] !aspect-auto">
          <BarChart 
            accessibilityLayer
            data={primaryBenchmarkData} 
            margin={{ top: 20, right: 10, bottom: 60, left: 45 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={muted.gridLine} vertical={false} />
            <XAxis 
              dataKey="circuit" 
              tick={{ fill: muted.textSecondary, fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              tickLine={{ stroke: muted.border }}
              axisLine={{ stroke: muted.border }}
              tickMargin={5}
            />
            <YAxis 
              tick={{ fill: muted.textSecondary, fontSize: 11 }}
              tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(0)}%`}
              tickLine={{ stroke: muted.border }}
              axisLine={{ stroke: muted.border }}
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 5) * 5 + 5]}
              allowDataOverflow={true}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.15)" }}
              content={
                <ChartTooltipContent
                  labelKey="circuit"
                  formatter={(value) => {
                    const numValue = value as number
                    return (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-neutral-500 dark:text-neutral-400">Fidelity Gain</span>
                        <span 
                          className="font-mono font-medium tabular-nums"
                          style={{ color: numValue > 0 ? colors.nacre : colors.sabre }}
                        >
                          {numValue > 0 ? '+' : ''}{numValue.toFixed(2)}%
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar 
              dataKey="fidGain" 
              name="Fidelity Gain" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {primaryBenchmarkData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fidGain > 0 ? colors.nacre : colors.sabre} 
                />
              ))}
              <ErrorBar 
                dataKey="fidGainStd" 
                direction="y"
                width={4}
                strokeWidth={1.5}
                stroke={muted.errorBar}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      {/* Detailed Results Table with Regime Toggle */}
      <DetailedResultsTable 
        isDarkMode={isDarkMode}
        muted={muted}
        benchmarkDataNoisy={benchmarkDataNoisy}
        benchmarkDataGood={benchmarkDataGood}
        benchmarkDataExcellent={benchmarkDataExcellent}
        getCircuitType={getCircuitType}
        circuitCodes={circuitCodes}
        metadata={benchmarkData.metadata}
      />

      {/* Key Insights */}
      <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: muted.bgSubtle }}>
        <h4 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4" style={{ color: muted.textPrimary }}>
          Key Findings
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm" style={{ color: muted.textSecondary }}>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: colors.nacre }}>●</span>
            <span><strong>NACRE wins on {nacreWins}/{primaryBenchmarkData.length} circuits</strong> in the good regime with an average fidelity gain of +{avgFidGain.toFixed(1)}%</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: colors.nacre }}>●</span>
            <span><strong>Gains scale with noise</strong>: +{regimeComparisonData[0].avgGain}% on noisy devices, +{regimeComparisonData[2].avgGain}% on excellent devices</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: colors.nacre }}>●</span>
            <span><strong>{benchmarkStats.maxGainCircuit.circuit} shows maximum gain</strong> (+{benchmarkStats.maxGainCircuit.fidGain.toFixed(1)}% in good regime) - circuits requiring non-trivial routing benefit most</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: colors.nacre }}>●</span>
            <span><strong>QFT circuits show largest improvements</strong>: dense two-qubit gate patterns give NACRE more routing optimization opportunities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: muted.textMuted }}>●</span>
            <span><strong>SWAP count is secondary</strong>: NACRE may use slightly more SWAPs when they route through higher-fidelity hardware</span>
          </li>
        </ul>
      </div>

      {/* Methodology */}
      <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: muted.bgSubtle }}>
        <h4 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4" style={{ color: muted.textPrimary }}>
          Benchmark Methodology
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm" style={{ color: muted.textSecondary }}>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: muted.textMuted }}>●</span>
            <span><strong>{benchmarkData.metadata.runs_per_circuit} runs per circuit</strong> with random device calibrations per seed for reproducibility</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: muted.textMuted }}>●</span>
            <span><strong>{benchmarkData.metadata.device_qubits}-qubit {benchmarkData.metadata.topology} topology</strong> representative of current superconducting hardware</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: muted.textMuted }}>●</span>
            <span><strong>Three fidelity regimes</strong>: Noisy (90-99%), Good (95-99%), Excellent (99-99.9%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: muted.textMuted }}>●</span>
            <span><strong>Circuit families</strong>: GHZ, QFT, QAOA, VQE, Random - covering structured and unstructured workloads</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
