import { Form } from "react-router-dom"
import './App.css'
import Navbar from "./components/Navbar/Navbar"
import Home from "./pages/Home/Home"
import Register from "./pages/Register/Register"
function App() {
  return (
    <div id="home">
    <Navbar/>
    <Register/>
    </div>
  )
}

export default App