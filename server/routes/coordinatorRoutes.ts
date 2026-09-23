import { Router } from 'express';
import { CoordinatorController } from '../controllers/CoordinatorController';
import { RegistrationController } from '../controllers/RegistrationController';
import { authMiddleware, requireCoordinatorEventAccess } from '../middleware/authMiddleware';

const router = Router();
const coordinatorController = new CoordinatorController();
const registrationController = new RegistrationController();

// Auth routes
router.post('/login', coordinatorController.login.bind(coordinatorController));

// All subsequent routes require authentication
router.use(authMiddleware);

// Coordinator Profile & Dashboard
router.get('/profile', coordinatorController.getProfile.bind(coordinatorController));
router.get('/dashboard', coordinatorController.getDashboardStats.bind(coordinatorController));
router.get('/events', coordinatorController.getAssignedEvents.bind(coordinatorController));
router.get('/registrations', coordinatorController.getAssignedRegistrations.bind(coordinatorController));

// Event specific registrations
router.get('/events/:eventId/registrations', requireCoordinatorEventAccess, registrationController.getRegistrationsByEventId.bind(registrationController));

export default router;
