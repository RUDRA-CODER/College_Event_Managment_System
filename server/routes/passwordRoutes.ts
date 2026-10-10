import { Router } from 'express';
import { PasswordController } from '../controllers/passwordController';

const router = Router();
const passwordController = new PasswordController();

router.post('/forgot', passwordController.forgotPassword);
router.post('/reset', passwordController.resetPassword);

export default router;
