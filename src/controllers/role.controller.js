import { getAllRoles, getMenuByRoleId, validateAndSaveMenu } from '../services/role.service.js';

export const getRoles = async (_req, res) => {
  try {
    const roles = await getAllRoles();
    return res.json({ roles });
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getMenu = async (req, res) => {
  try {
    const menu = await getMenuByRoleId(req.auth.role);
    return res.json({ menu });
  } catch (error) {
    if (error.code === 'ROLE_NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }

    console.error('Error al obtener el menú:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const role = await validateAndSaveMenu(req.params.id, req.body?.menu);
    return res.json({
      message: 'Menú actualizado correctamente',
      role,
    });
  } catch (error) {
    if (error.code === 'INVALID_MENU') {
      return res.status(400).json({
        message: error.message,
        errors: error.details,
      });
    }

    if (error.code === 'ROLE_NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }

    console.error('Error al actualizar el menú:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};