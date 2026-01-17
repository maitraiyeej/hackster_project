import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HackathonDetails = () => {
    const [teams, setTeams] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [hackathon, setHackathon] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const resHack = await axios.get(`http://localhost:5000/api/hackathons/${id}`);
                setHackathon(resHack.data);

                const resTeams = await axios.get(`http://localhost:5000/api/teams?hackathon=${id}`);
                setTeams(resTeams.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const handleCreateTeam = () => {
        if (!user) {
            alert("Please login to create a team!");
            navigate('/login');
            return;
        }
        navigate(`/hackathon/${id}/create-team`);
    };

    const handleJoinTeam = async (teamId) => {
        if (!user) {
            alert("Please login to join the team!");
            navigate('/login');
            return;
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.put(`http://localhost:5000/api/teams/${teamId}/join`, {}, config);
            alert(res.data.message || "Successfully joined the team!");
            const resTeams = await axios.get(`http://localhost:5000/api/teams?hackathon=${id}`);
            setTeams(resTeams.data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to join team");
        }
    }

    const handleLeaveTeam = async (teamId) => {
        if (!window.confirm("Are you sure you want to leave this team?")) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.put(`http://localhost:5000/api/teams/${teamId}/leave`, {}, config);
            alert(res.data.message || "You have left the team.");
            const resTeam = await axios.get(`http://localhost:5000/api/teams?hackathon=${id}`);
            setTeams(resTeam.data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to leave team");
        }
    };

    if (loading) return <div className="p-10 font-mono">LOADING_DETAILS...</div>;
    if (!hackathon) return <div className="p-10">HACKATHON_NOT_FOUND</div>;

    return (
        <div className='w-full min-h-screen bg-white overflow-y-auto'>
            <div className="max-w-5xl mx-auto p-10"> 
                
                <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1">
                    {hackathon.location || 'Remote'}
                </span>

                <h1 className='text-6xl font-bold tracking-tighter mt-4'>{hackathon.name}</h1>
                <p className='text-xl text-gray-500 font-light mt-2'>{hackathon.organization}</p>

                <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-10'>
                    <div className='md:col-span-2'>
                        <h3 className='text-sm uppercase tracking-widest font-bold border-b border-black pb-2 mb-4'>About</h3>
                        <p className='text-gray-700 leading-relaxed text-lg'>{hackathon.description}</p>
                    </div>

                    <div>
                        <h3 className='text-sm uppercase tracking-widest font-bold border-b border-black pb-2 mb-4'>Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {hackathon.techStacks?.length > 0 ? (
                                hackathon.techStacks.map((tech, index) => (
                                    <span key={index} className="border border-black px-2 py-1 text-[10px] font-bold uppercase">
                                        {tech}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-xs italic uppercase">No stack specified</span>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-16 border-black" />

                <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4'>
                    <div>
                        <h2 className='text-4xl font-bold tracking-tighter'>Recruiting Teams</h2>
                        <p className='text-gray-500 uppercase text-xs tracking-widest mt-2'>Find your collaborators</p>
                    </div>
                    <button
                        onClick={handleCreateTeam}
                        className='border-2 border-solid bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:invert transition whitespace-nowrap'
                    >
                        Create a Team +
                    </button>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20"> 
                    {teams.length > 0 ? (
                        teams.map((team) => (
                            <div key={team._id} className="border border-black p-6 hover:shadow-lg transition-all bg-white flex flex-col min-h-[300px]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold tracking-tighter uppercase italic break-all pr-2">{team.name}</h3>
                                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 whitespace-nowrap">
                                        {team.members?.length || 1} / {team.teamSize} MEMBERS
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    {team.projectIdea}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {team.needs?.map((need, idx) => (
                                        <span key={idx} className="text-[9px] font-bold uppercase border border-black px-2 py-1">
                                            {need.role}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    {team.members.some(m => (m._id || m) === user?._id) ? (
                                        <div className="flex flex-col gap-2">
                                            <span className="text-center text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">
                                                ✓ YOU_ARE_A_MEMBER
                                            </span>
                                            {(team.captain?._id || team.captain) === user?._id ? (
                                                <button
                                                    onClick={() => navigate(`/manage-team/${team._id}`)}
                                                    className="w-full border-2 bg-black text-white border-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                                >
                                                    Manage Team Settings →
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleLeaveTeam(team._id)}
                                                    className="w-full bg-red-50 text-red-600 border border-red-200 py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    Leave Team ×
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            disabled={team.status === 'Full' || (team.members?.length >= team.teamSize)}
                                            onClick={() => handleJoinTeam(team._id)}
                                            className={`border-2 border-solid w-full py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                                                (team.status === 'Full' || team.members?.length >= team.teamSize)
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-black text-white hover:invert'
                                            }`}
                                        >
                                            {(team.status === 'Full' || team.members?.length >= team.teamSize) ? 'TEAM_FULL' : 'Request to Join →'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-20 border border-dashed border-gray-300 text-center">
                            <p className='text-gray-400 uppercase text-xs tracking-widest'>No teams active for this event yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HackathonDetails;