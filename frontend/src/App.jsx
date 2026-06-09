// import "./App.css"
// import { useState, useEffect } from "react"
// import Profilesetup from "./components/Profilesetup"
// import Starsbackground from "./components/Starsbackground"
// import PadidaLogo from "./components/PadidaLogo"
// import AvatarSetup from "./components/AvatarSetup"
// import Homepage from "./components/Homepage"
// import Settings from "./components/Settings"
// function App() {
//   const [page, setPage] = useState("logo")
//   const [theme, setTheme]= useState(()=>{
//     const settings = JSON.parse(localStorage.getItem("padida-settings")||"{}")
//     return settings.theme||"space"
//   })
//   useEffect(() => {
//     setTimeout(() => {
//       setPage("profile")
//     }, 8700)
//   }, [])

//   return (
//     <div className={`app theme-${theme}`}>
//       {theme === "space" && <Starsbackground/>}
//       {page === "logo" && <PadidaLogo/>}
//       {page === "profile" && <Profilesetup onNext={() => setPage("style")}/>}
//       {/* {page === "style" && <AvatarSetup/>}   */}
//       {page === "style" && <AvatarSetup onNext={() => setPage("home")}/>} 
//       {page === "home" && <Homepage
//        onSettings={()=> setPage("settings")}
//        onhome={()=> setPage("home")}
//        theme={theme}
//        onEditAvatar={()=> setPage("style")}
//        />}
//        {page === "settings"&& <Settings 
//        onHome ={()=> setPage("home")}
//        onThemeChange={(t)=> setTheme(t)}
//        theme={theme}
//        />}
//     </div>
//   )
// }

// export default App
// import "./App.css"
// import { useState, useEffect } from "react"
// import Profilesetup from "./components/Profilesetup"
// import Starsbackground from "./components/Starsbackground"
// import PadidaLogo from "./components/PadidaLogo"
// import AvatarSetup from "./components/AvatarSetup"
// import Homepage from "./components/Homepage"
// import Settings from "./components/Settings"
// import ThemeEffects from "./components/ThemeEffects"

// function App() {
//   const [page, setPage] = useState("logo")
//   const [theme, setTheme] = useState(() => {
//     const settings = JSON.parse(localStorage.getItem("padida-settings") || "{}")
//     return settings.theme || "space"
//   })

//   useEffect(() => {
//     setTimeout(() => {
//       setPage("profile")
//     }, 8700)
//   }, [])

//   return (
//     <div className={`app theme-${theme}`}>
//       {theme === "space" && <Starsbackground />}
//       {theme !== "space" && <ThemeEffects theme={theme} />}

//       {page === "logo"     && <PadidaLogo />}
//       {page === "profile"  && <Profilesetup onNext={() => setPage("style")} />}
//       {page === "style"    && <AvatarSetup onNext={() => setPage("home")} />}
//       {page === "home"     && <Homepage
//         onSettings={() => setPage("settings")}
//         onhome={() => setPage("home")}
//         theme={theme}
//         onEditAvatar={() => setPage("style")}
//       />}
//       {page === "settings" && <Settings
//         onHome={() => setPage("home")}
//         onThemeChange={(t) => setTheme(t)}
//         theme={theme}
//       />}
//     </div>
//   )
// }

// export default App
import "./App.css"
import { useState, useEffect } from "react"
import Profilesetup from "./components/Profilesetup"
import Starsbackground from "./components/Starsbackground"
import PadidaLogo from "./components/PadidaLogo"
import AvatarSetup from "./components/AvatarSetup"
import Homepage from "./components/Homepage"
import Settings from "./components/Settings"

function App() {
  const [page, setPage] = useState("logo")
  const [theme, setTheme] = useState(() => {
    const settings = JSON.parse(localStorage.getItem("padida-settings") || "{}")
    return settings.theme || "space"
  })

  useEffect(() => {
    setTimeout(() => {
      setPage("profile")
    }, 8700)
  }, [])

  return (
    <div className={`app theme-${theme}`}>
      {theme === "space" && <Starsbackground />}
      {page === "logo"     && <PadidaLogo />}
      {page === "profile"  && <Profilesetup onNext={() => setPage("style")} />}
      {page === "style"    && <AvatarSetup onNext={() => setPage("home")} />}
      {page === "home"     && <Homepage
        onSettings={() => setPage("settings")}
        onhome={() => setPage("home")}
        theme={theme}
        onEditAvatar={() => setPage("style")}
      />}
      {page === "settings" && <Settings
        onHome={() => setPage("home")}
        onThemeChange={(t) => setTheme(t)}
        theme={theme}
      />}
    </div>
  )
}

export default App