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

    if (loading) return <div className="p-10 font-mono">LOADING_DETAILS...</div>;
    if (!hackathon) return <div className="p-10">HACKATHON_NOT_FOUND</div>;

    return (
        <div className='max-w-4xl mx-auto p-10 bg-white min-h-screen'>
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
                        {hackathon.techStacks && hackathon.techStacks.length > 0 ? (
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

            <div className='flex justify-between items-end'>
                <div>
                    <h2 className='text-4xl font-bold tracking-tighter'>Recruiting Teams</h2>
                    <p className='text-gray-500 uppercase text-xs tracking-widest mt-2'>Find your collaborators</p>
                </div>
                <button
                    onClick={handleCreateTeam}
                    className='border-2 border-solid bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:invert transition'
                >
                    Create a Team +
                </button>
            </div>

            {/* --- TEAM GRID SECTION --- */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <div key={team._id} className="border border-black p-6 hover:shadow-lg transition-all bg-white group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold tracking-tighter uppercase italic">{team.name}</h3>
                                <span className="text-[10px] font-bold bg-gray-100 px-2 py-1">
                                    {team.members?.length || 1} / {team.teamSize} MEMBERS
                                </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[60px]">
                                {team.projectIdea}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {team.needs?.map((need, idx) => (
                                    <span key={idx} className="text-[9px] font-bold uppercase border border-black px-2 py-1">
                                        {need.role}
                                    </span>
                                ))}
                            </div>

                            <button className="border-2 border-solid w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest group-hover:invert transition-all">
                                Request to Join →
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-20 border border-dashed border-gray-300 text-center">
                        <p className='text-gray-400 uppercase text-xs tracking-widest'>No teams active for this event yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HackathonDetails;