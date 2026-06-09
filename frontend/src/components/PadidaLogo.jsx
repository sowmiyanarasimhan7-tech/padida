// // ============================================
// //  PadidaLogo.jsx  — fully corrected
// // ============================================

// import { useEffect, useRef, useState } from "react";
// import rocketImg from "../assets/rocket.png";
// import "../assets/css/PadidaLogo.css";

// function clamp(v, lo, hi) {
//   return Math.max(lo, Math.min(hi, v));
// }

// let smokeIdCounter = 0;

// export default function PadidaLogo() {
//   const [rocketPos, setRocketPos]   = useState({ x: -120, y: 250, rotate: -10 });
//   const [smoke, setSmoke]           = useState([]);
//   const [showBubble, setShowBubble] = useState(false);
//   const [rocketGone, setRocketGone] = useState(false);

//   const startRef       = useRef(null);
//   const rafRef         = useRef(null);
//   const pathRef        = useRef(null);
//   const textShownRef   = useRef(false);
//   const rocketGoneRef  = useRef(false);
//   const pathReadyRef   = useRef(false);
//   const lastSmokeRef   = useRef(0);
//   const totalLengthRef = useRef(null);
//   const stopLengthRef  = useRef(null);
//   const bubblePosRef   = useRef({ x: 0, y: 0 }); // ← frozen bubble position

//   const VW = 600, VH = 460;

//   function spawnSmoke(point, nextPoint) {
//     const now = performance.now();
//     if (now - lastSmokeRef.current < 40) return;
//     lastSmokeRef.current = now;

//     const id = smokeIdCounter++;
//     const dx  = nextPoint.x - point.x;
//     const dy  = nextPoint.y - point.y;
//     const len = Math.hypot(dx, dy) || 1;
//     const bx  = -(dx / len);
//     const by  = -(dy / len);
//     const px  = -by;
//     const py  = bx;

//     const offset = 22;
//     const spread = (Math.random() - 0.5) * 18;
//     const sx   = point.x + bx * offset + px * spread;
//     const sy   = point.y + by * offset + py * spread;
//     const size = 4 + Math.random() * 8;

//     setSmoke(prev => [...prev.slice(-40), { id, x: sx, y: sy, size }]);
//     setTimeout(() => setSmoke(prev => prev.filter(p => p.id !== id)), 1000);
//   }

//   useEffect(() => {
//     startRef.current = performance.now();

//     function tick(now) {
//       const path = pathRef.current;

//       if (!path) {
//         rafRef.current = requestAnimationFrame(tick);
//         return;
//       }

//       if (!pathReadyRef.current) {
//         pathReadyRef.current   = true;
//         startRef.current       = now;
//         totalLengthRef.current = path.getTotalLength();
//         stopLengthRef.current  = totalLengthRef.current * 0.55; // stops in center
//       }

//       const elapsed     = now - startRef.current;
//       const totalLength = totalLengthRef.current;
//       const stopLength  = stopLengthRef.current;

//       let currentLength;

//       // Phase 1: fly in + loop
//       if (elapsed < 4200) {
//         currentLength = (elapsed / 4200) * stopLength;
//       }
//       // Phase 2: rocket holds, bubble pops and stays
//       else if (elapsed < 6200) {
//         currentLength = stopLength;

//         if (!textShownRef.current) {
//           textShownRef.current = true;

//           // ← freeze the bubble position right where rocket stopped
//           const safeLen = Math.min(stopLength, totalLength);
//           const pt = path.getTotalLength
//             ? path.getPointAtLength(safeLen)
//             : { x: 300, y: 230 };

//           bubblePosRef.current = { x: pt.x, y: pt.y };
//           setShowBubble(true); // show and never hide
//         }
//       }
//       // Phase 3: rocket exits, bubble stays
//       else {
//         const exitProgress = clamp((elapsed - 6200) / 1800, 0, 1);
//         currentLength = stopLength + (totalLength - stopLength) * exitProgress;

//         if (exitProgress > 0.85 && !rocketGoneRef.current) {
//           rocketGoneRef.current = true;
//           setRocketGone(true); // rocket disappears, bubble stays
//         }
//       }

//       const activePath = pathRef.current;
//       if (!activePath) {
//         rafRef.current = requestAnimationFrame(tick);
//         return;
//       }

//       const safeLength = Math.min(currentLength, totalLength);
//       const point      = activePath.getPointAtLength(safeLength);
//       const nextPoint  = activePath.getPointAtLength(Math.min(safeLength + 8, totalLength));

//       const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
//       setRocketPos({ x: point.x, y: point.y, rotate: angle + 50 }); // ← tilt fixed

//       spawnSmoke(point, nextPoint);

//       rafRef.current = requestAnimationFrame(tick);
//     }

//     rafRef.current = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(rafRef.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const rocketTransform = `translate(${rocketPos.x} ${rocketPos.y}) rotate(${rocketPos.rotate})`;

//   // ← always use frozen position, never follows rocket
//   const bubbleX = bubblePosRef.current.x + 20;
//   const bubbleY = bubblePosRef.current.y - 60;

//   return (
//     <div className="padida-logo-wrapper">
//       <svg
//         className="padida-stage"
//         viewBox={`0 0 ${VW} ${VH}`}
//         xmlns="http://www.w3.org/2000/svg"
//         aria-label="Padida animated logo"
//       >
//         <defs>
//           <linearGradient id="padidaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%"   stopColor="#ff9ee0" />
//             <stop offset="40%"  stopColor="#ffffff" />
//             <stop offset="100%" stopColor="#a0d4ff" />
//           </linearGradient>
//           <filter id="padidaGlow" x="-20%" y="-20%" width="140%" height="140%">
//             <feGaussianBlur stdDeviation="6" result="blur" />
//             <feMerge>
//               <feMergeNode in="blur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         {/* Stars */}
//         {[[60,60],[520,80],[150,380],[480,350],[300,40]].map(([sx,sy],i) => (
//           <circle
//             key={i}
//             className="star"
//             cx={sx} cy={sy} r={2}
//             fill="#ffffff"
//             style={{ animationDelay: `${i * 0.4}s` }}
//           />
//         ))}

//         {/* Smoke */}
//         {smoke.map(p => (
//           <circle
//             key={p.id}
//             cx={p.x} cy={p.y} r={p.size}
//             fill="rgba(180,190,210,0.5)"
//             style={{ animation: "smokeFade 1s ease-out forwards" }}
//           />
//         ))}

//         {/* Flight path */}
//         {!rocketGone && (
//           <path
//             ref={pathRef}
//             d="M -240 450 
//             C 40 390, 160 300, 220 180 
//             C 250 60, 70 60, 100 210 
//            C 130 360, 280 360, 280 360 
//            C 430 360, 700 400, 980 -100"
//             fill="none"
//             stroke="rgba(255,255,255,0.3)"
//             strokeWidth="3"
//             strokeDasharray="10 8"
//             strokeLinecap="round"
//           />
//         )}

//         {/* Rocket */}
//         {/* Rocket + Speech bubble together */}
// {!rocketGone && (
//   <g transform={rocketTransform} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.4))" }}>
//     <image
//       href={rocketImg}
//       x={-70} y={-70}
//       width="140" height="140"
//     />

//     {/* Speech bubble moves with rocket */}
//     {showBubble && (
//       <g style={{ animation: "bubblePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
//         <rect
//           x={20} y={-90}
//           width={110} height={38} rx={12}
//           fill="white" stroke="#ff6eb4" strokeWidth={2}
//         />
//         <polygon
//           points={`34,-52 26,-38 48,-52`}
//           fill="white" stroke="#ff6eb4" strokeWidth={2} strokeLinejoin="round"
//         />
//         <polygon
//           points={`35,-54 27,-40 47,-54`}
//           fill="white"
//         />
//         <text
//           x={75} y={-71}
//           textAnchor="middle"
//           dominantBaseline="middle"
//           fontFamily="'Nunito', 'Fredoka One', sans-serif"
//           fontWeight="800"
//           fontSize={16}
//           fill="#cc3a8a"
//         >
//           Padida! 🚀
//         </text>
//       </g>
//     )}
//   </g>
// )}
//       </svg>
//     </div>
//   );
// }
// ============================================
//  PadidaLogo.jsx  — fully corrected
// ============================================

import { useEffect, useRef, useState } from "react";
import rocketImg from "../assets/rocket.png";
import "../assets/css/PadidaLogo.css";

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

let smokeIdCounter = 0;

export default function PadidaLogo() {
   const [bubblePos, setBubblePos] = useState({x:0,y:0});
  const [rocketPos, setRocketPos]   = useState({ x: -120, y: 250, rotate: -10 });
  const [smoke, setSmoke]           = useState([]);
  const [showBubble, setShowBubble] = useState(false);
  const [rocketGone, setRocketGone] = useState(false);

  const startRef       = useRef(null);
  const rafRef         = useRef(null);
  const pathRef        = useRef(null);
  const textShownRef   = useRef(false);
  const rocketGoneRef  = useRef(false);
  const pathReadyRef   = useRef(false);
  const lastSmokeRef   = useRef(0);
  const totalLengthRef = useRef(null);
  const stopLengthRef  = useRef(null);
  const bubblePosRef   = useRef({ x: 0, y: 0 }); // ← frozen bubble position
  const bubbleHiddenRef= useRef(false);

  const VW = 600, VH = 460;

  function spawnSmoke(point, nextPoint) {
    const now = performance.now();
    if (now - lastSmokeRef.current < 40) return;
    lastSmokeRef.current = now;

    const id = smokeIdCounter++;
    const dx  = nextPoint.x - point.x;
    const dy  = nextPoint.y - point.y;
    const len = Math.hypot(dx, dy) || 1;
    const bx  = -(dx / len);
    const by  = -(dy / len);
    const px  = -by;
    const py  = bx;

    const offset = 22;
    const spread = (Math.random() - 0.5) * 18;
    const sx   = point.x + bx * offset + px * spread;
    const sy   = point.y + by * offset + py * spread;
    const size = 4 + Math.random() * 8;
   

    setSmoke(prev => [...prev.slice(-40), { id, x: sx, y: sy, size }]);
    setTimeout(() => setSmoke(prev => prev.filter(p => p.id !== id)), 1000);
  }

  useEffect(() => {
    startRef.current = performance.now();

    function tick(now) {
      const path = pathRef.current;

      if (!path) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!pathReadyRef.current) {
        pathReadyRef.current   = true;
        startRef.current       = now;
        totalLengthRef.current = path.getTotalLength();
        stopLengthRef.current  = totalLengthRef.current * 0.55; // stops in center
      }

      const elapsed     = now - startRef.current;
      const totalLength = totalLengthRef.current;
      const stopLength  = stopLengthRef.current;

      let currentLength;

      // Phase 1: fly in + loop
      if (elapsed < 4200) {
        currentLength = (elapsed / 4200) * stopLength;
      }
      // Phase 2: rocket holds, bubble pops and stays
      else if (elapsed < 6200) {
        currentLength = stopLength;

        if (!textShownRef.current) {
          textShownRef.current = true;

          // ← freeze the bubble position right where rocket stopped
          const safeLen = Math.min(stopLength, totalLength);
          const pt = path.getTotalLength
            ? path.getPointAtLength(safeLen)
            : { x: 300, y: 230 };

          bubblePosRef.current = { x: pt.x, y: pt.y };
          setBubblePos({x:pt.x, y:pt.y});
          setShowBubble(true); // show and never hide
        }
      }
      // Phase 3: rocket exits, bubble stays
      // Phase 3: rocket exits, bubble disappears
else {
  const exitProgress = clamp((elapsed - 6200) / 1800, 0, 1);
  currentLength = stopLength + (totalLength - stopLength) * exitProgress;

  // ← ADD THIS
  if (!bubbleHiddenRef.current) {
    bubbleHiddenRef.current = true;
    setShowBubble(false);
  }

  if (exitProgress > 0.85 && !rocketGoneRef.current) {
    rocketGoneRef.current = true;
    setRocketGone(true);
  }
}
      const activePath = pathRef.current;
      if (!activePath) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const safeLength = Math.min(currentLength, totalLength);
      const point      = activePath.getPointAtLength(safeLength);
      const nextPoint  = activePath.getPointAtLength(Math.min(safeLength + 8, totalLength));

      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
      setRocketPos({ x: point.x, y: point.y, rotate: angle + 50 }); // ← tilt fixed

      spawnSmoke(point, nextPoint);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rocketTransform = `translate(${rocketPos.x} ${rocketPos.y}) rotate(${rocketPos.rotate})`;

  // ← always use frozen position, never follows rocket
  const bubbleX = bubblePos.x + 20;
  const bubbleY = bubblePos.y - 60;

  return (
    <div className="padida-logo-wrapper">
      <svg
        className="padida-stage"
        viewBox={`0 0 ${VW} ${VH}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Padida animated logo"
      >
        <defs>
          <linearGradient id="padidaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#ff9ee0" />
            <stop offset="40%"  stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a0d4ff" />
          </linearGradient>
          <filter id="padidaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stars */}
        {[[60,60],[520,80],[150,380],[480,350],[300,40]].map(([sx,sy],i) => (
          <circle
            key={i}
            className="star"
            cx={sx} cy={sy} r={2}
            fill="#ffffff"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}

        {/* Smoke */}
        {smoke.map(p => (
          <circle
            key={p.id}
            cx={p.x} cy={p.y} r={p.size}
            fill="rgba(180,190,210,0.5)"
            style={{ animation: "smokeFade 1s ease-out forwards" }}
          />
        ))}

        {/* Flight path */}
        {!rocketGone && (
          <path
            ref={pathRef}
            d="M -240 450 C 40 390, 160 300, 220 180 C 250 60, 70 60, 100 210 C 130 360, 280 360, 280 360 C 430 360, 700 400, 980 -100"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
            strokeDasharray="10 8"
            strokeLinecap="round"
          />
        )}

        {/* Rocket */}
        {!rocketGone && (
          <g transform={rocketTransform} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.4))" }}>
            <image
              href={rocketImg}
              x={-70} y={-70}
              width="140" height="140"
            />
          </g>
        )}

        {/* Speech bubble — frozen at stop position, stays after rocket leaves */}
        {showBubble && (
          <g
            style={{
              animation: "bubblePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <rect
              x={bubbleX} y={bubbleY}
              width={110} height={38} rx={12}
              fill="white" stroke="#ff6eb4" strokeWidth={2}
            />
            <polygon
              points={`${bubbleX+14},${bubbleY+38} ${bubbleX+6},${bubbleY+52} ${bubbleX+28},${bubbleY+38}`}
              fill="white" stroke="#ff6eb4" strokeWidth={2} strokeLinejoin="round"
            />
            <polygon
              points={`${bubbleX+15},${bubbleY+36} ${bubbleX+7},${bubbleY+50} ${bubbleX+27},${bubbleY+36}`}
              fill="white"
            />
            <text
              x={bubbleX + 55} y={bubbleY + 19}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Nunito', 'Fredoka One', sans-serif"
              fontWeight="800"
              fontSize={16}
              fill="#cc3a8a"
            >
              Padida! 🚀
            </text>
          </g>
        )}

      </svg>
    </div>
  );
}