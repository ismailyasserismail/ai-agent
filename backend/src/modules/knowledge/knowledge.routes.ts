import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { KnowledgeController } from './knowledge.controller';

const router = Router();

router.use(authenticate, authorize(['admin']));

router.get('/', KnowledgeController.listIntents);
router.post('/', [body('name').notEmpty(), body('description').notEmpty()], KnowledgeController.createIntent);
router.patch('/:id', KnowledgeController.updateIntent);
router.delete('/:id', KnowledgeController.deleteIntent);
router.get('/:id/phrases', KnowledgeController.listTrainingPhrases);
router.post('/:id/phrases', [body('phrase').notEmpty(), body('language').isIn(['en', 'ar'])], KnowledgeController.addTrainingPhrase);
router.delete('/:id/phrases/:phraseId', KnowledgeController.deleteTrainingPhrase);
router.get('/:id/responses', KnowledgeController.listResponses);
router.post('/:id/responses', [body('responseText').notEmpty(), body('language').isIn(['en', 'ar'])], KnowledgeController.addResponse);
router.delete('/:id/responses/:responseId', KnowledgeController.deleteResponse);

export default router;
