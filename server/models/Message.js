import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required:true,
        maxLength:2000
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true});

const Message = mongoose.model('Message', messageSchema);
export default Message;