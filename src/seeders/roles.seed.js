import Role from '../models/Role.js';

export const initialMenu = [
  {
    id: 'mod-dashboard',
    name: 'Dashboard',
    description: 'Panel principal con indicadores clave de rendimiento, gráficos y resúmenes en tiempo real.',
    route: '/dashboard',
    isActive: true,
  },
  {
    id: 'mod-admin',
    name: 'Administración',
    description: 'Gestión global de usuarios, roles, permisos y configuraciones del sistema.',
    route: '/admin',
    isActive: true,
    subModules: [
      { id: 'sub-admin-users', name: 'Gestión de Usuarios', description: 'Alta, baja, modificación y asignación de estado de los usuarios.', route: '/admin/usuarios', isActive: true },
      { id: 'sub-admin-roles', name: 'Roles y Permisos', description: 'Definición de perfiles de acceso y restricciones de seguridad.', route: '/admin/roles-permisos', isActive: true },
      { id: 'sub-admin-logs', name: 'Historial de Actividad', description: 'Auditoría de acciones realizadas por los usuarios en el sistema.', route: '/admin/logs', isActive: true },
      { id: 'sub-admin-config', name: 'Restaura password', description: 'Restart password del usuario', route: '/admin/configuracion', isActive: true },
    ],
  },
  {
    id: 'mod-inventory',
    name: 'Inventario',
    description: 'Control de existencias, almacenes, movimientos y catálogo de productos.',
    route: '/inventario',
    isActive: true,
    subModules: [
      { id: 'sub-inv-products', name: 'Catálogo de Productos', description: 'Administración de artículos, precios, códigos de barra y categorías.', route: '/inventario/productos', isActive: true },
      { id: 'sub-inv-stock', name: 'Control de Stock', description: 'Monitoreo de existencias mínimas, máximas y alertas de reposición.', route: '/inventario/stock', isActive: true },
      { id: 'sub-inv-movements', name: 'Movimientos de Almacén', description: 'Registro de entradas, salidas y transferencias entre sucursales o bodegas.', route: '/inventario/movements', isActive: true },
      { id: 'sub-inv-providers', name: 'Proveedores', description: 'Directorio de proveedores y asociación con órdenes de compra.', route: '/inventario/proveedores', isActive: true },
    ],
  },
];

export const seedRoles = () => Role.bulkCreate([
  { id: 1, name: 'Admin', menu: initialMenu },
  { id: 2, name: 'Seller', menu: initialMenu },
  { id: 3, name: 'Analyst', menu: initialMenu },
], { updateOnDuplicate: ['name', 'menu'] });

export default seedRoles;