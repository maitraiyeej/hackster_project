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

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            await axios.put(
                `http://localhost:5000/api/teams/${teamId}/remove/${memberId}`,
                {},
                config
            );

            alert("Member removed successfully");

            setTeam((prev) => ({
                ...prev,
                members: prev.members.filter((m) => m._id !== memberId),
            }));
        }
        catch (error) {
            alert(error.response?.data?.message || "Error removing member");
        }
    };

    const handleDeleteTeam = async () => {
        const confirmDelete = window.confirm(
            "WARNING: This will permanently delete the team. This action cannot be undone. Proceed?"
        );

        if (!confirmDelete) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            await axios.delete(`http://localhost:5000/api/teams/${teamId}`, config);

            alert("Team delete successfully.");
            navigate(-1);
        }
        catch (error) {
            alert(error.response?.data?.message || "Failed to delete team");
        }
    }

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
                                <button
                                    onClick={() => handleRemoveMember(member._id)}
                                    className="text-[10px] font-bold text-red-600 uppercase border border-red-600 px-2 py-1 bg-red-600 text-white hover:bg-white hover:text-red-600 transition cursor-pointer"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-20 border-t border-red-200 pt-10">
                    <h3 className="text-red-600 font-bold uppercase text-xs tracking-widest mb-4">Danger Zone</h3>
                    <button
                        onClick={handleDeleteTeam}
                        className="bg-white text-red-600 border border-red-600 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                        Delete Team Permanently
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageTeam;