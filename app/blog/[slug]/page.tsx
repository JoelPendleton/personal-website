"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import "katex/dist/katex.min.css"
import {
  SwapGateVisualizer,
  ConnectivityGraph,
  PlacementComparison,
  FidelityCalculator,
  CostFunctionComparison,
  ErrorAccumulation,
} from "./circuit-matching-components"
import { BenchmarkResults, benchmarkStats } from "./benchmark-results"
import { Math, InlineMath } from "../components"

// Table of contents types and data
interface TocItem {
  id: string
  title: string
  level: number
}

const circuitMatchingToc: TocItem[] = [
  { id: "hidden-infrastructure-problem", title: "The Hidden Infrastructure Problem", level: 2 },
  { id: "qubit-routing-problem", title: "The Qubit Routing Problem", level: 2 },
  { id: "state-of-the-art", title: "The State of the Art: SABRE and Its Limitations", level: 2 },
  { id: "nacre", title: "NACRE: Optimizing for What Actually Matters", level: 2 },
  { id: "why-fidelity-compounds", title: "Why Fidelity Compounds", level: 2 },
  { id: "six-component-cost-function", title: "The Six-Component Cost Function", level: 3 },
  { id: "intelligent-initial-placement", title: "Intelligent Initial Placement", level: 3 },
  { id: "performance", title: "Performance: Fidelity Is the Win", level: 2 },
  { id: "fidelity-vs-swap-tradeoff", title: "The Fidelity vs SWAP Tradeoff", level: 3 },
  { id: "when-nacre-excels", title: "When NACRE Excels", level: 2 },
  { id: "fidelity-regime-variation", title: "How Advantage Varies by Device Quality", level: 3 },
  { id: "path-to-fault-tolerance", title: "NACRE and the Path to Fault Tolerance", level: 2 },
  { id: "technical-details", title: "Technical Details", level: 2 },
  { id: "bigger-picture", title: "The Bigger Picture", level: 2 },
]

// Table of Contents Sidebar Component (Desktop)
function TableOfContents({ 
  items, 
  isDarkMode,
  isCollapsed,
  onToggle,
}: { 
  items: TocItem[]
  isDarkMode: boolean
  isCollapsed: boolean
  onToggle: () => void
}) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
    }
  }

  return (
    <nav className="sticky top-8 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onToggle}
          className={`p-1 rounded transition-colors ${
            isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
          }`}
          aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <h4 className={`text-sm font-medium ${isDarkMode ? "text-white/60" : "text-black/70"}`}>
          On this page
        </h4>
      </div>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
        }`}
      >
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block text-sm transition-colors leading-relaxed ${
                  item.level === 3 ? "pl-3" : ""
                } ${
                  activeId === item.id
                    ? isDarkMode
                      ? "text-white font-medium"
                      : "text-black font-medium"
                    : isDarkMode
                    ? "text-white/50 hover:text-white/80"
                    : "text-black/60 hover:text-black/90"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

// Mobile Table of Contents Component
function MobileTableOfContents({
  items,
  isDarkMode,
  isOpen,
  onClose,
}: {
  items: TocItem[]
  isDarkMode: boolean
  isOpen: boolean
  onClose: () => void
}) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
      onClose()
    }
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDarkMode ? "bg-black border-r border-white/10" : "bg-white border-r border-black/10"}`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h4 className={`text-sm font-medium ${isDarkMode ? "text-white/60" : "text-black/70"}`}>
              On this page
            </h4>
            <button
              onClick={onClose}
              className={`p-2 rounded transition-colors ${
                isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
              }`}
              aria-label="Close table of contents"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`block text-sm transition-colors leading-relaxed ${
                    item.level === 3 ? "pl-3" : ""
                  } ${
                    activeId === item.id
                      ? isDarkMode
                        ? "text-white font-medium"
                        : "text-black font-medium"
                      : isDarkMode
                      ? "text-white/50 hover:text-white/80"
                      : "text-black/60 hover:text-black/90"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

// Content component for the circuit matching post (needs isDarkMode)
function CircuitMatchingContent({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <>
      <h2 id="hidden-infrastructure-problem">The Hidden Infrastructure Problem</h2>
      <p>
        Think about what happens when you click &quot;Buy Now&quot; on a website. Your browser sends a request to a web server. That server talks to a payment processor, which communicates with your bank, which approves the transaction, and the confirmation ripples back through the entire chain in under two seconds. This seemingly simple action relies on decades of infrastructure: compilers that translate high-level code into machine instructions, operating systems that manage resources, and networking protocols that route data across continents.
      </p>
      <p>
        Now here&apos;s an uncomfortable truth: <strong>none of this infrastructure exists for quantum computers</strong>.
      </p>
      <p>
        The quantum computing industry loves to announce that &quot;useful quantum computing is X years away,&quot; but rarely discusses the enormous software stack that classical computers take for granted. Consider what happens when you run a program on your laptop. Your Python code compiles to bytecode, which is translated to assembly and then to machine code. From there, the work must be <em>routed</em> through billions of transistors. Which transistors execute which operations? How do signals flow between them? These problems were solved for classical computers long ago.
      </p>
      <p>
        For quantum computers? We&apos;re still figuring it out.
      </p>

      <h2 id="qubit-routing-problem">The Qubit Routing Problem</h2>
      <p>
        Here&apos;s the fundamental challenge. Suppose you&apos;ve written a quantum algorithm that requires 10 qubits to run a Grover&apos;s search. You submit it to a quantum computer with, say, 127 physical qubits. The question is deceptively simple: <strong>which 10 physical qubits should run your algorithm?</strong>
      </p>
      <p>
        This is hard for three reasons:
      </p>
      <p>
        <strong>1. Limited Connectivity</strong>: Unlike classical bits that can interact with any other bit through software routing, physical qubits can only directly interact with their neighbors. On IBM&apos;s superconducting quantum processors, each qubit typically connects to only 2-4 other qubits. If your algorithm needs qubits 0 and 15 to interact but they&apos;re not neighbors, you must &quot;teleport&quot; the quantum information through intermediate qubits using SWAP operations. Each SWAP introduces errors.
      </p>

      <div className="my-12">
        <SwapGateVisualizer isDarkMode={isDarkMode} />
      </div>

      <p>
        <strong>2. Not All Qubits Are Created Equal</strong>: This is where things get really interesting. On a real quantum processor:
      </p>
      <ul>
        <li>Qubit 3 might maintain coherence (<InlineMath>T_2</InlineMath>) for 100 microseconds while Qubit 7 only lasts 40 microseconds</li>
        <li>The two-qubit gate between qubits (2,3) might have 99% fidelity while the gate between (5,6) has only 95%</li>
        <li>Readout accuracy varies from 92% to 99% across different qubits</li>
      </ul>

      <div className="my-12">
        <ConnectivityGraph isDarkMode={isDarkMode} />
      </div>

      <p>
        <strong>3. The Combinatorial Explosion</strong>: For a 10-qubit algorithm on a 127-qubit device, there are approximately <InlineMath>{String.raw`\frac{127!}{(127-10)!} \approx 10^{21}`}</InlineMath> possible mappings. Even with clever heuristics, finding the optimal placement is computationally intractable.
      </p>

      <h2 id="state-of-the-art">The State of the Art: SABRE and Its Limitations</h2>
      <p>
        The current industry standard is an algorithm called SABRE (SWAP-based BidiREctional heuristic search), developed by Li, Ding, and Xie in 2019. SABRE treats the routing problem as a graph traversal problem: find the shortest path (fewest SWAPs) to execute all the two-qubit gates in your circuit.
      </p>
      <p>
        SABRE works reasonably well, and it&apos;s what Qiskit uses under the hood. But it has a fundamental blind spot: <strong>it optimizes for the wrong objective</strong>.
      </p>
      <p>
        When SABRE minimizes SWAP count, it&apos;s treating SWAPs as the enemy. But SWAPs aren&apos;t inherently the enemy. <em>Errors</em> are. And here&apos;s the key insight: <strong>a single SWAP through a noisy edge can be worse than three SWAPs through pristine edges</strong>.
      </p>

      <div className="my-12">
        <CostFunctionComparison isDarkMode={isDarkMode} />
      </div>

      <p>
        By treating all qubits and edges as equal, SABRE is like a GPS that minimizes distance while ignoring that some roads are unpaved, some bridges are structurally unsound, and some highways have 10-car pileups. In the NISQ (Noisy Intermediate-Scale Quantum) era, where noise dominates everything, minimizing hops while ignoring noise is solving the wrong problem entirely.
      </p>

      <h2 id="nacre">NACRE: Optimizing for What Actually Matters</h2>
      <p>
        At Conductor, we built NACRE (Noise-Aware Circuit Routing Engine) to optimize for the metric that actually determines whether your quantum computation succeeds: <strong>fidelity</strong>.
      </p>
      <p>
        The goal isn&apos;t to minimize SWAPs. It&apos;s to maximize the probability that your quantum state survives the computation intact. Sometimes that means fewer SWAPs. Sometimes it means <em>more</em> SWAPs, if those SWAPs traverse higher-quality hardware. NACRE makes this tradeoff intelligently.
      </p>
      <p>
        The key insight is to replace hop count with a noise-aware distance metric:
      </p>
      <p>
        <strong>SABRE approach:</strong>
      </p>
      <Math>{String.raw`d(q_1, q_2) = \text{number of edges in shortest path}`}</Math>
      <p>
        <strong>NACRE approach:</strong>
      </p>
      <Math>{String.raw`w(q_1, q_2) = -\log\bigl(F_{q_1, q_2}\bigr)`}</Math>
      <Math>{String.raw`d(q_1, q_2) = \sum_{\text{edges in path}} w(q_i, q_{i+1})`}</Math>
      <p>
        Using the negative logarithm of fidelity is mathematically elegant: it converts multiplicative fidelity (<InlineMath>{String.raw`F_{\text{total}} = F_1 \times F_2 \times F_3`}</InlineMath>) into additive distance (<InlineMath>{String.raw`d_{\text{total}} = d_1 + d_2 + d_3`}</InlineMath>), allowing us to use standard shortest-path algorithms like Dijkstra&apos;s. A path through three 99% fidelity gates (<InlineMath>{String.raw`-\log(0.99^3) = 0.030`}</InlineMath>) is now correctly ranked worse than a path through two 99.5% fidelity gates (<InlineMath>{String.raw`-\log(0.995^2) = 0.010`}</InlineMath>), even though the latter has fewer hops.
      </p>

      <div className="my-12">
        <FidelityCalculator isDarkMode={isDarkMode} />
      </div>

      <h2 id="why-fidelity-compounds">Why Fidelity Compounds</h2>
      <p>
        This reframing changes everything. NACRE doesn&apos;t ask &quot;how do I minimize SWAPs?&quot; It asks &quot;how do I get this quantum state to the finish line with the highest probability of being correct?&quot;
      </p>

      <div className="my-12">
        <ErrorAccumulation isDarkMode={isDarkMode} />
      </div>

      <h3 id="six-component-cost-function">The Six-Component Cost Function</h3>
      <p>
        When NACRE must decide which SWAP to insert, it evaluates candidates using six factors, all aimed at maximizing fidelity:
      </p>
      <div
        className={`overflow-x-auto my-4 rounded border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
              <th className="text-left p-3 font-semibold">Component</th>
              <th className="text-left p-3 font-semibold">What It Measures</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
              <td className="p-3 font-medium">SWAP Error Cost</td>
              <td className="p-3 opacity-75">The error introduced by the SWAP gate itself, based on the two-qubit gate fidelity of that edge</td>
            </tr>
            <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
              <td className="p-3 font-medium">Decoherence Cost</td>
              <td className="p-3 opacity-75">How much the qubits will decay (<InlineMath>{String.raw`T_1/T_2`}</InlineMath>) during the time it takes to execute the SWAP</td>
            </tr>
            <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
              <td className="p-3 font-medium">Immediate Benefit</td>
              <td className="p-3 opacity-75">How much this SWAP reduces the fidelity-weighted distance for gates in the current &quot;front layer&quot;</td>
            </tr>
            <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
              <td className="p-3 font-medium">Lookahead Cost</td>
              <td className="p-3 opacity-75">The fidelity impact on upcoming gates (configurable depth into the circuit)</td>
            </tr>
            <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
              <td className="p-3 font-medium">Decay Penalty</td>
              <td className="p-3 opacity-75">A penalty for recently-swapped qubits to prevent getting stuck in loops</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Crosstalk Penalty</td>
              <td className="p-3 opacity-75">A penalty for SWAPs that would occur on qubits experiencing crosstalk from parallel operations</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Notice that SWAP count doesn&apos;t appear directly in this cost function. NACRE may insert an extra SWAP if doing so routes through higher-fidelity hardware. The algorithm trusts the physics: what matters is the final fidelity of the quantum state, not how many operations it took to get there.
      </p>

      <h3 id="intelligent-initial-placement">Intelligent Initial Placement</h3>
      <p>
        SABRE starts with a random initial layout and hopes that bidirectional search finds something good. NACRE uses calibration data to generate intelligent starting layouts using four heuristic strategies:
      </p>
      <ol>
        <li><strong>Interaction-Weighted</strong>: Highly-interacting logical qubits get mapped to adjacent high-fidelity physical qubits. If qubits 0 and 1 in your algorithm interact 50 times, place them on the best-connected physical edge.</li>
        <li><strong>Lifetime-Aware</strong>: Logical qubits that stay active longest get mapped to physical qubits with the highest <InlineMath>T_2</InlineMath> coherence times.</li>
        <li><strong>Measurement-Aware</strong>: Qubits that will be measured get mapped to physical qubits with the highest readout fidelity.</li>
        <li><strong>Best-Region Selection</strong>: Find the highest-quality connected subgraph of the device and place your entire circuit there.</li>
      </ol>

      <div className="my-12">
        <PlacementComparison isDarkMode={isDarkMode} />
      </div>

      <h2 id="performance">Performance: Fidelity Is the Win</h2>
      <p>
        On circuits with heterogeneous device calibration (i.e., realistic NISQ devices), NACRE delivers substantial fidelity improvements. We benchmarked NACRE against SABRE (Qiskit&apos;s default router) across {benchmarkStats.goodRegime.totalCircuits} different quantum circuits spanning {benchmarkStats.algorithmFamilyCount} algorithm families, testing three different fidelity regimes:
      </p>

      <div className="my-12">
        <BenchmarkResults isDarkMode={isDarkMode} />
      </div>

      <p>
        <strong>The fidelity improvement is the headline result.</strong> The average {benchmarkStats.regimeGains.good}% improvement in estimated fidelity (on &quot;good&quot; 95-99% devices) might seem modest in percentage terms, but remember: in quantum computing, fidelity is multiplicative. For a circuit with 100 two-qubit gates, the difference between <InlineMath>0.99</InlineMath> and <InlineMath>0.995</InlineMath> per-gate fidelity is the difference between <InlineMath>37\%</InlineMath> and <InlineMath>61\%</InlineMath> total circuit fidelity, nearly doubling your success rate.
      </p>

      <h3 id="fidelity-vs-swap-tradeoff">The Fidelity vs SWAP Tradeoff</h3>
      <p>
        A key finding: <strong>NACRE sometimes uses slightly more SWAPs than SABRE, yet achieves significantly higher fidelity</strong>. This is by design. For example, the QFT-4 circuit shows NACRE using an average of 2.1 SWAPs versus SABRE&apos;s 2.0, but achieving a +13.8% fidelity improvement in the good regime.
      </p>
      <p>
        Consider why this happens: when your circuit needs to route quantum information from qubit A to qubit B, SABRE finds the shortest path: two hops through qubit C. But what if the A-C edge has 90% fidelity while a three-hop path through D and E has 99% fidelity on each edge?
      </p>
      <ul>
        <li><strong>SABRE&apos;s 2-hop path</strong>: <InlineMath>{String.raw`0.90 \times 0.90 = 81\%`}</InlineMath> fidelity</li>
        <li><strong>NACRE&apos;s 3-hop path</strong>: <InlineMath>{String.raw`0.99 \times 0.99 \times 0.99 = 97\%`}</InlineMath> fidelity</li>
      </ul>
      <p>
        NACRE makes this tradeoff automatically. It may insert an extra SWAP if doing so routes through higher-fidelity hardware. The algorithm trusts the physics: <strong>what matters is the final fidelity of the quantum state, not how many operations it took to get there</strong>.
      </p>

      <h2 id="when-nacre-excels">When NACRE Excels</h2>
      <p>
        NACRE provides the most benefit when:
      </p>
      <ul>
        <li>The device has <strong>high variance in qubit quality</strong> (which all real NISQ devices do)</li>
        <li>The device has <strong>sparse connectivity</strong> (superconducting architectures)</li>
        <li>Circuits have <strong>many two-qubit gates</strong> (where routing overhead accumulates)</li>
        <li><strong>Coherence times matter</strong> (deep circuits where qubits must survive many operations)</li>
      </ul>

      <h3 id="fidelity-regime-variation">How Advantage Varies by Device Quality</h3>
      <p>
        Our benchmarks reveal a nuanced picture of when NACRE helps most. We tested across three fidelity regimes:
      </p>
      <div
        className={`overflow-x-auto my-4 rounded border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
              <th className="text-left p-3 font-semibold">Fidelity Regime</th>
              <th className="text-left p-3 font-semibold">Gate Fidelity Range</th>
              <th className="text-left p-3 font-semibold">NACRE Advantage</th>
              <th className="text-left p-3 font-semibold">Representative Hardware</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
              <td className="p-3 font-medium">Noisy</td>
              <td className="p-3 opacity-75">90-99%</td>
              <td className="p-3 text-green-500">+{benchmarkStats.regimeGains.noisy}% avg</td>
              <td className="p-3 opacity-75">Older/degraded devices</td>
            </tr>
            <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
              <td className="p-3 font-medium">Good</td>
              <td className="p-3 opacity-75">95-99%</td>
              <td className="p-3 text-green-500">+{benchmarkStats.regimeGains.good}% avg</td>
              <td className="p-3 opacity-75">Current superconducting</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Excellent</td>
              <td className="p-3 opacity-75">99-99.9%</td>
              <td className="p-3 text-green-500">+{benchmarkStats.regimeGains.excellent}% avg</td>
              <td className="p-3 opacity-75">High-quality/trapped-ion</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The gains are largest on noisy devices (+{benchmarkStats.regimeGains.noisy}% average), where NACRE wins on {benchmarkStats.noisyRegime.nacreWins}/{benchmarkStats.noisyRegime.totalCircuits} circuits. But here&apos;s the critical insight: <strong>at excellent fidelities, NACRE&apos;s smaller percentage gains become more meaningful</strong>. Why? Because larger circuits remain in the &quot;useful&quot; fidelity range.
      </p>
      <p>
        Consider a medium-depth circuit. On noisy hardware, even with NACRE&apos;s improvement, the absolute fidelity may be marginal. But on excellent hardware with NACRE&apos;s +{benchmarkStats.regimeGains.excellent}% improvement, circuits that would have been borderline unusable become viable for real applications.
      </p>

      <h2 id="path-to-fault-tolerance">NACRE and the Path to Fault Tolerance</h2>
      <p>
        An honest question: does noise-aware routing matter in the fault-tolerant era? The short answer is <strong>NACRE is explicitly a NISQ-era tool</strong>, and that&apos;s a feature, not a limitation.
      </p>
  
      <p>
        The entire purpose of quantum error correction is to encode logical qubits such that logical operations have near-perfect, <em>uniform</em> fidelity. This eliminates the variance that NACRE exploits. When all paths are equivalent, SWAP minimization (what SABRE does) becomes the right objective again.
      </p>
      <p>
        NACRE&apos;s architecture is designed with this evolution in mind. Today, it exploits fidelity variance to find high-quality paths on NISQ hardware. As QPUs become fault-tolerant and gate fidelities become uniform, we will evolve NACRE to shift its optimization focus toward minimizing circuit depth and gate overhead, the metrics that matter most when errors are correctable. This adaptability means NACRE maximizes fidelity for today&apos;s noisy hardware while positioning itself for tomorrow&apos;s fault-tolerant systems.
      </p>
    

 

      <h2 id="bigger-picture">The Bigger Picture</h2>
      <p>
        NACRE represents a philosophical shift in quantum circuit compilation. Traditional routers inherited the classical computing mindset: operations are reliable, so minimize their count. But quantum operations are probabilistic. Every gate, every SWAP, every microsecond of waiting introduces some probability of error.
      </p>
      <p>
        The right objective function isn&apos;t &quot;minimize operations&quot;; it&apos;s &quot;maximize the probability that this computation returns the correct answer.&quot; NACRE is a production routing engine built around this principle.
      </p>
      <p>
        As quantum processors scale from hundreds to thousands of qubits, and as error correction becomes practical, the routing problem will evolve. But the core principle remains essential: <strong>optimize for fidelity, not for proxy metrics</strong>. Today&apos;s NISQ devices are teaching us how to work with imperfect quantum systems, and that knowledge will carry forward into the fault-tolerant era.
      </p>

      <div
        className={`mt-12 p-6 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
      >
        <p className="font-medium mb-2">
          NACRE is available now in <a href="https://coda.conductorquantum.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Coda</a>, automatically optimizing your quantum circuits for maximum fidelity on the specific hardware they&apos;ll run on.
        </p>
        <p className="text-sm opacity-75">
          No configuration required. Submit your circuit and let the routing engine find the highest-fidelity path.
        </p>
      </div>
    </>
  )
}

// Blog post data - in a real app, this would come from a CMS or MDX files
const blogPosts: Record<string, {
  title: string
  date: string
  content: React.ReactNode | ((isDarkMode: boolean) => React.ReactNode)
  hasInteractiveContent?: boolean
  toc?: TocItem[]
}> = {
  "circuit-matching-problem": {
    title: "Noise-Aware Circuit Matching: A GPS for Quantum Hardware",
    date: "2026-01-30",
    content: (isDarkMode: boolean) => <CircuitMatchingContent isDarkMode={isDarkMode} />,
    hasInteractiveContent: true,
    toc: circuitMatchingToc,
  },

}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = blogPosts[slug]
  
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isTocCollapsed, setIsTocCollapsed] = useState(false)
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Post not found</h1>
          <Link href="/blog" className="underline hover:opacity-70">
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-black text-white" : "bg-white text-black"}`}>
      {/* Mobile TOC Drawer */}
      {post.toc && post.toc.length > 0 && (
        <MobileTableOfContents
          items={post.toc}
          isDarkMode={isDarkMode}
          isOpen={isMobileTocOpen}
          onClose={() => setIsMobileTocOpen(false)}
        />
      )}

      {/* Mobile TOC Floating Button */}
      {post.toc && post.toc.length > 0 && (
        <button
          onClick={() => setIsMobileTocOpen(true)}
          className={`fixed bottom-6 right-6 z-30 p-3 rounded-full shadow-lg transition-colors lg:hidden ${
            isDarkMode 
              ? "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20" 
              : "bg-black/10 hover:bg-black/20 backdrop-blur-sm border border-black/20"
          }`}
          aria-label="Open table of contents"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col min-h-screen">
        {/* Top bar with back button and theme toggle */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <Link
            href="/"
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
            }`}
            aria-label="Back to home"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        {/* Main content wrapper with sidebar */}
        <div className="flex-grow flex gap-8 lg:gap-12">
          {/* Table of Contents Sidebar - Left side (hidden on mobile) */}
          {post.toc && post.toc.length > 0 && (
            <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
              <TableOfContents 
                items={post.toc} 
                isDarkMode={isDarkMode} 
                isCollapsed={isTocCollapsed}
                onToggle={() => setIsTocCollapsed(!isTocCollapsed)}
              />
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-4xl mx-auto lg:mx-0">
            {/* Blog Post Content */}
            <article className="mb-12 sm:mb-16">
              <header className="mb-8 sm:mb-10">
                <span className="font-mono text-sm opacity-75">{formatDate(post.date)}</span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium mt-2 leading-tight">
                  {post.title}
                </h1>
              </header>
              
              <div className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none ${isDarkMode ? "prose-invert" : ""}`}>
                <style jsx>{`
                  div :global(p) {
                    margin-bottom: 1.5rem;
                    line-height: 1.8;
                    opacity: 0.9;
                  }
                  @media (min-width: 640px) {
                    div :global(p) {
                      margin-bottom: 1.75rem;
                    }
                  }
                  div :global(h2) {
                    font-size: 1.25rem;
                    font-weight: 500;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                    scroll-margin-top: 80px;
                  }
                  @media (min-width: 640px) {
                    div :global(h2) {
                      font-size: 1.375rem;
                      margin-top: 3rem;
                      margin-bottom: 1.25rem;
                    }
                  }
                  div :global(h3) {
                    font-size: 1.1rem;
                    font-weight: 500;
                    margin-top: 2rem;
                    margin-bottom: 0.75rem;
                    scroll-margin-top: 80px;
                  }
                  @media (min-width: 640px) {
                    div :global(h3) {
                      font-size: 1.15rem;
                      margin-top: 2.5rem;
                      margin-bottom: 1rem;
                    }
                  }
                  div :global(ul), div :global(ol) {
                    margin-bottom: 1.5rem;
                    padding-left: 1.25rem;
                    list-style-type: disc;
                  }
                  @media (min-width: 640px) {
                    div :global(ul), div :global(ol) {
                      margin-bottom: 1.75rem;
                      padding-left: 1.5rem;
                    }
                  }
                  div :global(ol) {
                    list-style-type: decimal;
                  }
                  div :global(li) {
                    margin-bottom: 0.5rem;
                    line-height: 1.8;
                    opacity: 0.9;
                  }
                  @media (min-width: 640px) {
                    div :global(li) {
                      margin-bottom: 0.625rem;
                    }
                  }
                  div :global(pre) {
                    margin-bottom: 1.5rem;
                    font-size: 0.8rem;
                  }
                  @media (min-width: 640px) {
                    div :global(pre) {
                      margin-bottom: 1.75rem;
                      font-size: 0.875rem;
                    }
                  }
                  div :global(strong) {
                    font-weight: 500;
                  }
                  div :global(em) {
                    font-style: italic;
                  }
                  div :global(table) {
                    font-size: 0.8rem;
                  }
                  @media (min-width: 640px) {
                    div :global(table) {
                      font-size: 0.875rem;
                    }
                  }
                `}</style>
                {typeof post.content === 'function' ? post.content(isDarkMode) : post.content}
              </div>
            </article>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="mt-auto pt-6 sm:pt-8 pb-4">
          <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
            <Link href="/" className="hover:opacity-70">Home</Link>
            <Link href="/blog" className="hover:opacity-70">Blog</Link>
            <a href="https://x.com/joelpendleton" className="hover:opacity-70">X</a>
            <a href="https://www.linkedin.com/in/joelpendleton" className="hover:opacity-70">LinkedIn</a>
            <a href="https://github.com/joelpendleton" className="hover:opacity-70">GitHub</a>
            <a href="mailto:contact@joelpendleton.com" className="hover:opacity-70">Email</a>
          </div>
        </div>
      </div>
    </div>
  )
}
