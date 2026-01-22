import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: loggedInUser } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        bio: '',
        skills: '',
        githubUrl: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            if(!loggedInUser || !loggedInUser.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/users/${id}`, config);
                setProfile(data);
                setFormData({
                    bio: data.bio || '',
                    skills: data.skills?.join(', ') || '',
                    githubUrl: data.githubUrl || ''
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, loggedInUser.token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
            const updatedData = {
                ...formData,
                skills:formData.skills.split(',').map(s => s.trim())
            };
            await axios.put(`http://localhost:5000/api/users/profile`, updatedData, config);
            setProfile({ ...profile, ...updatedData, skills: updatedData.skills });
            setIsEditing(false);
            alert("Profile updated!");
        }
        catch (error) {
            alert("Update failed. Please try again.");
        }
    };

    if (loading) return <div className="p-10 font-mono">FETCHING_USER_DATA...</div>;
    if (!profile) return <div className='p-10 font-mono text-center text-red-600'>USER_NOT_FOUND</div>;

    const isOwner = loggedInUser && profile ? loggedInUser._id === profile._id : false;

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase hover:underline">
                    ← Back
                </button>
                {isOwner && !isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:invert transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white">
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <h2 className="text-2xl font-black uppercase italic border-b-4 border-black pb-2 mb-4">Update Your Info</h2>
                        
                        <div>
                            <label className="block text-[10px] font-black uppercase mb-1">GitHub URL</label>
                            <input 
                                type="text"
                                className="w-full border-2 border-black p-3 font-mono text-sm focus:bg-yellow-50 outline-none"
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                                placeholder="https://github.com/yourusername"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase mb-1">Bio</label>
                            <textarea 
                                className="w-full border-2 border-black p-3 font-mono text-sm focus:bg-yellow-50 outline-none h-32"
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                placeholder="Describe your experience and interests..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase mb-1">Skills (comma separated)</label>
                            <input 
                                type="text"
                                className="w-full border-2 border-black p-3 font-mono text-sm focus:bg-yellow-50 outline-none"
                                value={formData.skills}
                                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                placeholder="React, Tailwind, Node.js"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-black text-white font-black uppercase py-4 hover:bg-green-600 transition-colors">
                                Save Changes →
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)} 
                                className="px-8 border-2 border-black font-black uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h1 className="text-6xl font-black uppercase tracking-tighter italic">{profile.name}</h1>
                                <p className="text-gray-500 font-mono mt-2">{profile.email}</p>
                                <span className="inline-block mt-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                    {profile.role}
                                </span>
                            </div>
                            {profile.githubUrl && (
                                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="border-2 border-black p-2 hover:bg-black hover:text-white transition font-bold text-xs">
                                    GITHUB_PROFILE 
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
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;