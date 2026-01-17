// client/src/components/Navbar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout()); 
        navigate('/login');
    };

    return (
        <nav className="w-full h-20 bg-white border-b-2 border-black flex justify-between items-center px-10 sticky top-0 z-50">
            <Link to="/" className="text-3xl font-black tracking-tighter uppercase italic">
                Hack<span className="bg-black text-white px-1 not-italic">Ster</span>
            </Link>

            <div className="flex items-center gap-8">
                <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:underline decoration-2 underline-offset-4">
                    Home
                </Link>

                {user ? (
                    <div className="flex items-center gap-6">
                        {user.role === 'Admin' && (
                            <Link 
                                to="/admin" 
                                className="border-2 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white px-3 py-1 hover:invert transition-all"
                            >
                                + Create Event
                            </Link>
                        )}

                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Logged in as</span>
                            <span className="text-xs font-bold uppercase tracking-tighter">{user.name}</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="border-2 border-black px-5 py-2 text-[10px] text-red-600 border-red-600 font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                        >
                            Logout ×
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest">
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-black text-white border-2 border-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                            Register →
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;