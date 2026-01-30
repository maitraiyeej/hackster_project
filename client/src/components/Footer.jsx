import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';


const Footer = ({ user }) => {
    const isAdmin = user?.role === 'Admin';

    return (
        <footer className="border-t-2 border-black bg-transparent">
            <div className="border-b-2 border-black px-10 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                    SYSTEM STATUS : ONLINE
                </span>
            </div>

            <div className="grid grid-cols-1  border-b border-black">
                <div className="p-8 border-r border-black">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4">
                        PLATFORM
                    </h3>

                    <p className="text-[11px] font-mono font-bold uppercase leading-relaxed opacity-70 border-l-4 border-black pl-3">
                        A COMMAND CENTER FOR BUILDERS AND ORGANIZERS.  <br />
                        CREATE. COLLABORATE. SCALE.
                    </p>


                </div>

            </div>

            <div className="px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                
                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/kr1sh5harma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-black shadow-[2px_2px_0px_0px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
                    >
                        <FaGithub className="text-lg " />
                        
                    </a>

                    
                    <a
                        href="https://www.linkedin.com/in/harsh-sharma-26b151306/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-black shadow-[2px_2px_0px_0px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
                    >
                        <FaLinkedin className="text-lg" />
                        
                    </a>

                    <a
                        href="https://mail.google.com/mail/?view=cm&to=krish9515274@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-black shadow-[2px_2px_0px_0px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
                    >
                        <FaEnvelope className="text-lg " />
                        
                    </a>
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                     © {new Date().getFullYear()} HackSter. All rights reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
