import express from 'express';

import { authenticateToken } from '../controllers/auth.controller.js';
import { getMenu, getRoles, updateMenu } from '../controllers/role.controller.js';
import { requireSuperAdmin } from '../middleware/superAdmin.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireSuperAdmin, getRoles);
router.get('/menu', authenticateToken, getMenu);
router.put('/:id/menu', authenticateToken, requireSuperAdmin, updateMenu);

export default router;