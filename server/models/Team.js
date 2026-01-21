import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    hackathon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    requests: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    teamSize: {
        type: Number,
        required: true,
        min: 2,
        max: 8,
        default: 4,
    },
    needs: [
        {
            role: { type: String, required: true },
            count: { type: Number, default: 1 },
        }
    ],
    projectIdea: {
        type: String,
        maxlength: 500,
    },
    status: {
        type: String,
        enum: ['Recruiting', 'Full', 'Submitted'],
        default: 'Recruiting',
    }
}, {
    timestamps: true,
});

TeamSchema.index({ name: 1, hackathon: 1 }, { unique: true });

const Team = mongoose.model('Team', TeamSchema);
export default Team;