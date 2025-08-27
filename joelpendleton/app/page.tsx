"use client"

import { Dithering, DitheringShapes } from "@paper-design/shaders-react"
import { useState, useMemo } from "react"

export default function ResumePage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  // Available shapes from the Dithering component
  const shapes = ['simplex', 'warp', 'dots', 'wave', 'swirl']
  
  // Randomly select a shape on each render
  const randomShape = useMemo(() => {
    return shapes[Math.floor(Math.random() * shapes.length)]
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-wrap">
      <div className={`flex-grow min-w-[640px] p-4 sm:p-8 relative z-10 flex flex-col ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        {/* Theme toggle button in top right of left panel */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-4 sm:top-8 right-4 sm:right-8 p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            // Sun icon for light mode
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Main content wrapper */}
        <div className="flex-grow">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="mb-6 sm:mb-8 pt-8 sm:pt-12">
              <h2 className="text-xl sm:text-lg font-normal">Joel Pendleton</h2>
              <h3 className="text-xl sm:text-lg font-normal">CTO at <a href="https://conductorquantum.com" className="underline">Conductor Quantum</a>  </h3>
              <p className="text-sm opacity-75 mt-2">Building quantum computers on silicon chips</p>
            </div>
          </div>

        {/* Experience Section */}
        <div className="mb-12">
          {/* Mobile Layout - Stack Company Name, then Role + Date */}
          <div className="block sm:hidden space-y-4 text-sm">
            <div>
              <div className="font-medium">Conductor Quantum</div>
              <div className="opacity-75">Co-Founder & CTO • Jun 2024 - Present</div>
                <div className="font-mono"></div>
            </div>
            <div>
              <div className="font-medium">Feynman</div>
              <div className="flex justify-between">
                <span className="opacity-75">Co-Founder & CTO • Dec 2022 - May 2024</span>
              </div>
            </div>
            <div>
              <div className="font-medium">QuantrolOx</div>
              <div className="flex justify-between">
                <span className="opacity-75">Applied Researcher • Dec 2022 - May 2024</span>
              </div>
            </div>

            <div>
              <div className="font-medium">C12</div>
              <div className="flex justify-between">
                <span className="opacity-75">Research Intern • Jun 2022 - Sep 2022</span>
              </div>
            </div>
            <div>
              <div className="font-medium">Quantum Motion</div>
              <div className="flex justify-between">
                <span className="opacity-75">Research Intern • Jun 2021 - Sep 2021</span>
              </div>
            </div>
            <div>
              <div className="font-medium">Quantum Motion</div>
              <div className="flex justify-between">
                <span className="opacity-75">Research Intern • Jun 2020 - Sep 2020</span>
              </div>
            </div>
            
            <div className="py-2"></div>
            
            <div>
              <div className="font-medium">Oxford</div>
              <div className="flex justify-between">
                <span className="opacity-75">DPhil • Oct 2023 - May 2024</span>
              </div>
            </div>
            <div>
              <div className="font-medium">Y Combinator</div>
              <div className="flex justify-between">
                <span className="opacity-75">S24 • Jul 2024 - Sep 2024</span>
              </div>
            </div>
            <div>
              <div className="font-medium">UCL</div>
              <div className="flex justify-between">
                <span className="opacity-75">MSci • Sep 2018 - Jun 2022</span>
              </div>
            </div>
          </div>

          {/* Desktop Table Layout */}
          <table className="hidden sm:table text-base w-[600px] lg:text-lg lg:w-[640px]">
            <colgroup>
              <col className="w-30 lg:w-56" />
              <col className="w-30 lg:w-64" />
              <col className="w-28 lg:w-32" />
            </colgroup>
            <tbody>
              <tr>
                <td className=" overflow-hidden text-ellipsis whitespace-nowrap">Conductor Quantum</td>
                <td className=" overflow-hidden text-ellipsis whitespace-nowrap">Co-Founder & CTO</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Jun 2024 - Present</td>
              </tr>

              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Feynman</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Co-Founder & CTO</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Dec 2022 - May 2024</td>
              </tr>
              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">QuantrolOx</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Applied Researcher</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Dec 2022 - May 2024</td>
              </tr>
              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Unify</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">ML Engineer Intern</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Oct 2022 - Nov 2022</td>
              </tr>
              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">C12</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Research Intern</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Jun 2022 - Sep 2022</td>
              </tr>

              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Quantum Motion</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Research Intern</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Jun 2021 - Sep 2021</td>
              </tr>
              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Quantum Motion</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Research Intern</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Jun 2020 - Sep 2020</td>
              </tr>
              <tr>
                <td className="py-4" colSpan={3}></td>
              </tr>
              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Oxford</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">DPhil</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Oct 2023 - May 2024</td>
              </tr>
              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">Y Combinator</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">S24</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Jul 2024 - Sep 2024</td>
              </tr>
              <tr>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">UCL</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">MSci</td>
                <td className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">Sep 2018 - Jun 2022</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>

        {/* Footer Links Section - positioned at bottom */}
        <div className="mt-auto py-2 sm:pb-0 sm:pt-8">
          <div className="flex space-x-4 text-sm">
            <a href="https://x.com/joelpendleton" className="hover:opacity-70">X</a>
            <a href="https://www.linkedin.com/in/joelpendleton" className="hover:opacity-70">LinkedIn</a>
            <a href="https://github.com/joelpendleton" className="hover:opacity-70">GitHub</a>
            <a href="mailto:contact@joelpendleton.com" className="hover:opacity-70">Email</a>
          </div>
        </div>
      </div>

      <div className="flex-grow min-w-1/2 h-min-screen  relative">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "hsl(0, 0%, 0%)" : "hsl(0, 0%, 95%)"}
          colorFront="hsl(220, 100%, 70%)"
          shape={randomShape as DitheringShapes}
          type="4x4"
          pxSize={3}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      </div>
    </div>
  )
}
