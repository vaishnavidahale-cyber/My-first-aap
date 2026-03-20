import { Router } from 'express';
import { DiscussionsController } from '../controllers/discussionsController';

const router = Router();
const discussionsController = new DiscussionsController();

// Route for creating a new discussion thread
router.post('/threads', discussionsController.createThread);

// Route for retrieving all discussion threads for a specific event
router.get('/threads/:eventId', discussionsController.getThreads);

// Route for posting a message in a discussion thread
router.post('/threads/:threadId/messages', discussionsController.postMessage);

// Route for retrieving messages from a specific discussion thread
router.get('/threads/:threadId/messages', discussionsController.getMessages);

// Route for creating a poll in a discussion thread
router.post('/threads/:threadId/polls', discussionsController.createPoll);

// Route for retrieving polls from a specific discussion thread
router.get('/threads/:threadId/polls', discussionsController.getPolls);

// Route for submitting a response to a poll
router.post('/polls/:pollId/responses', discussionsController.submitPollResponse);

export default router;