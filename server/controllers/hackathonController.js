import Hackathon from "../models/Hackathon.js";
import pkg from 'mongoose';
const {isValidObjectId} = pkg;

const createHackathon = async(req,res) => {
    const hackathonData = {...req.body, createdBy: req.user._id};

    try{
        const hackathon = await Hackathon.create(hackathonData);
        res.status(201).json(hackathon);
    }
    catch(error){
        if(error.name==='ValidationError'){
            return res.status(400).json({
                message:'Validation failed',
                errors: error.message
            });
        }
        if(error.code === 11000){
            return res.status(400).json({
                message:'A hackathon with this name already exists.'
            })
        }
        res.status(500).json({
            message:'Failed to create hackathon',
            error:error.message
        })
    }
}

const updateHackathon = async(req,res) => {
    if(!isValidObjectId(req.params.id)){
        return res.status(400).json({
            message: 'Invalid Hackathon ID format'
        })
    }

    try{
        const hackathon = await Hackathon.findById(req.params.id);

        if(hackathon){
            const updatedHackathon = await Hackathon.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new:true, runValidators:true}
            );
            res.json(updatedHackathon);
        }
        else{
            res.status(404).json({
                message:'Hackathon not found'
            })
        }
    }
    catch(error){
        if(error.name==='ValidationError'){
            return res.status(400).json({message:'Validation failed', errors:error.message})
        }
        res.status(500).json({
            message:'Failed to update hackathon', 
            error:error.message
        })
    }
}

const deleteHackathon = async(req,res) => {
    if(!isValidObjectId(req.params.id)){
        return res.status(400).json({
            message:'Invalid Hackathon ID format'
        })
    }

    try{
        const result = await Hackathon.findByIdAndDelete(req.params.id);
        if(result){
            res.json({message:'Hackathon removed Successfully!'})
        }
        else{
            res.status(404).json({
                message:'Hackathon not found'
            })
        }
    }
    catch(error){
        res.status(500).json({
            message:'Failed to delete hackathon',
            error:error.message
        });
    }
}

const getHackathons = async(req,res) => {
    try{
        const query = {
            startDate: {$gte: new Date()}
        };

        const {location, techStack} = req.query;

        if(location){
            query.location = location;
        }

        if(techStack){
            query.techStack = {$in : [techStack]};
        }

        const hackathons = await Hackathon.find(query).sort({startDate:1});
        res.json(hackathons);
    }
    catch(error){
        res.status(500).json({
            message:'Error fetching hackathons', 
            error: error.message
        })
    }
}

const getHackathonById = async(req,res) => {
    if(!isValidObjectId(req.params.id)){
        return res.status(400).json({
            message: "Invalid Hackathon Id format"
        });
    }

    try{
        const hackathon = await Hackathon.findById(req.params.id);

        if(hackathon){
            res.json(hackathon);
        }
        else{
            res.status(404).json({
                message: 'Hackathon not found'
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: 'Error fetching hackathon',
            error: error.message
        })
    }
}

export {getHackathons, getHackathonById, createHackathon, updateHackathon, deleteHackathon};