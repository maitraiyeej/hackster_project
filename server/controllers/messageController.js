import Message from "../models/Message.js";

const getTeamMessages = async(req,res)=>{
    try {
        const { teamId } = req.params;
        const limit = parseInt(req.query.limit) || 50; 
        const skip = parseInt(req.query.skip) || 0;    

        const messages = await Message.find({ team: teamId })
            .populate('sender', 'name')
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

export default getTeamMessages;