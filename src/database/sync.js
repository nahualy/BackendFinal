import 'dotenv/config';

import sequelize from '../config/database.js';
import createRoleTable from './migrations/001-create-role-table.js';
import createUsersTable from './migrations/002-create-users-table.js';
import createProvidersTable from './migrations/003-create-providers-table.js';
import seedRoles from './seeders/001-insert-roles.js';

export const runMigrations = async () => {
  await createRoleTable();
  console.log('Migración 001 completada: tabla role.');
  await createUsersTable();
  console.log('Migración 002 completada: tabla users.');
  await createProvidersTable();
  console.log('Migración 003 completada: tabla providers.');
};

export const syncDatabase = async () => {
  await sequelize.authenticate();
  console.log('Conexión a PostgreSQL establecida.');
  await runMigrations();
  await seedRoles();
  console.log('Seeder de roles ejecutado correctamente.');
};

if (process.argv[1]?.endsWith('sync.js')) {
  try {
    await syncDatabase();
    console.log('Base de datos sincronizada correctamente.');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}