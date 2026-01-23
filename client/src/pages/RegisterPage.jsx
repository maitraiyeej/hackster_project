import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../services/authApi';
import LoadingScreen from './LoadingScreen';


const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User'
    })

    const navigate = useNavigate();

    const [register, { isLoading, error }] = useRegisterMutation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleRoleChange = (selectedRole) => {
        setFormData({ ...formData, role: selectedRole });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // FIX: Assign the result of unwrap() to a variable so we can use it
            const userData = await register(formData).unwrap();

            alert("Registration Successful! Let's complete your profile.");

            // Extract the userId from the response
            const userId = userData._id || userData.id || userData.user?._id;

            if (userId) {
                // Redirect immediately to the profile edit page
                navigate(`/user/${userId}`);
            } else {
                navigate('/');
            }
        }
        catch (error) {
            console.log('Registration failed:', error);
        }
    }

    return (
        <div className='flex h-full items-center justify-center p-4'>
            <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-2xl'>
                <h2 className='mb-6 text-center text-3xl font-bold tracking-tighter text-black uppercase italic'>Create Account</h2>

                {error && (
                    <div className='mb-4 rounded bg-red-50 border border-red-200 p-3 text-sm text-red-700'>
                        {error.data?.message || 'Registration failed. Try again.'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className="mb-6">
                        <label className='block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2'>
                            I am registering as:
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleRoleChange('User')}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${formData.role === 'User'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-200 hover:border-black'
                                    }`}
                            >
                                Hacker
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleChange('Admin')}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${formData.role === 'Admin'
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-200 hover:border-black'
                                    }`}
                            >
                                Organizer
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className='block text-xs font-bold uppercase tracking-widest text-gray-700'>Full Name</label>
                        <input type="text" name='name' value={formData.name} onChange={handleChange} required
                            className='mt-1 w-full border-b-2 border-gray-200 px-0 py-2 focus:outline-none focus:border-black transition-colors'
                            placeholder=""
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-bold uppercase tracking-widest text-gray-700'>Email Address</label>
                        <input type="email" name='email' value={formData.email} onChange={handleChange} required
                            className='mt-1 w-full border-b-2 border-gray-200 px-0 py-2 focus:outline-none focus:border-black transition-colors'
                            placeholder=""
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-bold uppercase tracking-widest text-gray-700'>Password</label>
                        <input type="password" name='password' value={formData.password} onChange={handleChange} required
                            className='mt-1 w-full border-b-2 border-gray-200 px-0 py-2 focus:outline-none focus:border-black transition-colors'
                            placeholder=""
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`border-2 w-full mt-6 py-4 font-bold uppercase tracking-[0.2em] text-xs transition-all ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:invert'
                            }`}
                    >
                        {isLoading ? (
                            <LoadingScreen message='PROCESSING...'/>
                        ) : (
                            'Create Account →'
                        )}
                    </button>
                </form>

                <p className='mt-8 text-center text-xs font-medium text-gray-500 uppercase tracking-widest'>
                    Already have an account? <Link to='/login' className='text-black font-bold hover:underline ml-1'>Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;