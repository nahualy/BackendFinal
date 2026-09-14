import Role from '../../models/Role.js';
import sequelize from '../../config/database.js';
import { validateMenuStructure } from '../../validators/menu.validator.js';

const dashboard = {
  id: 'mod-dashboard',
  name: 'Dashboard',
  description: 'Panel principal con indicadores clave de rendimiento, gráficos y resúmenes en tiempo real.',
  route: '/dashboard',
  isActive: true,
};

const adminUsers = {
  id: 'sub-admin-users',
  name: 'Gestión de Usuarios',
  description: 'Alta, baja, modificación y asignación de estado de los usuarios.',
  route: '/admin/usuarios',
  isActive: true,
};

const adminRoles = {
  id: 'sub-admin-roles',
  name: 'Roles y Permisos',
  description: 'Definición de perfiles de acceso y restricciones de seguridad.',
  route: '/admin/roles-permisos',
  isActive: true,
};

const adminLogs = {
  id: 'sub-admin-logs',
  name: 'Historial de Actividad',
  description: 'Auditoría de acciones realizadas por los usuarios en el sistema.',
  route: '/admin/logs',
  isActive: true,
};

const adminConfig = {
  id: 'sub-admin-config',
  name: 'Restaura password',
  description: 'Restart password del usuario',
  route: '/admin/configuracion',
  isActive: true,
};

const admin = {
  id: 'mod-admin',
  name: 'Administración',
  description: 'Gestión global de usuarios, roles, permisos y configuraciones del sistema.',
  route: '/admin',
  isActive: true,
  subModules: [adminUsers, adminRoles, adminLogs, adminConfig],
};

const inventoryProducts = {
  id: 'sub-inv-products',
  name: 'Catálogo de Productos',
  description: 'Administración de artículos, precios, códigos de barra y categorías.',
  route: '/inventario/productos',
  isActive: true,
};

const inventoryStock = {
  id: 'sub-inv-stock',
  name: 'Control de Stock',
  description: 'Monitoreo de existencias mínimas, máximas y alertas de reposición.',
  route: '/inventario/stock',
  isActive: true,
};

const inventoryMovements = {
  id: 'sub-inv-movements',
  name: 'Movimientos de Almacén',
  description: 'Registro de entradas, salidas y transferencias entre sucursales o bodegas.',
  route: '/inventario/movements',
  isActive: true,
};

const inventoryProviders = {
  id: 'sub-inv-providers',
  name: 'Proveedores',
  description: 'Directorio de proveedores y asociación con órdenes de compra.',
  route: '/inventario/proveedores',
  isActive: true,
};

const inventory = {
  id: 'mod-inventory',
  name: 'Inventario',
  description: 'Control de existencias, almacenes, movimientos y catálogo de productos.',
  route: '/inventario',
  isActive: true,
  subModules: [inventoryProducts, inventoryStock, inventoryMovements, inventoryProviders],
};

const providerManagement = {
  id: 'sub-providers-manage',
  name: 'Gestionar',
  description: 'Gestión de proveedores.',
  route: '/proveedores/gestionar',
  isActive: true,
};

const providers = {
  id: 'mod-providers',
  name: 'Proveedores',
  description: 'Gestión de proveedores.',
  route: '/proveedores',
  isActive: true,
  subModules: [providerManagement],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export const roleMenus = {
  SuperAdmin: [clone(dashboard), clone(admin), clone(inventory)],
  Gerente: [
    clone(dashboard),
    { ...clone(admin), subModules: [clone(adminUsers), clone(adminLogs)] },
    { ...clone(inventory), subModules: undefined },
  ],
  Vendedor: [
    clone(dashboard),
    { ...clone(inventory), subModules: [clone(inventoryProducts)] },
  ],
  GestorInventario: [clone(inventory)],
  proveedor: [clone(providers)],
};

export const roles = [
  { id: 1, name: 'SuperAdmin', menu: roleMenus.SuperAdmin },
  { id: 2, name: 'Gerente', menu: roleMenus.Gerente },
  { id: 3, name: 'Vendedor', menu: roleMenus.Vendedor },
  { id: 4, name: 'GestorInventario', menu: roleMenus.GestorInventario },
  { id: 5, name: 'proveedor', menu: roleMenus.proveedor },
];

export const seed = async () => {
  roles.forEach(({ menu }) => {
    const validation = validateMenuStructure(menu);
    if (!validation.valid) {
      throw new Error(`Menú de roles inválido: ${validation.errors.join('; ')}`);
    }
  });

  for (const role of roles) {
    await Role.upsert(role);
  }

  await sequelize.query(`
    SELECT setval(
      pg_get_serial_sequence('role', 'id'),
      GREATEST(COALESCE((SELECT MAX("id") FROM "role"), 1), 1),
      true
    )
  `);
};

export default seed;