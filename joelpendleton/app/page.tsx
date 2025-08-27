"use client"

import { Dithering, DitheringShapes } from "@paper-design/shaders-react"
import { useState, useMemo } from "react"

export default function ResumePage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  // Available shapes from the Dithering component
  const shapes = ['simplex', 'warp', 'dots', 'wave', 'ripple', 'swirl', 'sphere']
  
  // Randomly select a shape on each render
  const randomShape = useMemo(() => {
    return shapes[Math.floor(Math.random() * shapes.length)]
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col lg:flex-row">
      <div className={`w-full lg:w-1/2 p-4 sm:p-8 relative z-10 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
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
          <table className="w-full text-sm  xl:text-lg">
            <tbody>
              <tr>
                <td className="w-1/4 sm:w-52 pr-2 sm:pr-4">Conductor Quantum</td>
                <td className="w-1/3 sm:w-60 pr-2 sm:pr-4">Co-Founder & CTO</td>
                <td className="text-right sm:text-left">Jun 2024 → Present</td>
              </tr>
              <tr>
                <td className="w-1/4 sm:w-52 pr-2 sm:pr-4">QuantrolOx</td>
                <td className="w-1/3 sm:w-60 pr-2 sm:pr-4">Applied Researcher</td>
                <td className="text-right sm:text-left">Dec 2022 → May 2024</td>
              </tr>
              <tr>
                <td className="w-1/4 sm:w-52 pr-2 sm:pr-4">Feynman</td>
                <td className="w-1/3 sm:w-60 pr-2 sm:pr-4">Co-Founder & CTO</td>
                <td className="text-right sm:text-left">Dec 2022 → May 2024</td>
              </tr>
              <tr>
                <td className="w-1/4 sm:w-52 pr-2 sm:pr-4">C12</td>
                <td className="w-1/3 sm:w-60 pr-2 sm:pr-4">Research Intern</td>
                <td className="text-right sm:text-left">Jun 2022 → Sep 2022</td>
              </tr>
              <tr>
                <td className="w-1/4 sm:w-52 pr-2 sm:pr-4">Quantum Motion</td>
                <td className="w-1/3 sm:w-60 pr-2 sm:pr-4">Research Intern</td>
                <td className="text-right sm:text-left">Jun 2021 → Sep 2021</td>
              </tr>
              <tr>
                <td className="w-1/4 sm:w-52 pr-2 sm:pr-4">Quantum Motion</td>
                <td className="w-1/3 sm:w-60 pr-2 sm:pr-4">Research Intern</td>
                <td className="text-right sm:text-left">Jun 2020 → Sep 2020</td>
              </tr>
              <tr className="">
                <td className="w-1/4 md:w-52 pr-2 md:pr-4">&nbsp;</td>
                <td className="w-1/3 md:w-60 pr-2 md:pr-4">&nbsp;</td>
                <td className="text-right sm:text-left">&nbsp;</td>
              </tr>
              <tr>
                <td className="w-1/4 md:w-52 pr-2 md:pr-4">Oxford</td>
                <td className="w-1/3 md:w-60 pr-2 md:pr-4">DPhil</td>
                <td className="text-right sm:text-left">Oct 2023 → May 2024</td>
              </tr>
              <tr>
                <td className="w-1/4 md:w-52 pr-2 md:pr-4">Y Combinator</td>
                <td className="w-1/3 md:w-60 pr-2 md:pr-4">S24</td>
                <td className="text-right sm:text-left">Jul 2024 → Sep 2024</td>
              </tr>
              <tr>
                <td className="w-1/4 md:w-52 pr-2 md:pr-4">UCL</td>
                <td className="w-1/3 md:w-60 pr-2 md:pr-4">MSci</td>
                <td className="text-right sm:text-left">Sep 2018 → Jun 2022</td>
              </tr>
            </tbody>
          </table>
        </div>



        {/* Footer Links Section */}
        <div className="mt-8 lg:absolute lg:bottom-8 lg:left-4 xl:left-8">
          <div className="flex space-x-4 text-sm">
            <a href="https://x.com/joelpendleton" className="hover:opacity-70">X</a>
            <a href="https://www.linkedin.com/in/joelpendleton" className="hover:opacity-70">LinkedIn</a>
            <a href="https://github.com/joelpendleton" className="hover:opacity-70">GitHub</a>
            <a href="mailto:contact@joelpendleton.com" className="hover:opacity-70">Email</a>
          </div>
        </div>
      </div>

      <div className="w-full  l:w-1/2 h-64 lg:h-auto relative">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "hsl(0, 0%, 0%)" : "hsl(0, 0%, 95%)"}
          colorFront={isDarkMode ? "hsl(220, 100%, 70%)": "hsl(320, 100%, 70%)"}
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
