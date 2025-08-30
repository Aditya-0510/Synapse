import Dashboard from "./pages/Dashboard"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import  SharedPage  from "./pages/SharedPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<LandingPage/>} />
        <Route path="/share/:shareId" element={<SharedPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
