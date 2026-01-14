import express from 'express'
import { joinTeam, leaveTeam, getTeamDetails, createTeam, getRecruitingTeams, removeMember, deleteTeam, updateTeam } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/')
    .get(getRecruitingTeams)
    .post(protect, createTeam);

router.route('/:id')
    .get(getTeamDetails)
    .put(protect, updateTeam)
    .delete(protect, deleteTeam);

router.route('/:id/join')
    .put(protect, joinTeam)

router.route('/:id/leave')
    .put(protect, leaveTeam);

router.route('/:id/remove/:userId').put(protect, removeMember);

export default router;