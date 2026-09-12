import 'dotenv/config';

import app from './app.js';
import sequelize from './config/database.js';
import { syncDatabase } from './database/sync.js';

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await syncDatabase();

    app.listen(port, () => {
      console.log(`API ejecutándose en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    process.exit(1);
  }
}

startServer();
