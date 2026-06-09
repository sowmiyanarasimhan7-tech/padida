// // import { useCallback } from "react"
// // import Particles from "react-tsparticles"
// // import { loadFull } from "tsparticles"
// // import "../assets/css/ThemeEffects.css"
// // export default function ThemeEffects({ theme }) {
// //   if (theme === "space") return null

// //   const particlesInit = useCallback(async (engine) => {
// //     await loadFull(engine)
// //   }, [])

// //   const colors = {
// //     forest: "#fff7a0",
// //     sea:    "#9be7ff",
// //     desert: "#ffd27f"
// //   }

// //   return (
// //     <Particles
// //       id={`particles-${theme}`}
// //       init={particlesInit}
// //       options={{
// //         fullScreen: {
// //           enable: true,
// //           zIndex: -1
// //         },
// //         background: {
// //           color: { value: "transparent" }
// //         },
// //         particles: {
// //           number: { value: 100 },
// //           color: { value: colors[theme] },
// //           size: { value: { min: 1, max: 3 } },
// //           move: {
// //             enable: true,
// //             speed: 0.3
// //           },
// //           opacity: { value: 0.7 }
// //         }
// //       }}
// //     />
// //   )
// // }
// import { useCallback } from "react"
// import Particles from "react-tsparticles"
// import { loadFull } from "tsparticles"

// export default function ThemeEffects({ theme }) {
//   if (theme === "space") return null

//   const particlesInit = useCallback(async (engine) => {
//     await loadFull(engine)
//   }, [])

//   const configs = {
//     forest: {
//       particles: {
//         number: { value: 40 },
//         shape: {
//           type: "char",
//           options: {
//             char: {
//               value: ["🍃", "🍂", "🌿"],
//               font: "Verdana",
//               style: "",
//               weight: "400",
//               fill: true
//             }
//           }
//         },
//         size: { value: { min: 10, max: 18 } },
//         opacity: { value: { min: 0.4, max: 0.9 } },
//         rotate: {
//           value: { min: 0, max: 360 },
//           animation: { enable: true, speed: 3 }
//         },
//         move: {
//           enable: true,
//           speed: 1.2,
//           direction: "bottom",
//           random: true,
//           straight: false,
//           outModes: { default: "out" }
//         }
//       }
//     },

//     sea: {
//       particles: {
//         number: { value: 60 },
//         shape: { type: "circle" },
//         color: { value: "#9be7ff" },
//         size: { value: { min: 4, max: 14 } },
//         opacity: { value: { min: 0.1, max: 0.4 } },
//         stroke: { width: 1.5, color: "#9be7ff" },
//         fill: false,
//         move: {
//           enable: true,
//           speed: 0.6,
//           direction: "top",
//           random: true,
//           straight: false,
//           outModes: { default: "out" }
//         }
//       }
//     },

//     desert: {
//       particles: {
//         number: { value: 80 },
//         shape: { type: "circle" },
//         color: { value: ["#c8a96e", "#e8c99e", "#a87840", "#f0d080"] },
//         size: { value: { min: 1, max: 4 } },
//         opacity: { value: { min: 0.2, max: 0.7 } },
//         move: {
//           enable: true,
//           speed: 0.8,
//           direction: "right",
//           random: true,
//           straight: false,
//           outModes: { default: "out" },
//           drift: 1
//         }
//       }
//     }
//   }

//   return (
//     <Particles
//       id={`particles-${theme}`}
//       init={particlesInit}
//       options={{
//         fullScreen: { enable: true, zIndex: -1 },
//         background: { color: { value: "transparent" } },
//         ...configs[theme]
//       }}
//     />
//   )
// }
import { useCallback } from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import "../assets/css/ThemeEffects.css"

export default function ThemeEffects({ theme }) {
  if (theme === "space") return null

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine)
  }, [])

  const colors = {
    forest: "#fff7a0",
    sea:    "#9be7ff",
    desert: "#ffd27f"
  }

  return (
    <Particles
      id={`particles-${theme}`}
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1
        },
        background: {
          color: { value: "transparent" }
        },
        particles: {
          number: { value: 100 },
          color: { value: colors[theme] },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 0.3
          },
          opacity: { value: 0.7 }
        }
      }}
    />
  )
}