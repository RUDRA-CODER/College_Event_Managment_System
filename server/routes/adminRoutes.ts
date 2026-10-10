import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware, requireAdminAccess } from '../middleware/authMiddleware';

const router = Router();
const adminController = new AdminController();

// Auth routes (can be mounted differently but kept here for simplicity)
router.post('/login', adminController.login.bind(adminController));

// Protected routes (Admin only)
router.use(authMiddleware);
router.use(requireAdminAccess);

router.get('/dashboard', adminController.getDashboardStats.bind(adminController));
router.get('/coordinators', adminController.getCoordinators.bind(adminController));
router.post('/coordinators', adminController.createCoordinator.bind(adminController));
router.get('/coordinators/:id', adminController.getCoordinatorById.bind(adminController));
router.delete('/coordinators/:id', adminController.deleteCoordinator.bind(adminController));
router.get('/registrations', adminController.getAllRegistrations.bind(adminController));

router.get('/profile', adminController.getProfile.bind(adminController));
router.put('/profile', adminController.updateProfile.bind(adminController));

export default router;
