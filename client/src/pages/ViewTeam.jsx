import { io } from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoadingScreen from './LoadingScreen';
import { useParams, Link } from 'react-router-dom';

// Initialize socket outside component to prevent multiple connections
const socket = io('http://localhost:5000');

const ViewTeam = () => {
    const { id } = useParams(); 
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);
    
    // Chat States
    const [messages, setMessages] = useState([]);
    const [msgInput, setMsgInput] = useState("");
    const [chatInitialized, setChatInitialized] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll logic
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchTeam = async () => {
            if (!user?.token || !id) return;
            try {
                setLoading(true);
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }, 
                    params: { hackathonId: id } 
                };
                const { data } = await axios.get('http://localhost:5000/api/teams/my-team', config);
                setTeam(data);
            } catch (err) {
                console.error("API Error:", err.response?.data || err.message);
                setTeam(null);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [user?.token, id]);

    // Socket and History Logic
    useEffect(() => {
        if (team?._id && chatInitialized) {
            // Join the specific team room
            socket.emit('join_team', team._id);

            // Fetch History
            const fetchHistory = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`http://localhost:5000/api/messages/${team._id}`, config);
                    setMessages(data);
                } catch (err) {
                    console.error("Error fetching chat history", err);
                }
            };
            fetchHistory();

            // Listen for new messages
            socket.on('receive_message', (newMessage) => {
                setMessages((prev) => [...prev, newMessage]);
            });
        }

        return () => {
            socket.off('receive_message');
        };
    }, [team?._id, chatInitialized, user.token]);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!msgInput.trim()) return;

        const messageData = {
            teamId: team._id,
            senderId: user._id,
            text: msgInput
        };

        socket.emit('send_message', messageData);
        setMsgInput("");
    };

    if (loading) return <LoadingScreen message="SYNCING_TEAM_INTEL..." />;

    if (!team) return (
        <div className="h-[60vh] flex flex-col items-center justify-center p-10 font-black uppercase italic text-center">
            <h2 className="text-3xl mb-4">No_Team_Found</h2>
            <Link to={`/hackathon/${id}`} className="text-sm bg-black text-white px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors">
                Return to recruiting page
            </Link>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 animate-in fade-in duration-700">
            {/* --- TOP BANNER --- */}
            <div className="border-4 border-black p-6 md:p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">Project_Dashboard</span>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none break-words">
                            {team?.name || "UNKNOWN_TEAM"}
                        </h1>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <p className="font-mono text-sm bg-yellow-300 inline-block px-3 py-1 border-2 border-black font-bold">
                                {team?.hackathon?.name || "HACKATHON_PROJECT"}
                            </p>
                        </div>
                    </div>
                    <div className="border-4 border-black p-4 bg-black text-white font-black uppercase italic min-w-[140px] text-center shadow-[5px_5px_0px_0px_rgba(34,211,238,1)]">
                        <p className="text-[10px] tracking-widest opacity-70">Capacity</p>
                        <p className="text-3xl">{team?.members?.length || 0} / {team?.teamSize || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                
                <div className="lg:col-span-3 space-y-10">
                    {/* Mission Section */}
                    <div className="border-4 border-black p-6 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                        <h3 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-6 italic tracking-tighter">Team Description</h3>
                        <p className="font-mono text-lg leading-relaxed text-gray-800">
                            {team?.projectIdea || "NO_MISSION_DEFINED_YET"}
                        </p>
                    </div>

                    <div className="border-4 border-black p-6 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-6 italic tracking-tighter">Verified Roster</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {team?.members?.map((member) => (
                                <div key={member?._id} className="border-2 border-black p-4 group hover:bg-yellow-400 transition-all relative">
                                    <p className="font-black uppercase text-lg leading-none">{member?.name || "ANONYMOUS"}</p>
                                    <p className="text-[11px] font-mono mt-2 font-bold opacity-70 break-all">{member?.email || "NO_EMAIL"}</p>
                                    {member?._id === (team?.captain?._id || team?.captain) && (
                                        <div className="absolute -top-3 -right-3 bg-red-500 text-white border-2 border-black px-2 py-0.5 text-[9px] font-black uppercase rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            Captain
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="border-4 border-black p-6 bg-black text-white shadow-[12px_12px_0px_0px_rgba(255,255,0,1)] sticky top-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Comms_Center</h3>
                            <div className="flex gap-1">
                                <div className={`w-2 h-2 rounded-full ${chatInitialized ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            </div>
                        </div>

                        {/* CHAT DISPLAY BOX */}
                        <div className="h-[450px] bg-zinc-900 border-4 border-white mb-6 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                            {!chatInitialized ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="font-mono text-[10px] text-zinc-500 mb-4 tracking-[0.3em]">
                                        ERROR: ENCRYPTED_STREAM_NULL
                                    </div>
                                    <p className="font-mono text-xs opacity-40 uppercase">
                                        [ Secure channel initialization required ]
                                    </p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center font-mono text-[10px] text-zinc-500">
                                    [ NO_DATA_TRANSMISSIONS_RECORDED ]
                                </div>
                            ) : (
                                messages.map((m, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-2 border-2 ${m.sender?._id === user._id ? 'border-yellow-400 self-end bg-zinc-800' : 'border-white self-start'} max-w-[90%]`}
                                    >
                                        <p className="text-[9px] font-black uppercase text-cyan-400 mb-1 leading-none">
                                            {m.sender?.name || "Unknown"}
                                        </p>
                                        <p className="text-xs font-mono break-words">{m.text}</p>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* INPUT & INITIALIZE BUTTON */}
                        <div className="space-y-4">
                            {!chatInitialized ? (
                                <button 
                                    onClick={() => setChatInitialized(true)}
                                    className="w-full bg-yellow-400 text-black border-4 border-white py-4 font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    Initialize Secure Chat
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={msgInput}
                                        onChange={(e) => setMsgInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="TYPE_MESSAGE..."
                                        className="flex-1 bg-zinc-800 border-2 border-white p-2 font-mono text-xs focus:outline-none focus:border-yellow-400 text-white"
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        className="bg-yellow-400 text-black border-2 border-white px-4 font-black text-xs uppercase hover:bg-white transition-all"
                                    >
                                        Send
                                    </button>
                                </div>
                            )}
                            <p className="text-[9px] font-mono text-center opacity-50 uppercase tracking-widest">
                                {chatInitialized ? "CHANNEL_ENCRYPTED_AND_ACTIVE" : "Authorized Personnel Only // End-to-End Encryption"}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewTeam;