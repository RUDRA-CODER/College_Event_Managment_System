import { Router } from 'express';
import { RegistrationController } from '../controllers/RegistrationController';
import { authMiddleware, requireRole, requireAdminAccess } from '../middleware/authMiddleware';

const router = Router();
const registrationController = new RegistrationController();

router.use(authMiddleware);

// Admin only routes
router.get('/', requireAdminAccess, registrationController.getAllRegistrations.bind(registrationController));

// Student specific routes
router.get('/me', requireRole('student'), registrationController.getMyRegistrations.bind(registrationController));
router.post('/', requireRole('student'), registrationController.createRegistration.bind(registrationController));

// Endpoints requiring custom role checking based on ownership
router.get('/:id', registrationController.getRegistrationById.bind(registrationController));
router.put('/:id', registrationController.updateRegistration.bind(registrationController));
router.delete('/:id', registrationController.deleteRegistration.bind(registrationController));

export default router;
