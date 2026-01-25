import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoadingScreen from './LoadingScreen';
import { useParams } from 'react-router-dom';

const ViewTeam = () => {
    const { id } = useParams(); 
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchTeam = async () => {
            if (!user?.token || !id) return;

            try {
                setLoading(true);
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }, 
                    params: { hackathonId: id } 
                };

                const { data } = await axios.get('http://localhost:5000/api/teams/my-team', config);
                setTeam(data);
            } catch (err) {
                console.error("API Error:", err.response?.data || err.message);
                setTeam(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [user?.token, id]);

    if (loading) return <LoadingScreen message="SYNCING_TEAM_INTEL..." />;

    if (!team) return (
        <div className="h-[60vh] flex flex-col items-center justify-center p-10 font-black uppercase italic text-center">
            <h2 className="text-3xl mb-4">No_Team_Found</h2>
            <p className="text-sm bg-black text-white px-2 inline-block">Join a team from the recruiting page</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
            <div className="border-4 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Team Dashboard</span>
                        <h1 className="text-6xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                            {team?.name || "UNKNOWN_TEAM"}
                        </h1>
                        <p className="mt-4 font-mono text-lg bg-yellow-300 inline-block px-2 border-2 border-black">
                            {team?.hackathon?.name || "HACKATHON_PROJECT"}
                        </p>
                    </div>
                    <div className="border-2 border-black p-4 bg-black text-white font-black uppercase italic">
                        <p className="text-xs">Capacity</p>
                        <p className="text-s">{team?.members?.length || 0} / {team?.teamSize || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="border-4 border-black p-6 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-4 italic">Team Decription</h3>
                        <p className="font-mono text-lg leading-relaxed">{team?.projectIdea || "NO_MISSION_DEFINED_YET"}</p>
                    </div>

                    <div className="border-4 border-black p-6 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-4 italic">Team Roster</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {team?.members?.map((member) => (
                                <div key={member?._id} className="border-2 border-black p-4 group hover:bg-black hover:text-white transition-all">
                                    <p className="font-black uppercase">{member?.name || "ANONYMOUS"}</p>
                                    <p className="text-xs font-mono opacity-60">{member?.email || "NO_EMAIL"}</p>
                                    {member?._id === team?.captain?._id && (
                                        <span className="text-[10px] font-black uppercase bg-red-500 text-white px-1 mt-2 inline-block">Captain</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="border-4 border-black p-6 bg-black text-white shadow-[10px_10px_0px_0px_rgba(255,255,0,1)]">
                        <h3 className="text-xl font-black uppercase mb-4 tracking-tighter italic">Communication-Center</h3>
                        <div className="h-48 bg-gray-900 border-2 border-white mb-4 flex items-center justify-center font-mono text-xs opacity-50">
                            [ LIVE_CHAT_MODULE_OFFLINE ]
                        </div>
                        <button className="w-full border-2 border-white py-3 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            Initialize Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeam;