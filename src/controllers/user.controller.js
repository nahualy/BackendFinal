import User from '../models/User.js';

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
  const data = user.toJSON();
  return Object.fromEntries(
    publicUserFields
      .filter((field) => Object.hasOwn(data, field))
      .map((field) => [field, data[field]]),
  );
};

const handleError = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'El email ya está registrado' });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Los datos del usuario no son válidos',
      errors: error.errors.map(({ message, path }) => ({ message, path })),
    });
  }

  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor' });
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll({ attributes: publicUserFields });
    return res.json(users);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: publicUserFields });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(user);
  } catch (error) {
    return handleError(res, error);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(toPublicUser(user));
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.update(req.body);
    return res.json(toPublicUser(user));
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
};
