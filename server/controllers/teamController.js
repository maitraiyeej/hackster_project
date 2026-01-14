import Team from "../models/Team.js";
import pkg from 'mongoose';
const { isValidObjectId } = pkg;

const getTeamDetails = async (req, res) => {
    const teamId = req.params.id;

    if (!isValidObjectId(teamId)) {
        return res.status(400).json({ message: 'Invalid team ID format' });
    }

    try {
        const team = await Team.findById(teamId)
            .populate([
                { path: 'hackathon', select: 'name organization startDate' },
                { path: 'captain', select: 'name email role skills' },
                { path: 'members', select: 'name email role skills' }
            ]);

        if(!team){
            return res.status(404).json({message:'Team not found'});
        }
        res.json(team);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error fetching team details',
            error: error.message
        })
    }
}

const joinTeam = async (req, res) => {
    const teamId = req.params.id;
    const userId = req.user._id;

    if (!isValidObjectId(teamId)) {
        return res.status(400).json({ message: 'Invalid team ID format' })
    }

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: 'Team not found'
            })
        }

        if (team.members.map(m => m.toString()).includes(userId.toString())) {
            return res.status(400).json({
                message: "You are already a member of this team."
            })
        }

        if (team.members.length >= team.teamSize) {
            team.status = 'Full'
            await team.save();
            return res.status(400).json({ message: 'Team is already full.' })
        }

        team.members.push(userId);

        if (team.members.length === team.teamSize) {
            team.status = 'Full'
        }

        const updatedTeam = await team.save();

        const populatedTeam = await updatedTeam.populate([
            { path: 'members', select: 'name email role skills' }
        ]);
        res.json({ message: 'Successfully joined the team!', team: populatedTeam });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to join team',
            error: error.message
        })
    }
}

const leaveTeam = async (req, res) => {
    const teamId = req.params.id;
    const userId = req.user._id;

    if (!isValidObjectId(teamId)) {
        return res.status(400).json({
            message: 'Invalid Team ID format'
        })
    }

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' })
        }

        if (team.captain.toString() === userId.toString()) {
            return res.status(400).json({ message: 'Captains cannot leave the team. You must delete the team if necessary.' });
        }

        const initialLength = team.members.length;
        team.members = team.members.filter(memberId => memberId.toString() !== userId.toString());

        if (team.members.length === initialLength) {
            return res.status(400).json({
                message: 'You are not currently a member of this team.'
            })
        }

        if (team.status === 'Full' && team.members.length < team.teamSize) {
            team.status = 'Recruiting'
        }

        const updatedTeam = await team.save();

        res.status(200).json({
            message: 'Successfully left the team',
            team: updatedTeam
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to leave team',
            error:error.message
        })
    }
}


const createTeam = async (req, res) => {
    const captainId = req.user._id;
    const { name, hackathon, teamSize, needs, projectIdea } = req.body;

    if (!name || !hackathon || !needs || needs.length===0 ) {
        return res.status(400).json({
            message: 'Please provide a name, hackathon ID, and team needs.'
        })
    }

    if (!isValidObjectId(hackathon)) {
        return res.status(400).json({
            message: 'Invalid Hackathon ID.'
        })
    }

    try {
        const team = await Team.create({
            name,
            hackathon,
            captain: captainId,
            members: [captainId],
            teamSize,
            needs,
            projectIdea
        });

        const populatedTeam = await team.populate([
            { path: 'captain', select: 'name email role skills' },
            { path: 'members', select: 'name email role skills' },
        ])
        res.status(201).json(populatedTeam);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'A team with this name already exists for this hackathon.'
            })
        }
        res.status(500).json({
            message: 'Failed to create team',
            error: error.message
        })
    }
}


const getRecruitingTeams = async (req, res) => {
    try {

        const query = {
            status: 'Recruiting',
            'needs.0': { $exists: true }
        }

        const { hackathon, roleNeeded } = req.query;

        if (hackathon && isValidObjectId(hackathon)) {
            query.hackathon = hackathon;
        }

        if (roleNeeded) {
            query['needs.role'] = roleNeeded;
        }

        const teams = await Team.find(query)
            .populate([
                { path: 'hackathon', select: 'name organization startDate' },
                { path: 'captain', select: 'name role' }
            ])
            .sort({ createdAt: -1 });

        res.json(teams);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching recruiting teams',
            error: error.message
        })
    }
}

const removeMember = async(req,res) => {
    const {id, userId} = req.params;
    const captainId = req.user._id;

    try{
        const team= await Team.findById(id);

        if(!team) return res.status(404).json({
            message:'Team not found'
        });

        if(team.captain.toString() !== captainId.toString()){
            return res.status(403).json({
                message: 'Only captains can remove members'
            });
        }

        if(userId === team.captain.toString()){
            return res.status(400).json({
                message:'Captain cannot be removed. Delete the team instead'
            })
        }

        team.members = team.members.filter(m => m.toString() !== userId);

        if(team.status === 'Full' && team.members.length < team.teamSize){
            team.status = 'Recruiting';
        }

        await team.save();
        res.json({message:'Member removed successfully', team});


    }
    catch(error){
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
}

const deleteTeam = async(req,res) => {
    const {id} = req.params;
    const userId = req.user._id;

    try{
        const team = await Team.findById(id);

        if(!team) {
            return res.status(404).json({message:
                'Team not found'
            });
        }

        if(team.captain.toString() !== userId.toString()){
            return res.status(403).json({
                message: 'Unauthorized: Only the captain can delete this team'
            });
        }

        await Team.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Team delete successfully'
        })
    }
    catch(error){
        res.status(500).json({
            message:'Error deleting team',
            error: error.message
        })
    }
}

const updateTeam = async (req, res) => {
    const {id} = req.params;
    const userId = req.user._id;
    const {name, projectIdea, teamSize, needs} = req.body;

    try{
        const team = await Team.findById(id);

        if(!team) return res.status(404).json({
            message: 'Team not found'
        })

        team.name = name || team.name;
        team.projectIdea = projectIdea || team.projectIdea;
        team.teamSize = teamSize || team.teamSize;
        team.needs = needs || team.needs;

        const updatedTeam = await team.save();
        res.json(updatedTeam);
    }
    catch(error){
        res.status(500).json({
            message: 'Error updating team',
            error: error.message
        })
    }
}

export { joinTeam, leaveTeam, getTeamDetails, createTeam, getRecruitingTeams, removeMember, deleteTeam, updateTeam };