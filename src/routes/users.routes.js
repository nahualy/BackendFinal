import express from 'express';

import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  restoreUser,
  resetUserPassword,
  updateUser,
} from '../controllers/users.controller.js';
import { isAuthenticated } from '../controllers/auth.controller.js';
import validateSuperAdmin from '../middleware/validateSuperAdmin.js';

const router = express.Router();

router.use(isAuthenticated, validateSuperAdmin);
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id/restore', restoreUser);
router.put('/:id/password', resetUserPassword);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
