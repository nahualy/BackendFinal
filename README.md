# WorldCar Final Backend

## Requisitos

- Node.js instalado.
- PostgreSQL ejecutándose en el equipo.
- Una base de datos llamada `worldcarfinal`.

## Inicialización

1. Abre una terminal en la carpeta `Backend`.
2. Instala las dependencias:

```bash
npm install
```

3. Revisa el archivo `.env` y confirma estos valores:

```env
PORT=5000
DB_DIALECT=postgres
DB_NAME=worldcarfinal
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES
JWT_SECRET=CAMBIA_ESTE_SECRETO
```

No compartas el `.env` ni subas sus credenciales al repositorio.

4. Crea la base de datos si todavía no existe:

```sql
CREATE DATABASE worldcarfinal;
```

5. Inicia el backend en desarrollo:

```bash
npm run dev
```

Para ejecutarlo sin recarga automática:

```bash
npm start
```

El backend quedará disponible en `http://localhost:5000`. Inicia primero el backend y después el frontend (`npm run dev` desde la carpeta `Frontend`).
