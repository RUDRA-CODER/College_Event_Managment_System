import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authMiddleware, requireCoordinatorEventAccess, requireAdminAccess } from '../middleware/authMiddleware';

const router = Router();
const eventController = new EventController();

// Public routes (Students can see events)
router.get('/', eventController.getAllEvents.bind(eventController));
router.get('/:id', eventController.getEventById.bind(eventController));

// Protected routes (Admin / Coordinator)
router.use(authMiddleware);

// Coordinators can update their assigned events
router.put('/:id', requireCoordinatorEventAccess, eventController.updateEvent.bind(eventController));

// Only admins can create/delete
router.post('/', requireAdminAccess, eventController.createEvent.bind(eventController));
router.delete('/:id', requireAdminAccess, eventController.deleteEvent.bind(eventController));

export default router;
