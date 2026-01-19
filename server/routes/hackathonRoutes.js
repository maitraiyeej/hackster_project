    import express from 'express';
    import { getHackathons, getHackathonById, createHackathon, updateHackathon, deleteHackathon, getMyHackathons } from '../controllers/hackathonController.js';
    import { protect } from '../middleware/authMiddleware.js';
    import { admin } from '../middleware/adminMiddleware.js';
    const router = express.Router();

    router.route('/')
        .get(getHackathons)
        .post(protect, admin, createHackathon)
    
    router.get('/my-events', protect, getMyHackathons);
        
    router.route('/:id')
        .get(getHackathonById)
        .put(protect, admin, updateHackathon)
        .delete(protect, admin, deleteHackathon);


    export default router;