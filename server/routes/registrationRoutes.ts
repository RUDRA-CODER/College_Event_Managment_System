import { Router } from 'express';
import { RegistrationController } from '../controllers/RegistrationController';

const router = Router();
const registrationController = new RegistrationController();

router.get('/', registrationController.getAllRegistrations.bind(registrationController));
router.get('/:id', registrationController.getRegistrationById.bind(registrationController));
router.post('/', registrationController.createRegistration.bind(registrationController));
router.put('/:id', registrationController.updateRegistration.bind(registrationController));
router.delete('/:id', registrationController.deleteRegistration.bind(registrationController));

export default router;
