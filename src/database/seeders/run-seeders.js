import 'dotenv/config';

import sequelize from '../../config/database.js';
import seedRoles from './001-insert-roles.js';

export const runSeeders = async () => {
  await seedRoles();
};

if (process.argv[1]?.endsWith('run-seeders.js')) {
  try {
    await sequelize.authenticate();
    await runSeeders();
    console.log('Seeders ejecutados correctamente.');
  } catch (error) {
    console.error('Error al ejecutar los seeders:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}