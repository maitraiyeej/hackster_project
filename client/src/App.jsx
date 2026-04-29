import Leaderboard from "./pages/Leaderboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from "./pages/AdminDashboard";
import MyEvents from "./pages/MyEvents";
import HackathonDetails from "./pages/HackathonDetails";
import CreateTeam from "./pages/CreateTeam";
import ManageTeam from "./pages/ManageTeam";
import UserProfile from "./pages/UserProfile";
import ViewTeam from "./pages/ViewTeam";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="relative isolate flex flex-col min-h-screen bg-gray-300">

        <Navbar />

        <main className="flex-grow bg-transparent">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path='/register' element={<RegisterPage />} />


            <Route element={<ProtectedRoute />}>
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/hackathon/:id/create-team" element={<CreateTeam />} />
              <Route path="/hackathon/:id/my-team" element={<ViewTeam />} />
              <Route path="/manage-team/:teamId" element={<ManageTeam />} />
            </Route>


            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/my-events" element={<MyEvents />} />
            </Route>

            <Route path="/hackathon/:id" element={<HackathonDetails />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeButton={false}
          hideProgressBar={true}
          toastClassName={() =>
            "bg-transparent shadow-none p-0 border-none"
          }
          bodyClassName={() => "p-0"}
        />

      </div>
    </Router>
  );
}

export default App;