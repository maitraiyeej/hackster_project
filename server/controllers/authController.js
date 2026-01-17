import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const registerUser = async(req,res)=>{
    const {name, email, password, role} = req.body;
    if(!name || !email || !password || !role){
        return res.status(400).json({
            message:"Please enter all the required fields."
        })
    }

    try{
        const userExists = await User.findOne({email});
        
        if(userExists){
            return res.status(400).json({message:'User already exists.'});
        }


        const user = await User.create({
            name,
            email,
            password,
            role: role || 'User'
        })

        if(user){
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:await generateToken(user._id) 
            })
        }
    }

    catch(error){
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        })
    }
}

   
const loginUser = async(req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:'Please enter all the required fields.'})
    }

    try{
        const user = await User.findOne({email}).select('+password');

        if(user && (await user.matchPassword(password))){ 
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token: await generateToken(user._id),
            })
        }
        else{
            res.status(401).json({
                message: 'Invalid email or password'
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: 'Login failed',
            error:error.message
        })
    }
}

export {registerUser, loginUser};