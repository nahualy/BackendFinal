import express from 'express';

import {
	authenticateToken,
	getLogin,
	getMe,
	logout,
	postLogin,
	postRegister,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/register', postRegister);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);

export default router;
