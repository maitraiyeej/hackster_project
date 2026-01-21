import express from 'express';
import { 
    requestToJoin,      // Updated
    manageJoinRequest,  // New
    leaveTeam, 
    getTeamDetails, 
    createTeam, 
    getRecruitingTeams, 
    removeMember, 
    deleteTeam, 
    updateTeam 
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getRecruitingTeams)
    .post(protect, createTeam);

router.route('/:id')
    .get(getTeamDetails)
    .put(protect, updateTeam)
    .delete(protect, deleteTeam);


router.route('/:id/request')
    .post(protect, requestToJoin);

router.route('/:id/manage-request')
    .post(protect, manageJoinRequest);



router.route('/:id/leave')
    .post(protect, leaveTeam); 

router.route('/:id/remove/:userId')
    .delete(protect, removeMember); 

export default router;