import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage'; 
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import MyEvents from "./pages/MyEvents"; 
import HackathonDetails from "./pages/HackathonDetails";
import CreateTeam from "./pages/CreateTeam";
import ManageTeam from "./pages/ManageTeam";
import ExplorePage from "./pages/ExplorePage";
import { useSelector } from "react-redux";
import UserProfile from "./pages/UserProfile";
import ViewTeam from "./pages/ViewTeam";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-transparent mt-7">
        <Navbar /> 
        <main>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            
            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={user && user.role === 'Admin' ? <AdminDashboard /> : <Navigate to='/' />}
            />
            <Route
              path="/my-events" 
              element={user && user.role === 'Admin' ? <MyEvents /> : <Navigate to='/' />}
            />

            {/* HACKATHON & TEAM ROUTES */}
            <Route path="/hackathon/:id" element={<HackathonDetails />} />
            <Route path="/hackathon/:id/create-team" element={<CreateTeam />} />
            
            
            <Route path="/hackathon/:id/my-team" element={<ViewTeam />} />
            
            <Route path="/manage-team/:teamId" element={<ManageTeam />} />
            <Route path="/user/:id" element={<UserProfile />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;