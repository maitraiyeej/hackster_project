// client/src/components/Navbar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //theme toggle 
    // Get the user data from our Redux state
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout()); // Clears Redux state and LocalStorage
        navigate('/login');
    };

    return (
        <nav className="h-16 bg-white shadow-md flex justify-between items-center px-10 z-10">
            <Link to="/" className="text-xl font-bold text-indigo-700">HackSter</Link>

            <div className="space-x-6 flex items-center">
                <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>

                {user ? (
                    <>
                        <span className="text-gray-800 font-medium">Hello, {user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                        <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded">Register</Link>
                    </>
                )}


            </div>


        </nav>
    );
};

export default Navbar;