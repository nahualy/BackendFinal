import { Role } from '../models/index.js';

export const requireSuperAdmin = async (req, res, next) => {
  try {
    const roleId = Number(req.auth?.role);
    if (!roleId) {
      return res.status(403).json({ message: 'Se requiere rol SuperAdmin' });
    }

    const role = await Role.findByPk(roleId, { attributes: ['id', 'name'] });
    if (!role || !['SuperAdmin', 'Admin'].includes(role.name)) {
      return res.status(403).json({ message: 'Solo SuperAdmin puede actualizar menús' });
    }

    return next();
  } catch (error) {
    console.error('Error al validar permisos de SuperAdmin:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};