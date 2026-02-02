import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = ({ user }) => {
    return (
        <footer className="bg-white border-t-2 border-black">

            <div className="border-b border-black min-h-[72px] flex items-center">
                <div className="px-6 font-extrabold text-lg tracking-wide">
                    <span className="italic uppercase">Hack</span>
                    <span className="bg-black text-white uppercase px-1 ">
                        Ster
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2 tracking-wide text-[12px] opacity-50">
                        Build together. Collaborate openly. Host responsibly.
                    </span>
                </div>
            </div>

            <div className="px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex items-center gap-4">
                    <span className="text-[12px] uppercase font-bold text-gray-500 tracking-widest">
                        Connect with me
                    </span>

                    {[
                        {
                            href: 'https://github.com/kr1sh5harma',
                            icon: <FaGithub />
                        },
                        {
                            href: 'https://www.linkedin.com/in/harsh-sharma-26b151306/',
                            icon: <FaLinkedin />
                        },
                        {
                            href: 'https://mail.google.com/mail/?view=cm&to=krish9515274@gmail.com',
                            icon: <FaEnvelope />
                        }
                    ].map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center border-2 border-black
                         shadow-[2px_2px_0px_0px] active:shadow-none
                         active:translate-x-[2px] active:translate-y-[2px]
                         opacity-60 hover:opacity-100 transition-all"
                        >
                            {item.icon}
                        </a>
                    ))}
                </div>

                <span className="text-[12px] font-black uppercase tracking-widest opacity-50 text-center">
                    © {new Date().getFullYear()} HackSter. All rights reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
