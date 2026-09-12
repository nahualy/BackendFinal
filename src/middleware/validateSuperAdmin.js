import { Role } from '../models/index.js';

export const validateSuperAdmin = async (req, res, next) => {
  try {
    const role = await Role.findByPk(Number(req.auth?.role), {
      attributes: ['name'],
    });

    if (!role || role.name !== 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        data: {},
        message: 'Acceso denegado. Se requieren permisos de SuperAdmin.',
      });
    }

    return next();
  } catch (error) {
    console.error('Error al validar SuperAdmin:', error);
    return res.status(500).json({
      success: false,
      data: {},
      message: 'Error interno del servidor',
    });
  }
};

export default validateSuperAdmin;