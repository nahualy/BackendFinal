import express from 'express';
import authRoutes from './auth.routes.js';
import roleRoutes from './role.routes.js';
import usersRoutes from './users.routes.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/users', usersRoutes);

export default router;
