import {
  activateUser,
  createUser as createUserService,
  deleteUser as deleteUserService,
  getAllUsers,
  getUserById,
  updateUserPassword,
  updateUser as updateUserService,
} from '../services/users.service.js';
import crypto from 'node:crypto';
import { validateCreateUser } from '../validators/users.validator.js';

const success = (res, status, data, message) => res.status(status).json({
  success: true,
  data,
  message,
});

const failure = (res, status, message, data = {}) => res.status(status).json({
  success: false,
  data,
  message,
});

const handleError = (res, error) => {
  if (error.code === 'EMAIL_EXISTS' || error.name === 'SequelizeUniqueConstraintError') {
    return failure(res, 400, 'El email ya está registrado');
  }
  if (error.code === 'ROLE_NOT_FOUND') return failure(res, 400, error.message);
  if (error.name === 'SequelizeValidationError') return failure(res, 400, 'Los datos del usuario no son válidos');
  console.error('Error en users.controller:', error);
  return failure(res, 500, 'Error interno del servidor');
};

export const getUsers = async (_req, res) => {
  try {
    return success(res, 200, await getAllUsers(), 'Usuarios obtenidos correctamente');
  } catch (error) {
    return handleError(res, error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return user ? success(res, 200, user, 'Usuario obtenido correctamente')
      : failure(res, 404, 'Usuario no encontrado');
  } catch (error) {
    return handleError(res, error);
  }
};

export const createUser = async (req, res) => {
  const validation = validateCreateUser(req.body);
  if (!validation.valid) return failure(res, 400, 'Datos inválidos', validation.errors);

  try {
    return success(res, 201, await createUserService(req.body), 'Usuario creado correctamente');
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.params.id, req.body || {});
    return user ? success(res, 200, user, 'Usuario actualizado correctamente')
      : failure(res, 404, 'Usuario no encontrado');
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserService(req.params.id);
    return user ? success(res, 200, user, 'Usuario desactivado correctamente')
      : failure(res, 404, 'Usuario no encontrado');
  } catch (error) {
    return handleError(res, error);
  }
};

export const restoreUser = async (req, res) => {
  try {
    const user = await activateUser(req.params.id);
    return user ? success(res, 200, user, 'Usuario restaurado correctamente')
      : failure(res, 404, 'Usuario no encontrado');
  } catch (error) {
    return handleError(res, error);
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const temporaryPassword = crypto.randomBytes(9).toString('base64url');
    const user = await updateUserPassword(req.params.id, temporaryPassword);
    return user
      ? success(res, 200, { temporaryPassword }, 'Password restablecido correctamente')
      : failure(res, 404, 'Usuario no encontrado');
  } catch (error) {
    return handleError(res, error);
  }
};