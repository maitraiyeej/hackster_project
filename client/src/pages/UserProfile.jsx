import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/users/${id}`, config);
                setProfile(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, loggedInUser.token]);

    if (loading) return <div className="p-10 font-mono">LOADING_PROFILE...</div>;

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white min-h-screen">
            <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase mb-8 hover:underline">← Back</button>
            
            <div className="border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter italic">{profile.name}</h1>
                        <p className="text-gray-500 font-mono mt-2">{profile.email}</p>
                        <span className="inline-block mt-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            {profile.role}
                        </span>
                    </div>
                    {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="border-2 border-black p-2 hover:bg-black hover:text-white transition">
                            GITHUB_PROFILE ↗
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-4">Bio</h3>
                        <p className="font-mono text-sm leading-relaxed text-gray-700">
                            {profile.bio || "No bio provided by this user."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <span key={index} className="text-[10px] font-bold border border-black px-2 py-1 uppercase bg-yellow-100">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-xs italic text-gray-400">No skills listed</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;