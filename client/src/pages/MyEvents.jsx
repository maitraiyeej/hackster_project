import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';


const MyEvents = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMyEvents = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            const { data } = await axios.get('http://localhost:5000/api/hackathons/my-events', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setMyEvents(data);
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("DELETE PERMANENTLY? This cannot be undone.")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            await axios.delete(`http://localhost:5000/api/hackathons/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            fetchMyEvents();
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="w-full min-h-screen bg-transparent p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b-4 border-black pb-6">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Your Events</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mt-2">Manage published hackathons</p>
                </header>

                {loading ? (
                    <LoadingScreen message='LOADING_RECORDS...'/>
                ) : (
                    <div className="space-y-4">
                        {myEvents.map((event) => (
                            <div key={event._id} className="border-2 border-black p-6 group hover:bg-black hover:text-white transition-all flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-[9px] font-bold border border-current px-2 py-0.5 uppercase">{event.location}</span>
                                        <span className="text-[9px] font-bold bg-black text-white group-hover:bg-white group-hover:text-black px-2 py-0.5 uppercase tracking-tighter">
                                            {new Date(event.startDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">{event.name}</h3>
                                </div>
                                <div className="flex gap-3 mt-4 md:mt-0">
                                    <button
                                        onClick={() => navigate(`/hackathon/${event._id}`)}
                                        className="px-6 py-2 border border-current text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                    >
                                        View Public
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="px-6 py-2 bg-white text-red-600 border border-red-600 text-red-600 text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        Delete Event ×
                                    </button>
                                </div>
                            </div>
                        ))}
                        {myEvents.length === 0 && (
                            <div className="border-2 border-dashed border-gray-200 p-12 text-center">
                                <p className="text-gray-400 italic text-xs uppercase tracking-widest">No active records found.</p>
                                <button onClick={() => navigate('/admin')} className="mt-4 text-[10px] font-bold uppercase underline">Create your first event</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;