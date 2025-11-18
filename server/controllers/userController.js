import User from "../models/User.js";

const getUserProfile = async(req,res) => {
    const user = req.user;

    if(user){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            skills:user.skills,
            bio:user.bio,
            githubUrl:user.githubUrl
        })
    }
    else{
        res.status(404).json({message:'User not found'})
    }
}

const updateUserProfile = async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.skills = req.body.skills || user.skills;
        user.bio = req.body.bio || user.bio;
        user.githubUrl = req.body.githubUrl || user.githubUrl;

        const updatedUser = await user.save();
    
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            skills: updatedUser.skills,
            bio: updatedUser.bio,
            githubUrl: updatedUser.githubUrl,
        })
    }
    else{
        res.status(404).json({message: "User not found"})
    }
}

export {getUserProfile, updateUserProfile}