import { io } from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoadingScreen from './LoadingScreen';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { showToast } from '@/components/SystemToast';

const API = import.meta.env.VITE_API_URL;

const ViewTeam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const socketRef = useRef(null);
    const chatEndRef = useRef(null);

    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [msgInput, setMsgInput] = useState("");
    const [chatInitialized, setChatInitialized] = useState(false);

    const fetchTeam = async () => {
        if (!user?.token || !id) return;

        try {
            const { data } = await axios.get(`${API}/api/teams/my-team`, {
                headers: { Authorization: `Bearer ${user.token}` },
                params: { hackathonId: id }
            });
            setTeam(data);
        } catch {
            setTeam(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [user?.token, id]);

    useEffect(() => {
        if (!user?.token) return;

        socketRef.current = io(API, {
            auth: { token: user.token }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user?.token]);

    useEffect(() => {
        if (!team?._id || !chatInitialized || !socketRef.current) return;

        const socket = socketRef.current;

        socket.emit('join_team', team._id);

        const handleReceiveMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [team?._id, chatInitialized]);

    useEffect(() => {
        if (!team?._id || !chatInitialized) return;

        const fetchHistory = async () => {
            try {
                const { data } = await axios.get(
                    `${API}/api/messages/${team._id}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );

                setMessages([]);      
                setMessages(data);
            } catch (err) {
                console.error("Chat history error", err);
            }
        };

        fetchHistory();
    }, [team?._id, chatInitialized]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!msgInput.trim() || !socketRef.current) return;

        socketRef.current.emit('send_message', {
            teamId: team._id,
            senderId: user._id,
            text: msgInput
        });

        setMsgInput("");
    };

    const handleLeaveTeam = async () => {
        if (!window.confirm("CONFIRM_SQUAD_EXIT: THIS_ACTION_CANNOT_BE_UNDONE")) return;

        try {
            await axios.post(
                `${API}/api/teams/${team._id}/leave`,
                {},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            navigate(`/hackathon/${id}`);
        } catch (err) {
            showToast({
                message: err.response?.data?.message,
                type: 'error'
            });
        }
    };

    if (loading) return <LoadingScreen message="SYNCING_TEAM_INTEL..." />;

    if (!team) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center p-10 font-black uppercase italic text-center">
                <h2 className="text-3xl mb-4">No_Team_Found</h2>
                <Link
                    to={`/hackathon/${id}`}
                    className="text-sm bg-black text-white px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors"
                >
                    Return to recruiting page
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 animate-in fade-in duration-700 mt-8">
            <div className="border-2 border-black p-6 md:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none
hover:translate-x-[6px]
hover:translate-y-[6px]
transition-all mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">Team Dashboard</span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none break-words">
                            {team?.name || "UNKNOWN_TEAM"}
                        </h1>
                        <div className="mt-4 flex flex-wrap gap-3 items-center">
                            <p className="font-mono text-sm bg-yellow-300 inline-block shadow-[2px_2px_0px_0px] hover:shadow-none
hover:translate-x-[2px]
hover:translate-y-[2px]
transition-all px-3 py-1 border-2 border-black font-bold">
                                {team?.hackathon?.name || "HACKATHON_PROJECT"}
                            </p>

                            {user._id !== (team?.captain?._id || team?.captain) && (
                                <button
                                    onClick={handleLeaveTeam}
                                    className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-sm font-bold bg-red-200 px-3 py-1 border-2 border-black hover:bg-red-300 uppercase active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                                >
                                    Leave Team
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="border-2 border-black p-2 font-black uppercase italic text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none
hover:translate-x-[3px]
hover:translate-y-[3px]
transition-all">
                        <p className="text-[10px] tracking-widest opacity-70">Capacity</p>
                        <p className="text-xl">{team?.members?.length || 0} / {team?.teamSize || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                <div className="lg:col-span-3 space-y-10">
                    <div className="border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none
hover:translate-x-[6px]
hover:translate-y-[6px]
transition-all relative overflow-hidden">
                        <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-6 italic tracking-tighter">Team Description</h3>
                        <p className="font-mono text-[15px] leading-relaxed text-gray-800">
                            {team?.projectIdea || "NO_MISSION_DEFINED_YET"}
                        </p>
                    </div>

                    <div className="border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none
hover:translate-x-[6px]
hover:translate-y-[6px]
transition-all">
                        <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-6 italic tracking-tighter">Verified Roster</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {team?.members?.map((member) => (
                                <Link
                                    to={`/user/${member._id || member}`}
                                    key={member?._id}
                                    className="border-2 border-black p-4 group hover:bg-yellow-400 transition-all relative block"
                                >
                                    <p className="font-black uppercase text-lg leading-none group-hover:underline">{member?.name || "ANONYMOUS"}</p>
                                    <p className="text-[11px] font-mono mt-2 font-bold opacity-70 break-all">{member?.email || "NO_EMAIL"}</p>
                                    {member?._id === (team?.captain?._id || team?.captain) && (
                                        <div className="absolute -top-3 -right-3 bg-red-500 text-white border-2 border-black px-2 py-0.5 text-[9px] font-black uppercase rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            Captain
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="border-2 border-black p-6 bg-black text-white sticky top-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black uppercase tracking-tighter italic">Team Discussion</h3>
                            <div className="flex gap-1">
                                <div className={`w-2 h-2 rounded-full ${chatInitialized ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            </div>
                        </div>

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
                                        <Link to={`/user/${m.sender?._id}`} className="text-[9px] font-black uppercase text-cyan-400 mb-1 leading-none hover:underline block">
                                            {m.sender?.name || "Unknown"}
                                        </Link>
                                        <p className="text-xs font-mono break-words">{m.text}</p>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

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