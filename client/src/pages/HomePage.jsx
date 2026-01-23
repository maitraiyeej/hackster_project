import React, { useEffect, useState } from 'react';
import { useGetHackathonsQuery } from '../services/hackathonApi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from './LoadingScreen';

const HomePage = ({ user }) => {
  const [myEventsCount, setMyEventsCount] = useState(0);
  const { data: hackathons, isLoading, error } = useGetHackathonsQuery();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (isAdmin && user?.token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` }
          }
          const { data } = await axios.get('http://localhost:5000/api/hackathons/my-events', config);
          setMyEventsCount(data.length);
        }
        catch (err) {
          console.error("Error fetching admin-specific count:", err);
        }
      }
    }
    fetchAdminStats();
  }, [isAdmin, user]);

  if (isLoading) return <LoadingScreen message='LOADING_DATA...'/>;
  if (error) return <div className="flex h-full items-center justify-center text-red-500">Error connecting to API.</div>;

  return (
    <div className="bg-white min-h-full">
      <header className="border-b border-black py-16 px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="flex-1">
            <span className="text-xl font-light mb-4 block">✦ {isAdmin ? "Organizer Command" : "Featured Events"}</span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
              {isAdmin ? (
                <>Build the<br />Future</>
              ) : (
                <>Find your<br />next team</>
              )}
            </h1>
          </div>
          <div className="max-w-xs text-sm uppercase tracking-widest font-medium border-l border-black pl-6">
            {isAdmin
              ? "Manage your hackathons, track registrations, and empower the next generation of builders from your command center."
              : "Explore the world of collaborative building and take your skills to the next level."
            }
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-black">
        <div className="p-8 border-r border-black flex flex-col justify-center">
          <span className="text-3xl font-bold">
            {/* If Admin, show personal count; otherwise show global count */}
            {isAdmin ? myEventsCount : (hackathons?.length || 0)}+
          </span>
          <span className="text-xs uppercase tracking-widest">
            {isAdmin ? "Your Managed Events" : "Active Hackathons"}
          </span>
        </div>
        <div className="p-8 border-r border-black flex flex-col justify-center">
          {isAdmin ? (
            <button
              onClick={() => navigate('/admin')}
              className="border-2 bg-black text-white py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] hover:invert transition-all flex justify-between items-center"
            >
              Create New Event <span className='text-lg'>+</span>
            </button>
          ) : (
            <>
              <span className="text-3xl font-bold">24/7</span>
              <span className="text-xs uppercase tracking-widest">Team Recruiting</span>
            </>
          )
          }
        </div>
        <div className="p-8 flex items-center justify-end">
          {isAdmin ? (
            <button
              onClick={() => navigate('/my-events')}
              className="w-full border-2 border-black py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white  hover:bg-white hover:text-black transition-all flex justify-between items-center"
            >
              Your Events <span className='text-lg'>→</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/explore')}
              className="w-full border-2 border-black py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white  hover:bg-white hover:text-black transition-all flex justify-between items-center">
              Explore All <span className='text-lg'>→</span>
            </button>
          )
          }
        </div>
      </section>

      <div className='p-10'>
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-10 text-center">
          {isAdmin ? "Global Community Feed" : "Trending Now"}
        </h2>
        <section className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackathons && hackathons.map((hack) => (
              <Link
                to={`/hackathon/${hack._id}`}
                key={hack._id}
                className="border-2 border-black p-6 hover:bg-black hover:text-white transition-all group cursor-pointer block no-underline text-inherit"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold border border-current px-2 py-1 uppercase">
                    {hack.location || 'Remote'}
                  </span>
                  <span className="text-xl transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    ↗
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-tight">
                  {hack.name}
                </h3>

                <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 line-clamp-2 mb-6">
                  {hack.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;