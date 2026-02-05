import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoadingScreen from './LoadingScreen';
import BrutalistCard from '@/components/ui/BrutalistCard';
import { showToast } from '@/components/SystemToast';
const API = import.meta.env.VITE_API_URL;


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
                const { data } = await axios.get(`${API}/api/users/${id}`, config);
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
                skills: formData.skills.split(',').map(s => s.trim())
            };
            await axios.put(`${API}/api/users/profile`, updatedData, config);
            setProfile({ ...profile, ...updatedData, skills: updatedData.skills });
            setIsEditing(false);
            showToast({
                message: 'Profile updated!',
                type: 'info'
            })
        }
        catch (error) {
            showToast({
                message: 'Update failed.',
                type:'error'
            })
        }
    };

    if (loading) return <LoadingScreen message='DECRYPTING_USER_DATA...'/>;
    if (!profile) return <div className='p-10 font-black text-center text-red-600 uppercase tracking-widest'>[!] USER_NOT_FOUND</div>;

    const isOwner = loggedInUser?._id === profile._id;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 bg-transparent min-h-screen mt-8">
            {/* TOP NAVIGATION */}
            <div className="flex justify-between items-center mb-10">
                <button 
                    onClick={() => navigate('/')} 
                    className="border-2 border-black bg-white px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                    ← RETURN TO BASE
                </button>
                
                {isOwner && !isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-green-100 border-2 border-black px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-200  active:shadow-none
                    active:translate-x-[4px]
                    active:translate-y-[4px] transition-all"
                    >
                        EDIT PROFILE 
                    </button>
                )}
            </div>

            {/* MAIN PROFILE CARD */}
            <BrutalistCard>
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                    {profile.role || 'RECRUIT'}
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-8">
                        <h2 className="text-3xl font-black uppercase italic leading-none mb-8">
                            UPDATE <span className="bg-black text-white px-2">Profile</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-8">
                            <div className="group">
                                <label className="block font-bold text-[10px] font-black uppercase tracking-widest mb-2">GITHUB Profile Link</label>
                                <input 
                                    type="text"
                                    className="w-full border-2 border-black p-4 font-bold text-sm bg-gray-50 focus:bg-gray-200 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                                    placeholder="https://github.com/..."
                                    />
                            </div>

                            <div>
                                <label className="block font-bold text-[10px] font-black uppercase tracking-widest mb-2">BIOGRAPHY DATA</label>
                                <textarea 
                                    className="w-full border-2 border-black p-4 font-bold text-sm bg-gray-50 focus:bg-gray-200 outline-none h-32 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold font-black uppercase tracking-widest mb-2">TECH STACK (COMMA_SEPARATED)</label>
                                <input 
                                    type="text"
                                    className="w-full border-2 border-black p-4 font-bold text-sm bg-gray-50 focus:bg-gray-200 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button type="submit" className="flex-1 border-2 border-black bg-green-100 text-black font-black uppercase py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-300 hover:text-black active:shadow-none
                    active:translate-x-[4px]
                    active:translate-y-[4px] transition-all">
                                SAVE CHANGES →
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)} 
                                className="px-10 border-2 shadow-[4px_4px_0px_0px] bg-red-200 border-black font-black uppercase hover:bg-red-400 active:shadow-none
                    active:translate-x-[4px]
                    active:translate-y-[4px] transition-all"
                                >
                                ABORT
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic mb-2">
                                    {profile.name}
                                </h1>
                                <p className="text-xs font-black text-black/40 uppercase tracking-[0.2em]">{profile.email}</p>
                            </div>

                            {profile.githubUrl && (
                                <a
                                href={profile.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]  hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                                >
                                    <svg role="img" viewBox="0 0 24 24" width="32" height="32" className="fill-black"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-lg italic font-black uppercase inline-block">SYSTEM BIO</h3>
                                <p className="font-bold text-lg leading-snug text-black">
                                    {profile.bio || "CLASSIFIED_DATA: NO BIO PROVIDED."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg italic font-black uppercase inline-block">SKILLS</h3>
                                <div className="flex flex-wrap gap-3">
                                    {profile.skills?.length > 0 ? (
                                        profile.skills.map((skill, index) => (
                                            <span key={index} className="text-[10px] bg-yellow-200 font-black border-2 border-black px-3 py-1 uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-[10px] font-black uppercase text-black/30 tracking-widest italic">No_Skills_Detected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
                </BrutalistCard>
        </div>
    );
};

export default UserProfile;