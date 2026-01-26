import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
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

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes); // Use your message routes

// --- SOCKET.IO SETUP ---
const server = http.createServer(app); // 4. Create HTTP server from express app
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow your React frontend
        methods: ["GET", "POST"]
    }
});

// 5. Socket Logic
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join a specific team room
    socket.on('join_team', (teamId) => {
        socket.join(teamId);
        console.log(`User joined room: ${teamId}`);
    });

    // Handle sending message
    socket.on('send_message', async (data) => {
        try {
            const { teamId, senderId, text } = data;

            // Save message to MongoDB
            const newMessage = await Message.create({
                team: teamId,
                sender: senderId,
                text: text
            });

            // Populate sender name for the UI
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

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection successful!');
    } catch (error) {
        console.log("MongoDB connection failed!", error.message);
        process.exit(1);
    }
};

const startServer = async () => {
    await connectDB();
    // 6. Change app.listen to server.listen
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Socket.io Enabled)`);
    });
};

startServer();