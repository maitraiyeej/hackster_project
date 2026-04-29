import express from "express";

import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve("./.env"),
});
console.log("API KEY:", process.env.OPENAI_API_KEY);
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 

import hackathonRoutes from './routes/hackathonRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js'; 
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Message from './models/Message.js'; // 3. Import your Message model

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes); // Use your message routes

const server = http.createServer(app); // 4. Create HTTP server from express app
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173", 
            process.env.CLIENT_URL
        ],
        methods: ["GET", "POST"],
        credentials:true
    }
});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.post("/ai", (req, res) => {
  const { skill } = req.body;

  const suggestions = {
    ai: "🤖 Join AI hackathons like Smart India Hackathon, Devpost AI challenges, or build ML projects.",
    web: "🌐 Try Hacktoberfest, frontend hackathons, or full-stack challenges.",
    ml: "📊 Participate in Kaggle competitions or ML hackathons.",
    app: "📱 Build mobile apps in Flutter or React Native hackathons."
  };

  const reply =
    suggestions[skill?.toLowerCase()] ||
    "🚀 Explore hackathons on Devpost, Unstop, or Smart India Hackathon.";

  res.json({ reply });
});
   


io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_team', (teamId) => {
        socket.join(teamId);
        console.log(`User joined room: ${teamId}`);
    });

    socket.on('send_message', async (data) => {
        try {
            const { teamId, senderId, text } = data;

            const newMessage = await Message.create({
                team: teamId,
                sender: senderId,
                text: text
            });

            const populatedMessage = await newMessage.populate('sender', 'name');

            // Broadcast message only to that team room
            io.to(teamId).emit('receive_message', populatedMessage);
        } catch (error) {
            console.error("Socket Message Error:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

app.use(notFound);
app.use(errorHandler);

const PORT = 5001;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        //await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection successful!');
    } catch (error) {
        console.log("MongoDB connection failed!", error.message);
        process.exit(1);
    }
};

const startServer = async () => {
    //await connectDB();
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Socket.io Enabled)`);
    });
};

startServer();