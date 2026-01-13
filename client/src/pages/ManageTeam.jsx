import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageTeam = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Using your existing getTeamDetails route
                const { data } = await axios.get(`http://localhost:5000/api/teams/${teamId}`, config);
                setTeam(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchTeam();
    }, [teamId, user.token]);

    if (loading) return <div className="p-10 font-mono">LOADING_MANAGEMENT_CONSOLE...</div>;

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white min-h-screen">
            <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase mb-8">← Back</button>
            
            <h1 className="text-5xl font-bold tracking-tighter uppercase italic">{team?.name}</h1>
            <p className="text-gray-500 uppercase text-xs tracking-widest mt-2">Team Management Dashboard</p>

            <div className="mt-12 border-t-2 border-black pt-8">
                <h2 className="text-xl font-bold uppercase mb-6">Current Roster ({team?.members?.length}/{team?.teamSize})</h2>
                <div className="grid gap-4">
                    {team?.members?.map((member) => (
                        <div key={member._id} className="border border-black p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold uppercase text-sm">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                            {member._id === team.captain._id ? (
                                <span className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase">Captain</span>
                            ) : (
                                <button className="text-[10px] font-bold text-red-600 uppercase border border-red-600 px-2 py-1 hover:bg-red-600 hover:text-white transition">Remove</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageTeam;