import { Role, User, sequelize } from '../models/index.js';
import { hashPassword } from './auth.service.js';

const userAttributes = [
  'id',
  'nombres',
  'apellidos',
  'email',
  'phone',
  'role',
  'isActived',
  'createdAt',
];

const roleInclude = {
  model: Role,
  as: 'roleDetails',
  attributes: ['id', 'name'],
};

const toPublicUser = (user) => {
  const data = user.toJSON();
  return {
    id: data.id,
    nombres: data.nombres,
    apellidos: data.apellidos,
    email: data.email,
    phone: data.phone,
    role: data.roleDetails?.name || null,
    roleId: data.role,
    isActived: data.isActived,
    createdAt: data.createdAt,
  };
};

const throwDatabaseError = (error) => {
  console.error('Error en users.service:', error);
  throw error;
};

export const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: userAttributes,
      include: [roleInclude],
      order: [['id', 'ASC']],
    });
    return users.map(toPublicUser);
  } catch (error) {
    throwDatabaseError(error);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: userAttributes,
      include: [roleInclude],
    });
    return user ? toPublicUser(user) : null;
  } catch (error) {
    throwDatabaseError(error);
  }
};

export const createUser = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const email = userData.email.trim().toLowerCase();
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      const error = new Error('El email ya está registrado');
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const role = await Role.findByPk(Number(userData.role), { transaction });
    if (!role) {
      const error = new Error('El rol indicado no existe');
      error.code = 'ROLE_NOT_FOUND';
      throw error;
    }

    const user = await User.create({
      nombres: userData.nombres.trim(),
      apellidos: userData.apellidos.trim(),
      email,
      phone: userData.phone?.trim() || null,
      password: await hashPassword(userData.password),
      role: role.id,
      isActived: userData.isActived ?? true,
    }, { transaction, hooks: false });

    await transaction.commit();
    const createdUser = await User.findByPk(user.id, {
      attributes: userAttributes,
      include: [roleInclude],
    });
    return toPublicUser(createdUser);
  } catch (error) {
    await transaction.rollback();
    throwDatabaseError(error);
  }
};

export const updateUser = async (id, userData) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return null;
    }

    const changes = {};
    if (userData.nombres !== undefined) changes.nombres = userData.nombres.trim();
    if (userData.apellidos !== undefined) changes.apellidos = userData.apellidos.trim();
    if (userData.phone !== undefined) changes.phone = userData.phone?.trim() || null;
    if (userData.isActived !== undefined) changes.isActived = userData.isActived;

    if (userData.email !== undefined) {
      const email = userData.email.trim().toLowerCase();
      const existingUser = await User.findOne({ where: { email }, transaction });
      if (existingUser && existingUser.id !== user.id) {
        const error = new Error('El email ya está registrado');
        error.code = 'EMAIL_EXISTS';
        throw error;
      }
      changes.email = email;
    }

    if (userData.role !== undefined) {
      const role = await Role.findByPk(Number(userData.role), { transaction });
      if (!role) {
        const error = new Error('El rol indicado no existe');
        error.code = 'ROLE_NOT_FOUND';
        throw error;
      }
      changes.role = role.id;
    }

    await user.update(changes, { transaction });
    await transaction.commit();
    return getUserById(user.id);
  } catch (error) {
    await transaction.rollback();
    throwDatabaseError(error);
  }
};

export const updateUserPassword = async (id, newPassword) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction });
    if (!user) return null;

    await user.update({ password: await hashPassword(newPassword) }, {
      transaction,
      hooks: false,
    });
    await transaction.commit();
    return getUserById(id);
  } catch (error) {
    await transaction.rollback();
    throwDatabaseError(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update({ isActived: false });
    return getUserById(id);
  } catch (error) {
    throwDatabaseError(error);
  }
};

export const activateUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update({ isActived: true });
    return getUserById(id);
  } catch (error) {
    throwDatabaseError(error);
  }
};