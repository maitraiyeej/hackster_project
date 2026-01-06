import React from 'react';
import { useGetHackathonsQuery } from '../services/hackathonApi';

const HomePage = () => {
  const { data: hackathons, isLoading, error } = useGetHackathonsQuery();

  if (isLoading) return <div className="flex h-full items-center justify-center font-mono text-xl">LOADING_DATA...</div>;
  if (error) return <div className="flex h-full items-center justify-center text-red-500">Error connecting to API.</div>;

  return (
    <div className="bg-white min-h-full">
      {/* Hero Section - Devlab Style */}
      <header className="border-b border-black py-16 px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="flex-1">
            <span className="text-xl font-light mb-4 block">✦ Featured Events</span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
              Find your <br /> next team
            </h1>
          </div>
          <div className="max-w-xs text-sm uppercase tracking-widest font-medium border-l border-black pl-6">
            Explore the world of collaborative building and take your skills to the next level.
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-black">
        <div className="p-8 border-r border-black flex flex-col justify-center">
          <span className="text-3xl font-bold">{hackathons?.length || 0}+</span>
          <span className="text-xs uppercase tracking-widest">Active Hackathons</span>
        </div>
        <div className="p-8 border-r border-black flex flex-col justify-center">
          <span className="text-3xl font-bold">24/7</span>
          <span className="text-xs uppercase tracking-widest">Team Recruiting</span>
        </div>
        <div className="p-8 flex items-center justify-end">
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition">
            Explore All ↗
          </button>
        </div>
      </section>

      {/* Hackathon Grid */}
      <section className="p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black">
          {hackathons && hackathons.map((hack) => (
            <div key={hack._id} className="border-r border-b border-black p-8 hover:bg-gray-50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-12">
                <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1">
                  {hack.location || 'Remote'}
                </span>
                <span className="text-xl">↗</span>
              </div>
              
              <h3 className="text-3xl font-bold leading-tight mb-4 group-hover:underline">
                {hack.name}
              </h3>
              
              <p className="text-gray-500 text-sm mb-8 line-clamp-2 uppercase tracking-tight">
                {hack.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {hack.tags?.map(tag => (
                  <span key={tag} className="text-[10px] font-bold border border-black px-2 py-0.5 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;