import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

const LoginPage = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [login, { isLoading, error }] = useLoginMutation();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(formData).unwrap();

            dispatch(setCredentials(userData));

            navigate('/');
        }
        catch (error) {
            console.error('Login failed:', error);
        }
    }

    return (
        <div className='flex h-full items-center justify-center p-4'>
            <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-2xl'>
                <h2 className='mb-6 text-center text-3xl font-bold tracking-tighter text-black uppercase italic'>Welcome Back</h2>

                {error && (
                    <div className='mb-4 rounded bg-red-50 border border-red-200 p-3 text-[10px] font-black uppercase text-red-700 tracking-tighter'>
                        {error.data?.message || 'Access Denied: Invalid Credentials'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>Email Address</label>
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=''
                            required
                            className='w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors'
                        />
                    </div>

                    <div>
                        <label className='block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>Password</label>
                        <input
                            type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder=''
                            required
                            className='w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`border-2 w-full py-4 font-bold text-xs uppercase tracking-widest transition-all ${isLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:invert'
                            }`}
                    >
                        {isLoading ? 'Authenticating...' : 'Login →'}
                    </button>
                </form>

                <p className='mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500'>
                    Don't have an account?
                    <Link to='/register' className='text-black hover:underline ml-2'>Register Now</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;