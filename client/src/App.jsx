import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import your new Footer component

// PAGES
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage'; 
import AdminDashboard from "./pages/AdminDashboard";
import MyEvents from "./pages/MyEvents"; 
import HackathonDetails from "./pages/HackathonDetails";
import CreateTeam from "./pages/CreateTeam";
import ManageTeam from "./pages/ManageTeam";
import UserProfile from "./pages/UserProfile";
import ViewTeam from "./pages/ViewTeam";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      {/* flex-col + min-h-screen makes the container at least as tall as the screen.
        This allows us to use flexbox to stick the footer to the bottom.
      */}
      <div className="flex flex-col min-h-screen bg-transparent">
        
        <Navbar /> 

        {/* flex-grow tells the main content area to take up all available vertical space,
          effectively pushing the Footer down.
        */}
        <main className="flex-grow mt-8">
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

            {/* CATCH ALL */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* FOOTER RENDERED AT THE BOTTOM */}

      </div>
    </Router>
  );
}

export default App;