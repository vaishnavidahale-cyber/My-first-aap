import { Router } from 'express';
import UsersController from '../controllers/usersController';

const router = Router();
const usersController = new UsersController();

// User registration
router.post('/register', usersController.register);

// User authentication
router.post('/login', usersController.login);

// Get user profile
router.get('/profile/:id', usersController.getProfile);

// Update user profile
router.put('/profile/:id', usersController.updateProfile);

// Upload after-event experience
router.post('/experience', usersController.uploadExperience);

export default router;