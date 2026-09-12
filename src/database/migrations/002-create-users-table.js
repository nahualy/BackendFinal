import sequelize from '../../config/database.js';

export const up = async () => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" SERIAL PRIMARY KEY,
      "nombres" VARCHAR(255) NOT NULL,
      "apellidos" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "password" VARCHAR(255) NOT NULL,
      "phone" VARCHAR(255),
      "role" INTEGER REFERENCES "role"("id") ON DELETE SET NULL,
      "isActived" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await sequelize.query(`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "phone" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "role" INTEGER,
      ADD COLUMN IF NOT EXISTS "isActived" BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  `);

  await sequelize.query('ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL');

  await sequelize.query('ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_role_fkey"');
  await sequelize.query(`
    ALTER TABLE "users"
      ADD CONSTRAINT "users_role_fkey"
      FOREIGN KEY ("role") REFERENCES "role"("id") ON DELETE SET NULL
  `);

  await sequelize.query('CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email")');
  await sequelize.query(`
    SELECT setval(
      pg_get_serial_sequence('users', 'id'),
      GREATEST(COALESCE((SELECT MAX("id") FROM "users"), 1), 1),
      true
    )
  `);
};

export default up;