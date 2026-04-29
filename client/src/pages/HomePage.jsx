import React, { useEffect, useState } from 'react';
import { useGetHackathonsQuery } from '../services/hackathonApi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from './LoadingScreen';
import BrutalistButton from '@/components/ui/BrutalistButton';
import BrutalistCard from '@/components/ui/BrutalistCard';
import Footer from '@/components/Footer';
import headerBg from '@/assets/image-background.jpg';
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
const API = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
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
          const { data } = await axios.get(`${API}/api/hackathons/my-events`, config);
          setMyEventsCount(data.length);
        }
        catch (err) {
          console.error("Error fetching admin-specific count:", err);
        }
      }
    }
    fetchAdminStats();
  }, [isAdmin, user?.token]);

  if (isLoading) return <LoadingScreen message='LOADING_DATA...' />;
  if (error) return <div className="flex h-full items-center justify-center text-red-500">Error connecting to API.</div>;
const handleAI = async () => {
  const skill = prompt("Enter your skill (web / ai / ml)");

  if (!skill) return;

const res = await fetch("https://hackster-backend.onrender.com/ai", {    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skill }),
  });

  const data = await res.json();

  alert(data.reply);
};
 return (
   
    <div className="min-h-full">
   <button
  onClick={handleAI}
  className="bg-black text-white px-4 py-2 rounded-lg mt-4 ml-4"
>
  🤖 AI Team Matcher
</button>
<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 ml-4 rounded">
  🔔 You have 2 upcoming hackathons this week!
</div>
      <div className=' top-0 w-full h-12 flex items-center justify-center px-10 z-50 bg-[#04040d] text-white text-[24px]'>
        <span className='uppercase font-bold italic'>Hack</span>
        <span className='uppercase font-bold  bg-white text-black px-1'>Ster</span>
      </div>
      <header
        className="relative border-b-4 border-black py-20 px-10 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${headerBg})` }}
      >

        {/* overlay */}

        <div className="absolute inset-0 bg-black/65" />

        {/* content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
          <div className="flex-1">
            <span className="block mb-6 text-sm font-bold uppercase tracking-widest text-white/70">
              // {isAdmin ? "ROOT_ACCESS" : "USER_ACCESS"}
            </span>

            <h1 className="text-7xl md:text-[120px] font-black uppercase italic leading-[0.85] tracking-tighter text-white">
              {isAdmin ? (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="block"
                  >
                    ORGANIZE
                  </motion.span>


                  <motion.span
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                    className="block text-transparent"
                    style={{ WebkitTextStroke: "2px white" }}
                  >
                    MANAGE
                  </motion.span>

                  <motion.span
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                    className="inline-block text-white px-4 mt-2 rotate-1"
                  >
                    SCALE
                  </motion.span>

                </>

              ) : (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="block"
                  >
                    BUILD
                  </motion.span>

                  <motion.span
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                    className="block text-transparent"
                    style={{ WebkitTextStroke: "2px white" }}
                  >
                    COLLABORATE
                  </motion.span>

                  <motion.span
                    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                    className="inline-block text-white px-4 mt-2 rotate-1"
                  >
                    GROW
                  </motion.span>
                </>

              )}
            </h1>
          </div>

          <div className="max-w-md">
            <div className="border-l-8 border-white pl-8 py-4">
              <p className="text-lg font-black uppercase tracking-tight mb-3 text-white">
                {isAdmin
                  ? "TOTAL CONTROL CENTER V.01"
                  : "JOIN THE RESISTANCE OF BUILDERS"}
              </p>
              <p className="text-sm font-mono leading-relaxed text-white/80">
                {isAdmin
                  ? "MANAGE YOUR HACKATHONS, TRACK REGISTRATIONS, AND EMPOWER THE NEXT GENERATION OF BUILDERS FROM YOUR COMMAND CENTER."
                  : "EXPLORE THE WORLD OF COLLABORATIVE BUILDING AND TAKE YOUR SKILLS TO THE NEXT LEVEL."}
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
              color="bg-[#b3e9c7]"
              className="w-full h-14 text-black text-[11px] tracking-[0.2em] flex justify-between items-center px-4"
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
                <span className="text-[11px] font-black uppercase tracking-widest mt-1 opacity-60">
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
              color="bg-[#95d5b2]"
              className="text-[11px] text-black tracking-[0.2em] flex justify-between items-center w-full h-14 px-4"
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
            color='bg-[#a8dadc]'
            shadowSize='4px'
            className="text-[11px] tracking-[0.2em] flex justify-between items-center w-full h-14 px-4"
          >
            <span className="font-black text-black italic">{isAdmin ? "YOUR EVENTS" : "FIND HACKATHONS"}</span>
            <span className='text-xl text-black'>→</span>
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
                    <span className="text-[10px] font-bold hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black border-2 border-black px-2 py-1 uppercase bg-[#BEF264] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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

      <Footer />
    </div>

  );
};

export default HomePage;