const ID_PATTERN = /^(mod|sub)-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const validateModule = (module, path, ids, errors) => {
  if (!module || typeof module !== 'object' || Array.isArray(module)) {
    errors.push(`${path} debe ser un objeto`);
    return;
  }

  const requiredStringFields = ['id', 'name', 'description', 'route'];
  requiredStringFields.forEach((field) => {
    if (typeof module[field] !== 'string' || !module[field].trim()) {
      errors.push(`${path}.${field} debe ser un string no vacío`);
    }
  });

  if (typeof module.id === 'string') {
    if (!ID_PATTERN.test(module.id)) {
      errors.push(`${path}.id debe tener el formato mod-xxx o sub-xxx`);
    }

    if (ids.has(module.id)) {
      errors.push(`${path}.id está repetido: ${module.id}`);
    } else {
      ids.add(module.id);
    }
  }

  if (typeof module.route === 'string' && !module.route.startsWith('/')) {
    errors.push(`${path}.route debe comenzar con /`);
  }

  if (typeof module.isActive !== 'boolean') {
    errors.push(`${path}.isActive debe ser booleano`);
  }

  if (module.subModules !== undefined) {
    if (!Array.isArray(module.subModules)) {
      errors.push(`${path}.subModules debe ser un array`);
    } else {
      module.subModules.forEach((subModule, index) => {
        validateModule(subModule, `${path}.subModules[${index}]`, ids, errors);
      });
    }
  }
};

export const validateMenuStructure = (menu) => {
  const errors = [];
  const ids = new Set();

  if (!Array.isArray(menu)) {
    errors.push('El menú debe ser un array de módulos');
  } else {
    menu.forEach((module, index) => {
      validateModule(module, `menu[${index}]`, ids, errors);
    });
  }

  return { valid: errors.length === 0, errors };
};

export default validateMenuStructure;