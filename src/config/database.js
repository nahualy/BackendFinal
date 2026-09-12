import 'dotenv/config';

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'postgres',
  database: process.env.DB_NAME || process.env.DATABASE || 'worldcar_db',
  host: process.env.DB_HOST || process.env.HOST || 'localhost',
  port: Number(process.env.DB_PORT || process.env.PORT_DB) || 5432,
  username: process.env.DB_USER || process.env.USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PASSWORD,
  logging: false,
});

export default sequelize;
