import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, 
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User',
    },
    skills: [
        {
            type: String,
            trim: true,
        }
    ],
    bio: {
        type: String,
        maxlength: 300,
    },
    githubUrl: {
        type: String,
    }
}, {
    timestamps: true,
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


const User = mongoose.model('User', UserSchema);
export default User;