import express from 'express';

import { authenticateToken } from '../controllers/auth.controller.js';
import {
  createProvider,
  deleteProvider,
  getProvider,
  getProviders,
  updateProvider,
} from '../controllers/providers.controller.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getProviders);
router.get('/:id', getProvider);
router.post('/', createProvider);
router.put('/:id', updateProvider);
router.delete('/:id', deleteProvider);

export default router;