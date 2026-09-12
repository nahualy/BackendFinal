import { Role } from '../models/index.js';
import { validateMenuStructure } from '../validators/menu.validator.js';

export const getRoleById = (id) => Role.findByPk(id);

export const getMenuByRoleId = async (roleId) => {
  const role = await getRoleById(roleId);

  if (!role) {
    const error = new Error('Rol no encontrado');
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }

  return role.menu || [];
};

export const validateAndSaveMenu = async (roleId, menu) => {
  const validation = validateMenuStructure(menu);
  if (!validation.valid) {
    const error = new Error('La estructura del menú no es válida');
    error.code = 'INVALID_MENU';
    error.details = validation.errors;
    throw error;
  }

  const role = await getRoleById(roleId);
  if (!role) {
    const error = new Error('Rol no encontrado');
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }

  role.menu = menu;
  await role.save();
  return role;
};

export const getAllRoles = () => Role.findAll({ order: [['id', 'ASC']] });