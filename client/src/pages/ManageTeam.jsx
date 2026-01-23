import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LoaderFive } from '@/components/ui/loader';
import LoadingScreen from './LoadingScreen';

const ManageTeam = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        projectIdea: '',
        needs: '',
    });
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchTeam = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/teams/${teamId}`, config);
            setTeam(data);
            setFormData({
                name: data.name,
                projectIdea: data.projectIdea,
                needs: data.needs ? data.needs.map(n => n.role).join(', ') : ''
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [teamId, user.token]);

    const handleUpdateTeam = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const needsArray = formData.needs.split(',')
                .map(skill => skill.trim())
                .filter(skill => skill !== "")
                .map(skill => ({
                    role: skill,
                    count: 1
                }));

            const dataToSend = {
                ...formData,
                needs: needsArray
            };

            const { data } = await axios.put(`http://localhost:5000/api/teams/${teamId}`, dataToSend, config);

            setTeam(data);
            setIsEditing(false);
            alert('Team profile updated successfully!');
        }
        catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    }

    const handleDecision = async (requestingUserId, action) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(
                `http://localhost:5000/api/teams/${teamId}/manage-request`,
                { userId: requestingUserId, action },
                config
            );
            alert(data.message);
            fetchTeam();
        } catch (error) {
            alert(error.response?.data?.message || "Action failed");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            await axios.delete(
                `http://localhost:5000/api/teams/${teamId}/remove/${memberId}`,
                config
            );

            alert("Member removed successfully");
            fetchTeam();
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

            alert("Team deleted successfully.");
            navigate(-1);
        }
        catch (error) {
            alert(error.response?.data?.message || "Failed to delete team");
        }
    }

    if (loading) {
        return (
            <LoadingScreen message='LOADING_MANAGEMENT_CONSOLE...'/>
        );
    }
    return (
        <div className="max-w-4xl mx-auto p-10 bg-white min-h-screen">
            <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase mb-8 hover:underline">← Back</button>

            {isEditing ? (
                <form onSubmit={handleUpdateTeam} className="mb-12 space-y-4 border-2 border-black p-6">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Team Name</label>
                        <input
                            className="text-4xl font-bold uppercase border-b-2 border-black w-full outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Roles Needed (Comma Separated)</label>
                        <input
                            className="w-full border border-black p-2 text-sm font-mono outline-none"
                            placeholder="e.g. Frontend, Designer, Backend"
                            value={formData.needs}
                            onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Project Idea</label>
                        <textarea
                            className="w-full border border-black p-4 text-sm font-mono outline-none"
                            value={formData.projectIdea}
                            rows="4"
                            onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-black text-white px-4 py-2 text-xs font-bold uppercase hover:invert">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="border border-black px-4 py-2 text-xs font-bold uppercase">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="mb-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tighter uppercase italic">{team?.name}</h1>
                            <p className="text-gray-500 uppercase text-xs tracking-widest mt-2">Team Management Dashboard</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-[10px] font-bold border border-black px-3 py-1 uppercase hover:bg-black hover:text-white transition"
                        >
                            Edit Profile
                        </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {team?.needs?.map((n, index) => (
                            <span key={index} className="text-[10px] font-bold border border-black px-2 py-0.5 uppercase bg-gray-100">
                                {n.role}
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-600 mt-6 font-mono text-sm leading-relaxed border-l-4 border-black pl-4 italic">
                        {team?.projectIdea}
                    </p>
                </div>
            )}

            <div className="mt-12 border-t-2 border-black pt-8">
                <h2 className="text-xl font-bold uppercase mb-6 flex justify-between items-center">
                    Pending Requests
                    <span className="bg-yellow-400 text-[10px] px-2 py-1">{team?.requests?.length || 0}</span>
                </h2>
                {team?.requests?.length > 0 ? (
                    <div className="grid gap-4">
                        {team.requests.map((request) => (
                            <div key={request._id} className="border-2 border-black p-4 flex justify-between items-center bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div>
                                    {/* Link added here */}
                                    <Link to={`/user/${request._id}`} className="font-bold uppercase text-sm hover:underline hover:text-blue-700 block">
                                        {request.name} ↗
                                    </Link>
                                    <p className="text-[10px] text-gray-500 font-mono">{request.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDecision(request._id, 'accept')}
                                        className="bg-black text-white text-[10px] font-bold uppercase px-3 py-2 hover:bg-green-600 transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecision(request._id, 'reject')}
                                        className="border border-black text-[10px] font-bold uppercase px-3 py-2 hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic uppercase">No pending join requests.</p>
                )}
            </div>

            <div className="mt-12 border-t-2 border-black pt-8">
                <h2 className="text-xl font-bold uppercase mb-6">Current Roster ({team?.members?.length}/{team?.teamSize})</h2>
                <div className="grid gap-4">
                    {team?.members?.map((member) => (
                        <div key={member._id} className="border border-black p-4 flex justify-between items-center">
                            <div>
                                <Link to={`/user/${member._id}`} className="font-bold uppercase text-sm hover:underline hover:text-blue-700 block">
                                    {member.name}
                                </Link>
                                <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                            {member._id === team.captain?._id || member._id === team.captain ? (
                                <span className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase">Captain</span>
                            ) : (
                                <button
                                    onClick={() => handleRemoveMember(member._id)}
                                    className="text-[10px] font-bold text-red-600 uppercase border border-red-600 px-2 py-1 hover:bg-red-600 hover:text-white transition cursor-pointer"
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