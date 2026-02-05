import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BrutalistCard from '@/components/ui/BrutalistCard';
import { showToast } from '@/components/SystemToast';
import { useSelector } from 'react-redux';
const API = import.meta.env.VITE_API_URL;

const CreateTeam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [teamSize, setTeamSize] = useState(4);

    const [formData, setFormData] = useState({
        name: '',
        projectIdea: '',
        needs: '',
        teamSize: 4
    });

    const { user } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const needsObjects = formData.needs
                .split(',')
                .map(item => ({
                    role: item.trim(), 
                    count: 1           
                }))
                .filter(obj => obj.role !== ""); 

            const payload = {
                name: formData.name,
                hackathon: id,
                teamSize: Number(formData.teamSize) || 4,
                needs: needsObjects, 
                projectIdea: formData.projectIdea
            };

            await axios.post(`${API}/api/teams`, payload, config);

            showToast({
                message: 'Team Created Successfully!',
                type: 'success'
            })
            navigate(`/hackathon/${id}`);
        } catch (error) {
            console.error("Backend Error:", error.response?.data);
            showToast({
                message: `${error.response?.data?.message} `,
                type: error
            })
        } finally {
            setLoading(false);
        }
    };
    return (
        <BrutalistCard className="max-w-xl mx-auto bg-white mt-12">
            <h2 className="text-3xl font-black tracking-tighter mb-8 italic uppercase">Create your own Team</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Team Name</label>
                    <input
                        className="border-2 border-black shadow-[4px_4px_0px_0px] w-full py-2 bg-white focus:bg-gray-200 focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all text-xl font-medium"
                        type="text"
                        required
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Project Idea</label>
                    <textarea
                        className="border-2 border-black shadow-[4px_4px_0px_0px] w-full  p-4 h-32 bg-white focus:bg-gray-200 focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all text-lg"
                        required
                        onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Looking For (Comma separated)</label>
                        <input
                            className="border-2 border-black shadow-[4px_4px_0px_0px] w-full py-2 outline-none bg-white focus:bg-gray-200 focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
                            type="text"
                            required
                            onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Total Team Size</label>
                        <select
                            className="w-full border-2 border-black shadow-[4px_4px_0px_0px] py-2 outline-none bg-transparent cursor-pointer font-medium text-lg"
                            value={formData.teamSize}
                            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        >
                            {[2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>
                                    {num} Members
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="bg-green-100 border-2 border-black shadow-[4px_4px_0px_0px] py-4 font-bold uppercase tracking-[0.2em] text-sm hover:bg-green-200 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50"
                >
                    {loading ? 'PUBLISHING...' : 'POST RECRUITMENT'}
                </button>
            </form>
        </BrutalistCard>
    );
};

export default CreateTeam;