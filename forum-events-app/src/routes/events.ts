import { Router } from 'express';
import EventsController from '../controllers/eventsController';

const router = Router();
const eventsController = new EventsController();

// Define routes for event-related operations
router.post('/events', eventsController.createEvent);
router.get('/events', eventsController.getAllEvents);
router.get('/events/:id', eventsController.getEventById);
router.put('/events/:id', eventsController.updateEvent);
router.delete('/events/:id', eventsController.deleteEvent);
router.get('/events/category/:category', eventsController.getEventsByCategory);
router.get('/events/date/:date', eventsController.getEventsByDate);

export default router;