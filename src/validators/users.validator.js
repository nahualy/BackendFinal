const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCreateUser = (userData = {}) => {
  const errors = [];
  const requiredFields = ['nombres', 'apellidos', 'email', 'password', 'role'];

  requiredFields.forEach((field) => {
    if (userData[field] === undefined || userData[field] === null || userData[field] === '') {
      errors.push(`${field} es obligatorio`);
    }
  });

  if (userData.email !== undefined
    && (typeof userData.email !== 'string' || !EMAIL_PATTERN.test(userData.email.trim()))) {
    errors.push('email no tiene un formato válido');
  }

  if (userData.password !== undefined
    && (typeof userData.password !== 'string' || userData.password.length < 8)) {
    errors.push('password debe tener al menos 8 caracteres');
  }

  if (userData.role !== undefined
    && (!Number.isInteger(Number(userData.role)) || Number(userData.role) <= 0)) {
    errors.push('role debe ser un ID numérico válido');
  }

  return { valid: errors.length === 0, errors };
};

export default validateCreateUser;