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
        if (!window.confirm("CRITICAL: DELETE PERMANENTLY?")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            await axios.delete(`http://localhost:5000/api/hackathons/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            fetchMyEvents();
        } catch (err) {
            alert("Execution failed.");
        }
    };

    return (
        <div className="w-full min-h-screen bg-transparent p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* HEADER */}
                <header className="mb-5 border-b-2 border-black pb-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl md:text-4xl italic font-black uppercase tracking-tighter leading-none">
                                MY Events
                            </h1>
                        </div>
                        <button 
                            onClick={() => navigate('/admin')}
                            className="bg-green-100 border-2 border-black px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-200  active:shadow-none
                    active:translate-x-[4px]
                    active:translate-y-[4px] transition-all"
                        >
                            + NEW MISSION
                        </button>
                    </div>
                </header>

                {loading ? (
                    <LoadingScreen message='ACCESSING_ENCRYPTED_FILES...'/>
                ) : (
                    <div className="space-y-8">
                        {myEvents.map((event) => (
                            <div key={event._id} 
                                 className="bg-white border-2  border-black p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all group">
                                
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-[9px] font-black bg-yellow-200 text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition all px-2 py-0.5 uppercase tracking-widest">
                                            {event.location}
                                        </span>
                                        <span className="text-[9px] font-black bg-yellow-200 text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition all px-2 py-0.5 uppercase tracking-widest">
                                            {new Date(event.startDate).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl md:text-2xl font-black uppercase tracking-tighter italic group-hover:not-italic inline-block transition-all">
                                        {event.name}
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                    <button
                                        onClick={() => navigate(`/hackathon/${event._id}`)}
                                        className="flex-1 md:flex-none px-6 py-3 bg-blue-100 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                                    >
                                        VIEW DETAILS
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="flex-1 md:flex-none px-6 py-3 bg-red-200 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-red-300 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                    >
                                        DELETE 
                                    </button>
                                </div>
                            </div>
                        ))}

                        {myEvents.length === 0 && (
                            <div className="border-8 border-dotted border-black p-20 text-center bg-white shadow-[12px_12px_0px_0px_rgba(252,165,165,1)]">
                                <p className="text-black font-black text-xl uppercase tracking-tighter italic">NO_RECORDS_FOUND_IN_SYSTEM</p>
                                <button 
                                    onClick={() => navigate('/admin')} 
                                    className="mt-6 text-sm font-black uppercase underline hover:text-[#91E1F2] transition-colors"
                                >
                                    DEPLOY_YOUR_FIRST_HACKATHON_NOW
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;    