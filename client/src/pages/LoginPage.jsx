import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../services/authApi';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [login, { isLoading, error }] = useLoginMutation();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData).unwrap();
            navigate('/');  //success - navigate to home page
        }
        catch (error) {
            console.error('Login failed:', error);
        }
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
            <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-2xl'>
                <h2 className='mb-6 text-center text-3xl font-semibold text-indigo-700'>Sign In</h2>

                {error && (
                    <div className='mb-4 rounded bg-red-100 p-3 text-sm text-red-700'>
                        {error.data?.message || 'Server error occurred.'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <input type="email" name='email' value={formData.email} onChange={handleChange} placeholder='Email' required className='w-full rounded-lg border border-gray-300 px-4 py-2' />
                    <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder='Password' required className='w-full rounded-lg border border-gray-300 px-4 py-2' />

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`w-full rounded-lg py-2 font-semibold text-white transition-colors ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? 'Signing In...' : 'Login'}
                    </button>
                </form>
                <p className='mt-4 text-center text-sm text-gray-600'>
                    Don't have an account? <Link to='/register' className='text-indigo-600 hover:underline'>Sign Up</Link>
                </p>
            </div>
        </div>
    )
}


export default LoginPage;
