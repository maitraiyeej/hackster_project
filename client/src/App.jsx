import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage'; 
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import MyEvents from "./pages/MyEvents"; // 1. IMPORT YOUR NEW PAGE
import HackathonDetails from "./pages/HackathonDetails";
import CreateTeam from "./pages/CreateTeam";
import ManageTeam from "./pages/ManageTeam";
import ExplorePage from "./pages/ExplorePage";
import { useSelector } from "react-redux";
import UserProfile from "./pages/UserProfile";

function App() {
  const {user} = useSelector((state) => state.auth);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    // Listen for storage events (helpful if login happens in another tab)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar  /> 
        <main>
          <Routes>
            <Route path="/" element={<HomePage user = {user}/>} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            
            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={user && user.role === 'Admin' ? <AdminDashboard /> : <Navigate to='/' />}
            />
            <Route
              path="/my-events" // 2. REGISTER THE ROUTE
              element={user && user.role === 'Admin' ? <MyEvents /> : <Navigate to='/' />}
            />

            {/* HACKATHON & TEAM ROUTES */}
            <Route path="/hackathon/:id" element={<HackathonDetails/>} />
            <Route path="/hackathon/:id/create-team" element={<CreateTeam/>}/>
            <Route path="/manage-team/:teamId" element={<ManageTeam/>}/>
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;