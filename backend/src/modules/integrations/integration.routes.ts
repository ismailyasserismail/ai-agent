import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authMiddleware';
import { IntegrationController } from './integration.controller';

const router = Router();

router.use(authenticate);
router.get('/crm/contact', IntegrationController.crmContact);
router.post('/crm/ticket', [body('subject').notEmpty(), body('email').isEmail()], IntegrationController.createTicket);
router.get('/orders/:orderId', IntegrationController.orderStatus);

export default router;
