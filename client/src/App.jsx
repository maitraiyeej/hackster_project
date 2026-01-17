import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Added hooks
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage'; 
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import HackathonDetails from "./pages/HackathonDetails";
import CreateTeam from "./pages/CreateTeam";
import ManageTeam from "./pages/ManageTeam";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    handleStorageChange();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Use the 'user' state here instead of the raw variable */}
            <Route
              path="/admin"
              element={
                user && user.role === 'Admin' ? <AdminDashboard /> : <Navigate to='/' />
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path="/hackathon/:id" element={<HackathonDetails/>} />
            <Route path="/hackathon/:id/create-team" element={<CreateTeam/>}/>
            <Route path="/manage-team/:teamId" element={<ManageTeam/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;