import sequelize from '../../config/database.js';

export const up = async () => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "role" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(100) NOT NULL UNIQUE,
      "menu" JSONB NOT NULL DEFAULT '[]'::jsonb,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await sequelize.query(`
    ALTER TABLE "role"
      ADD COLUMN IF NOT EXISTS "menu" JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  `);

  await sequelize.query('UPDATE "role" SET "menu" = \'[]\'::jsonb WHERE "menu" IS NULL');
  await sequelize.query('ALTER TABLE "role" ALTER COLUMN "menu" SET DEFAULT \'[]\'::jsonb');
  await sequelize.query('ALTER TABLE "role" ALTER COLUMN "menu" SET NOT NULL');
};

export default up;