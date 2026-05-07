# Prisma Database Setup for Movies Space

This repository includes a Prisma schema at `prisma/schema.prisma` and a root `package.json` with Prisma CLI scripts.

## 1. Configure your PostgreSQL database

Create a PostgreSQL database and user. Example:

```bash
sudo -u postgres psql
CREATE DATABASE movies_space;
CREATE USER movies_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE movies_space TO movies_user;
\q
```

## 2. Set `DATABASE_URL`

In the repo root, create or update `.env` with the database URL:

```env
DATABASE_URL="postgresql://movies_user:secure_password@localhost:5432/movies_space"
```

If you use a PostgreSQL socket path or cloud provider, update the URL accordingly.

## 3. Install dependencies

From the repository root:

```bash
npm install
```

## 4. Generate Prisma Client

```bash
npm run prisma:generate
```

## 5. Push the schema to the database

```bash
npm run prisma:db:push
```

This creates or updates the PostgreSQL schema based on `prisma/schema.prisma`.

## 6. Optional: Open Prisma Studio

```bash
npm run prisma:studio
```

## 7. Backend-specific Prisma support

The backend is now wired to Prisma directly through `@prisma/client`.

From the `backend/` folder, you can run:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:db:push
```

These commands run the Prisma CLI from the repository root schema and ensure the backend has the generated client.

## 8. Use Prisma in your backend

The schema is configured to use `DATABASE_URL` from the environment. Once generated, Prisma Client can be imported from `@prisma/client`.

Example connection file:

```js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

## 8. Verify the connection

After pushing the schema, confirm you can connect by running:

```bash
npx prisma db pull
```

If this succeeds, Prisma is connected to your database.

## Notes

- `prisma/schema.prisma` now includes models for `User`, `Video`, `Favorite`, `WatchHistory`, and `MovieRequest`.
- Keep your `DATABASE_URL` secret and do not commit it to source control.
- If you need to update models, edit `prisma/schema.prisma` and rerun `npm run prisma:db:push`.
