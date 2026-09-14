import sequelize from '../../config/database.js';

export const up = async () => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "providers" (
      "id" SERIAL PRIMARY KEY,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await sequelize.query(`
    ALTER TABLE "providers"
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  `);

  await sequelize.query(`
    SELECT setval(
      pg_get_serial_sequence('providers', 'id'),
      GREATEST(COALESCE((SELECT MAX("id") FROM "providers"), 1), 1),
      true
    )
  `);
};

export default up;