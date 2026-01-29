import React, { useEffect, useState } from 'react';
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
        <div className="w-full min-h-screen bg-transparent p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 border-black pb-2">
                    <h1 className="text-4xl md:text-4xl font-black tracking-tighter mt-6 uppercase italic leading-none">
                        Admin Dashboard
                    </h1>
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl uppercase font-black mb-5 inline-block italic">
                            Create New Event
                        </h3>

                        {error && (
                            <div className="mb-8 p-4 border-4 border-black bg-red-400 text-black text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                [!] ERROR: {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-8 p-4 border-4 border-black bg-[#BEF264] text-black text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                                [✓] SUCCESS: HACKATHON_BROADCAST_LIVE
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="group">
                                    <label className="text-[10px] font-bold font-black uppercase text-black tracking-widest mb-2 block">Event Name</label>
                                    <input type="text" name="name" required onChange={handleChange}
                                        className="w-full border-2 border-black p-4 font-semibold bg-gray-50  outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 focus:bg-gray-200 transition-all" placeholder="E.G. CODE STORM" />
                                </div>
                                <div className="group">
                                    <label className="text-[10px] font-bold font-black uppercase text-black tracking-widest mb-2 block">Organization</label>
                                    <input type="text" name="organization" required onChange={handleChange}
                                        className="w-full border-2 border-black p-4 font-semibold bg-gray-50  outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 focus:bg-gray-200 transition-all" placeholder="E.G. TECH_NOVA" />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-bold font-black uppercase text-black tracking-widest mb-2 block">Description</label>
                                <textarea name="description" required onChange={handleChange} rows="3"
                                    className="w-full border-2 border-black p-4 font-semibold bg-gray-50  outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 focus:bg-gray-200 transition-all" placeholder="DESCRIBE_THE_MISSION..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div>
                                    <label className="text-[10px] font-bold font-black uppercase text-black tracking-widest mb-2 block">Start Date</label>
                                    <input type="date" name="startDate" required onChange={handleChange}
                                        className="w-full border-2 border-black p-4 font-semibold bg-gray-50  outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 focus:bg-gray-200 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold font-black uppercase text-black tracking-widest mb-2 block">End Date</label>
                                    <input type="date" name="endDate" required onChange={handleChange}
                                        className="w-full border-2 border-black p-4 font-semibold bg-gray-50  outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 focus:bg-gray-200 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold font-black uppercase text-black tracking-widest mb-2 block">Location</label>
                                    <input type="text" name="location" required onChange={handleChange}
                                        className="w-full border-2 border-black p-4 font-semibold bg-gray-50  outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 focus:bg-gray-200 transition-all" placeholder="E.G. MARS" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold font-black uppercase text-black tracking-widest mb-2 block">Tech Stack (Comma Separated)</label>
                                <input type="text" name="techStack" onChange={handleChange}
                                    className="w-full border-2 border-black p-4 font-semibold bg-gray-50  outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 focus:bg-gray-200 transition-all" placeholder="REACT, SOLANA, RUST..." />
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full border-2 border-black bg-green-100 hover:bg-green-200 py-6 text-sm font-black uppercase tracking-[0.3em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:bg-gray-200 disabled:text-gray-400">
                                {loading ? 'UPLOADING DATA...' : 'INITIALIZE HACKATHON →'}
                            </button>
                        </form>
                    </div>

                    <div className="space-y-10">
                        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xs font-black font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate('/my-events')}
                                    className="w-full text-left p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all group"
                                >
                                    <p className="text-[10px] font-bold font-black uppercase">Manage Events</p>
                                    <p className="text-[9px] font-bold text-black/50">Edit current missions</p>
                                </button>
                                <button onClick={() => navigate('/explore')} className="w-full text-left p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all group">
                                    <p className="text-[10px] font-bold font-black uppercase">Live Feed</p>
                                    <p className="text-[9px] font-bold text-black/50">View public data</p>
                                </button>
                            </div>
                        </div>

                        <div className="border-2 bg-white border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-[10px] font-bold font-black uppercase tracking-widest mb-4">Organizer Pro Tips</p>
                            <ul className="text-[10px] space-y-4 font-bold ">
                                <li className="flex gap-2"><span>[!]</span> Set dates 2 weeks in advance.</li>
                                <li className="flex gap-2"><span>[!]</span>Skill tags help users find teams faster.</li>
                                <li className="flex gap-2"><span>[!]</span> Keep descriptions punchy.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;