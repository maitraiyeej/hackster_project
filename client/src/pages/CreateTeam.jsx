import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
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

            await axios.post('http://localhost:5000/api/teams', payload, config);

            alert("Team created successfully!");
            navigate(`/hackathon/${id}`);
        } catch (error) {
            console.error("Backend Error:", error.response?.data);
            alert(error.response?.data?.message || "Failed to create team");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-10 bg-white min-h-screen">
            <h2 className="text-4xl font-bold tracking-tighter mb-8 italic">START_A_TEAM</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Team Name</label>
                    <input
                        className="w-full border-b border-black py-2 outline-none focus:border-blue-500 bg-transparent text-xl font-medium"
                        type="text"
                        required
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Project Idea</label>
                    <textarea
                        className="w-full border border-black p-4 h-32 outline-none focus:bg-gray-50 text-lg"
                        required
                        placeholder="Describe your vision..."
                        onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Looking For (Comma separated)</label>
                        <input
                            className="w-full border-b border-black py-2 outline-none bg-transparent"
                            type="text"
                            placeholder="React, Node, Designer"
                            required
                            onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-400">Total Team Size</label>
                        <select
                            className="w-full border-b border-black py-2 outline-none bg-transparent cursor-pointer font-medium text-lg"
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
                    className="bg-black text-white py-5 font-bold uppercase tracking-[0.2em] text-sm hover:invert transition-all border-2 border-solid disabled:opacity-50"
                >
                    {loading ? 'PUBLISHING...' : 'POST RECRUITMENT ↗'}
                </button>
            </form>
        </div>
    );
};

export default CreateTeam;