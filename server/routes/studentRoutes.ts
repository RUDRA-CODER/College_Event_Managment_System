import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = Router();
const studentController = new StudentController();

// Public auth routes
router.post('/signup', studentController.signup.bind(studentController));
router.post('/resend-otp', studentController.resendOTP.bind(studentController));
router.post('/verify-email', studentController.verifyEmail.bind(studentController));
router.post('/login', studentController.login.bind(studentController));

// Protected routes
router.get('/profile', authMiddleware, requireRole('student'), studentController.getProfile.bind(studentController));
router.put('/profile', authMiddleware, requireRole('student'), studentController.updateProfile.bind(studentController));
router.put('/change-password', authMiddleware, requireRole('student'), studentController.changePassword.bind(studentController));

export default router;
