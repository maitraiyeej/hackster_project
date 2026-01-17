import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        organization: '',
        techStack: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const finalData = {
                ...formData,
                techStacks: formData.techStack.split(',').map(item => item.trim())
            };

            await axios.post('http://localhost:5000/api/hackathons', finalData, config);

            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create hackathon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-white p-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1">
                        Admin Portal
                    </span>
                    <h1 className="text-6xl font-bold tracking-tighter mt-4">Dashboard</h1>
                    <p className="text-gray-500 uppercase text-xs tracking-[0.3em] mt-2">Manage and Host your events</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2">
                        <h3 className="text-sm uppercase tracking-widest font-bold border-b border-black pb-2 mb-8">Create New Hackathon</h3>
                        
                        {error && (
                            <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-tighter">
                                Error: {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="mb-6 p-4 border border-black bg-black text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                ✓ Hackathon Published Successfully
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Event Name</label>
                                    <input type="text" name="name" required onChange={handleChange} 
                                        className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" placeholder="e.g. CodeStorm 2026" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Organization</label>
                                    <input type="text" name="organization" required onChange={handleChange} 
                                        className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" placeholder="e.g. TechNova Community" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Description</label>
                                <textarea name="description" required onChange={handleChange} rows="3"
                                    className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors resize-none" placeholder="What is this event about?" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Start Date</label>
                                    <input type="date" name="startDate" required onChange={handleChange} 
                                        className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">End Date</label>
                                    <input type="date" name="endDate" required onChange={handleChange} 
                                        className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Location</label>
                                    <input type="text" name="location" required onChange={handleChange} 
                                        className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" placeholder="e.g. New York" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Tech Stack (Comma Separated)</label>
                                <input type="text" name="techStack" onChange={handleChange} 
                                    className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors" placeholder="React, Node.js, MongoDB..." />
                            </div>

                            <button type="submit" disabled={loading} 
                                className="border-2 bg-black text-white px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:invert transition-all disabled:bg-gray-200 disabled:text-gray-400">
                                {loading ? 'Publishing...' : 'Publish Hackathon →'}
                            </button>
                        </form>
                    </div>

                    <div className="hidden lg:block">
                        <h3 className="text-sm uppercase tracking-widest font-bold border-b border-black pb-2 mb-8">Admin Quick Links</h3>
                        <div className="space-y-4">
                            <button onClick={() => navigate('/')} className="w-full text-left p-4 border border-black hover:bg-black hover:text-white transition-all group">
                                <p className="text-[10px] font-bold uppercase tracking-widest">View All Events</p>
                                <p className="text-xs text-gray-500 group-hover:text-gray-300">Public Feed</p>
                            </button>
                            <div className="p-6 bg-gray-50 border border-gray-200">
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-4">Organizer Tips</p>
                                <ul className="text-xs space-y-3 text-gray-600 list-disc pl-4 italic">
                                    <li>Ensure dates are set correctly</li>
                                    <li>Add clear tech stacks to help hackers find teams</li>
                                    <li>Use high-impact descriptions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;