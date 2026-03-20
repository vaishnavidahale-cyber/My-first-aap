import { Router } from 'express';
import ClubsController from '../controllers/clubsController';

const router = Router();
const clubsController = new ClubsController();

// Route to create a new club
router.post('/', clubsController.createClub);

// Route to get all clubs
router.get('/', clubsController.getAllClubs);

// Route to get a specific club by ID
router.get('/:id', clubsController.getClubById);

// Route to update a club by ID
router.put('/:id', clubsController.updateClub);

// Route to delete a club by ID
router.delete('/:id', clubsController.deleteClub);

// Route to manage events for a specific club
router.post('/:id/events', clubsController.createEventForClub);
router.get('/:id/events', clubsController.getEventsForClub);

export default router;