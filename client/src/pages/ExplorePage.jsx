import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import BrutalistCard from '@/components/ui/BrutalistCard';

const ExplorePage = () => {
    const [hackathons, setHackathons] = useState([]);
    const [filteredHackathons, setFilteredHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/hackathons');
                setHackathons(data);
                setFilteredHackathons(data); // Initial view shows all
            } catch (err) {
                console.error("Error fetching feed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        const query = search.toLowerCase();
        const results = hackathons.filter(h =>
            h.name.toLowerCase().includes(query) ||
            h.description.toLowerCase().includes(query) ||
            h.techStacks?.some(tech => tech.toLowerCase().includes(query))
        );
        setFilteredHackathons(results);
    }, [search, hackathons]);

    return (
        <div className="w-full min-h-screen bg-transparent p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 border-b-2 border-black pb-6">
                    <h1 className="text-6xl font-black uppercase tracking-tighter">Global Feed</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mt-2">Discover every active event on HackSter</p>

                    <div className="mt-8">
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME, TECH, OR DESCRIPTION..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border-2 border-black p-4 text-[10px] font-bold uppercase tracking-[0.2em] focus:bg-black focus:text-white transition-all outline-none"
                        />
                    </div>
                </header>

                {loading ? (
                    <LoadingScreen message='SCANNING_NETWORK...' />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredHackathons.map((h) => (
                            <Link
                                to={`/hackathon/${h._id}`}
                                key={h._id}
                                className="block no-underline text-black group"
                            >
                                <BrutalistCard
                                    color="bg-white"
                                    shadowSize="8px"
                                    className="hover:cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-black border-2 border-black px-2 py-1 uppercase bg-[#BEF264] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            {h.location || "Remote"}
                                        </span>
                                        <span className="text-xl font-light group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
                                            &#x2197;
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none italic">
                                        {h.name}
                                    </h3>

                                    <p className="text-[12px] font-mono font-bold uppercase tracking-tight opacity-70 line-clamp-2 mb-6 border-l-4 border-black pl-2">
                                        {h.description}
                                    </p>

                                    {h.techStacks?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {h.techStacks.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="text-[9px] font-black uppercase border-2 border-black px-2 py-0.5 bg-gray-100"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-6 text-[10px] font-black uppercase text-right opacity-40 group-hover:opacity-100 transition-opacity">
                                        [ VIEW_INTEL_PACKAGE ]
                                    </div>
                                </BrutalistCard>
                            </Link>
                        ))}
                    </div>

                )}

                {!loading && filteredHackathons.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">No matches found for "{search}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;