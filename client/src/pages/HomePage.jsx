import React, { useEffect, useState } from 'react';
import { useGetHackathonsQuery } from '../services/hackathonApi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from './LoadingScreen';
import BrutalistButton from '@/components/ui/BrutalistButton';
import BrutalistCard from '@/components/ui/BrutalistCard';

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

  if (isLoading) return <LoadingScreen message='LOADING_DATA...' />;
  if (error) return <div className="flex h-full items-center justify-center text-red-500">Error connecting to API.</div>;

  return (
    <div className="min-h-full">
      <header className="border-b-4 border-black py-20 px-10 bg-transparent relative overflow-hidden">


        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold uppercase tracking-widest animate-pulse">
          // {isAdmin ? "ROOT_ACCESS" : "USER_ACCESS"}
              </span>
            </div>

            <h1 className="text-7xl md:text-[120px] font-black tracking-tighter leading-[0.85] uppercase italic">
              {isAdmin ? (
                <>
                  ORGANIZE <br />
                  <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>MANAGE</span> <br />
                  <span className="bg-[#BEF264] px-4 -rotate-1 inline-block mt-2">SCALE</span>
                </>
              ) : (
                <>
                  BUILD <br />
                  <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>COLLABORATE</span> <br />
                  <span className="bg-[#22D3EE] px-4 rotate-1 inline-block mt-2">GROW</span>
                </>
              )}
            </h1>
          </div>

          <div className="max-w-md">
            <div className="border-l-8 border-black pl-8 py-4">
              <p className="text-lg font-black uppercase leading-tight tracking-tighter mb-4">
                {isAdmin
                  ? "TOTAL CONTROL CENTER V.01"
                  : "JOIN THE RESISTANCE OF BUILDERS"}
              </p>
              <p className="text-sm font-mono font-medium opacity-80 leading-relaxed">
                {isAdmin
                  ? "MANAGE YOUR HACKATHONS, TRACK REGISTRATIONS, AND EMPOWER THE NEXT GENERATION OF BUILDERS FROM YOUR COMMAND CENTER."
                  : "EXPLORE THE WORLD OF COLLABORATIVE BUILDING AND TAKE YOUR SKILLS TO THE NEXT LEVEL."
                }
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-black items-stretch bg-transparent">
        <div className="p-8 border-r border-black flex flex-col justify-center items-center">
          {isAdmin ? (
            <BrutalistButton
              onClick={() => navigate('/explore')}
              color="bg-[#FFD1A0]"
              className="w-full h-14 text-[10px] tracking-[0.2em] flex justify-between items-center px-4"
              shadowSize="4px"
            >
              <span className="font-black italic">GLOBAL FEED</span>
              <span className='text-xl'>→</span>
            </BrutalistButton>
          ) : (
            <Link
              to="/explore"
              className="w-full h-14 flex items-center justify-between group no-underline text-black border-4 border-transparent"
            >
              <div className="flex flex-col justify-center">
                <span className="text-4xl font-black italic leading-none">
                  {(hackathons?.length || 0)}+
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">
                  Active Hackathons
                </span>
              </div>
              <span className="text-2xl font-light transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                &#x2197;
              </span>
            </Link>
          )}
        </div>

        <div className="p-8 border-r border-black flex flex-col justify-center items-center">
          {isAdmin ? (
            <BrutalistButton
              onClick={() => navigate('/admin')}
              color="bg-[#BEF264]"
              className="text-[10px] tracking-[0.2em] flex justify-between items-center w-full h-14 px-4"
              shadowSize="4px"
            >
              <span className="font-black italic">CREATE NEW EVENT</span>
              <span className='text-xl'>+</span>
            </BrutalistButton>
          ) : (
            <div className="w-full h-14 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-4xl font-black italic leading-none">24/7</span>
                <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Team Recruiting</span>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>
          )}
        </div>

        <div className="p-8 flex items-center justify-center">
          <BrutalistButton
            onClick={() => navigate(isAdmin ? '/my-events' : '/explore')}
            color='bg-[#91E1F2]'
            shadowSize='4px'
            className="text-[10px] tracking-[0.2em] flex justify-between items-center w-full h-14 px-4"
          >
            <span className="font-black italic">{isAdmin ? "YOUR EVENTS" : "FIND HACKATHONS"}</span>
            <span className='text-xl'>→</span>
          </BrutalistButton>
        </div>
      </section>

      <div className='p-10'>
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-10 text-center italic">
          --- {isAdmin ? "SYSTEM_COMMUNITY_FEED" : "TRENDING_NOW"} ---
        </h2>

        <section className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hackathons && hackathons.map((hack) => (
              <Link
                to={`/hackathon/${hack._id}`}
                key={hack._id}
                className="block no-underline text-black group"
              >
                <BrutalistCard
                  color="bg-white" 
                  shadowSize="8px"
                  className="hover:cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black border-2 border-black px-2 py-1 uppercase bg-[#BEF264] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {hack.location || 'Remote'}
                    </span>
                    <span className="text-xl font-light group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
                      &#x2197;
                    </span>
                  </div>

                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none italic">
                    {hack.name}
                  </h3>

                  <p className="text-[12px] font-mono font-bold uppercase tracking-tight opacity-70 line-clamp-2 mb-6 border-l-4 border-black pl-2">
                    {hack.description}
                  </p>

                  <div className="text-[10px] font-black uppercase text-right opacity-40 group-hover:opacity-100 transition-opacity">
                    [ VIEW_INTEL_PACKAGE ]
                  </div>
                </BrutalistCard>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;