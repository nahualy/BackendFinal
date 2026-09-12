import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import {
  JWT_SECRET,
  LOCKOUT_TIME,
  MAX_LOGIN_ATTEMPTS,
} from '../config/auth.config.js';

const saltRounds = 10;
const loginAttempts = new Map();
const revokedTokens = new Set();
const roleIds = {
  Admin: 1,
  SuperAdmin: 1,
  Gerente: 2,
  Vendedor: 3,
  Seller: 3,
  GestorInventario: 4,
  Analyst: 4,
  Analista: 4,
};

export const hashPassword = (password) => bcrypt.hash(password, saltRounds);

export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export const registerUser = async (userData) => {
  const email = userData.email.trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    const error = new Error('El email ya está registrado');
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const passwordHash = await hashPassword(userData.password);
  const user = await User.create({
    nombres: userData.nombres,
    apellidos: userData.apellidos,
    email,
    phone: userData.telefono || null,
    password: passwordHash,
    role: roleIds[userData.rol] || roleIds.Vendedor,
  }, { hooks: false });

  const createdUser = user.toJSON();
  delete createdUser.password;

  return {
    ...createdUser,
    telefono: createdUser.phone,
    rol: userData.rol || 'Vendedor',
  };
};

export const generateToken = (user) => jwt.sign(
  {
    sub: String(user.id),
    email: user.email,
    role: user.role,
  },
  JWT_SECRET,
  { expiresIn: '8h' },
);

export const verifyToken = (token) => {
  if (!token || revokedTokens.has(token)) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_error) {
    return null;
  }
};

export const getLoginAttempt = (identifier) => {
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    return { attempts: 0, blockedUntil: null };
  }

  if (attempt.blockedUntil && attempt.blockedUntil <= Date.now()) {
    loginAttempts.delete(identifier);
    return { attempts: 0, blockedUntil: null };
  }

  return { ...attempt };
};

export const isLoginBlocked = (identifier) => {
  const attempt = getLoginAttempt(identifier);
  return Boolean(attempt.blockedUntil && attempt.blockedUntil > Date.now());
};

export const recordLoginFailure = (identifier) => {
  const current = getLoginAttempt(identifier);
  const attempts = current.attempts + 1;
  const blockedUntil = attempts >= MAX_LOGIN_ATTEMPTS
    ? Date.now() + LOCKOUT_TIME
    : null;

  loginAttempts.set(identifier, { attempts, blockedUntil });
  return { attempts, blockedUntil };
};

export const resetLoginAttempts = (identifier) => {
  loginAttempts.delete(identifier);
};

export const revokeToken = (token) => {
  if (token) {
    revokedTokens.add(token);
  }
};

export const getBearerToken = (authorization = '') => {
  const [scheme, token] = authorization.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
};