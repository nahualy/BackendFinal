import { Role, User } from '../models/index.js';
import {
  comparePassword,
  generateToken,
  getBearerToken,
  isLoginBlocked,
  recordLoginFailure,
  registerUser,
  resetLoginAttempts,
  revokeToken,
  verifyToken,
} from '../services/auth.service.js';

const publicUserFields = [
  'id',
  'nombres',
  'apellidos',
  'email',
  'phone',
  'role',
  'isActived',
  'createdAt',
  'updatedAt',
];

const toPublicUser = (user) => {
  const publicUser = Object.fromEntries(
    publicUserFields.map((field) => [field, user[field]]),
  );
  publicUser.roleDetails = user.roleDetails;
  return publicUser;
};

const findUserById = (id) => User.findByPk(id, {
  include: [{
    model: Role,
    as: 'roleDetails',
    attributes: ['id', 'name', 'menu'],
  }],
});

export const getLogin = (_req, res) => res.json({
  message: 'Utiliza POST /api/auth/login para iniciar sesión',
});

export const postRegister = async (req, res) => {
  const {
    nombres,
    apellidos,
    email,
    telefono,
    password,
    confirmPassword,
  } = req.body || {};

  const requiredFields = [nombres, apellidos, email, password, confirmPassword];
  if (requiredFields.some((field) => typeof field !== 'string' || !field.trim())) {
    return res.status(400).json({
      message: 'Nombres, apellidos, email, contraseña y confirmación son obligatorios',
    });
  }

  if (telefono !== undefined && telefono !== null && typeof telefono !== 'string') {
    return res.status(400).json({ message: 'El teléfono no es válido' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    const user = await registerUser({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      email,
      telefono: telefono?.trim() || null,
      password,
      rol: 'Vendedor',
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user,
    });
  } catch (error) {
    if (error.code === 'EMAIL_EXISTS' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Los datos del usuario no son válidos',
        errors: error.errors.map(({ message: detail, path }) => ({ detail, path })),
      });
    }

    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const postLogin = async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const { password } = req.body || {};

  if (!email || typeof password !== 'string' || !password) {
    return res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
  }

  if (isLoginBlocked(email)) {
    return res.status(429).json({
      message: 'Demasiados intentos fallidos. Inténtalo de nuevo en 15 minutos',
    });
  }

  try {
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'menu'],
      }],
    });

    if (!user || !(await comparePassword(password, user.password))) {
      recordLoginFailure(email);
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    if (!user.isActived) {
      return res.status(403).json({ message: 'El usuario está inactivo' });
    }

    resetLoginAttempts(email);
    return res.json({
      message: 'Inicio de sesión exitoso',
      token: generateToken(user),
      tokenType: 'Bearer',
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const authenticateToken = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }

  req.auth = payload;
  req.authToken = token;
  return next();
};

export const isAuthenticated = authenticateToken;

export const logout = (req, res) => {
  try {
    revokeToken(req.authToken);
    return res.json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.auth.sub);

    if (!user || !user.isActived) {
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
    }

    return res.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error('Error al obtener el usuario autenticado:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};