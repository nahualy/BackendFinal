import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import routes from './routes/index.js';
import usersRoutes from './routes/users.routes.js';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(currentDirectory, '../public')));
app.use('/api', routes);
app.use('/api/admin', usersRoutes);
app.use('/api/admin/usuarios', usersRoutes);

export default app;
