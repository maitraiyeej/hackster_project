// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage'; // Make sure this filename is correct
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
      <Navbar/>
        <main>
      <Routes>
        {/* Main Landing/Home Route */}
        <Route path="/" element={<HomePage/>}/>
        
        {/* Login Route */}
        <Route path="/login" element={<LoginPage/>}/>
        
        {/* FIX: Changed <Router> to <Route> and matched the component name */}
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>

        </main>
      </div>
    </Router>
  );
}

export default App;