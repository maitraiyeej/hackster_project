import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';        
import hackathonRoutes from './routes/hackathonRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/teams', teamRoutes);

app.use(notFound);      //catches request that dont match any route
app.use(errorHandler);  //general errro handling

const connectDB = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection successful!')
    }
    catch(error){
        console.log("MongoDB connection failed!", error.message);
        process.exit(1);
    }
}



const startServer = async() => {
    await connectDB();
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    })
}

startServer();