import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../services/authApi';


const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const [register, { isLoading, error }] = useRegisterMutation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData).unwrap();
            alert("Registration Successful!");
            navigate('/');
        }
        catch (error) {
            console.log('Registration failed:', error);
        }
    }
    return (
        <div className='flex h-full items-center justify-center p-4'>
            <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-2xl'>
                <h2 className='mb-6 text-center text-3xl font-semibold text-indigo-700'>Create Account</h2>
                {error && (
                    <div className='mb-4 rounded bg-red-100 p-3 text-sm text-red-700'>
                        {error.data?.message || 'Registration failed. Try again.'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Full Name</label>
                        <input type="text" name='name' value={formData.name} onChange={handleChange} required
                            className='mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Email Address</label>
                        <input type="email" name='email' value={formData.email} onChange={handleChange} required
                            className='mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>


                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Password</label>
                        <input type="password" name='password' value={formData.password} onChange={handleChange} required
                            className='mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>

                    <button type='submit' disabled={isLoading} 
                        className={`w-full rounded-lg py-2 font-semibold text-white transition-colors ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}

                    </button>
                </form>

                <p className='mt-4 text-center text-sm text-gray-600'>
                    Already have an account? <Link to='/login' className='text-indigo-600 hover:underline'>Log in</Link>
                </p>

            </div>

        </div>
    )
}


export default RegisterPage