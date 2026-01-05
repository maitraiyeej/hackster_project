// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage'; // Make sure this filename is correct

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Landing/Home Route */}
        <Route path="/" element={<h1>Home - Authentication Needed</h1>}/>
        
        {/* Login Route */}
        <Route path="/login" element={<LoginPage/>}/>
        
        {/* FIX: Changed <Router> to <Route> and matched the component name */}
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;