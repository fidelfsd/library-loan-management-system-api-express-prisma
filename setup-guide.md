# Basic Steps for Building an Express API with Prisma and JavaScript

## 🛠️ Install modules

### Init project
```sh
npm init -y
```

### Express
```sh
npm i express
```

### Prisma CLI and Prisma Client
```sh
npm i prisma -D 
npm i @prisma/client
```

### Additional modules
```sh
npm i nodemon -D
npm i bcrypt
npm i jsonwebtoken
npm i dotenv
npm i cors
```

## ⚙️ Configurations

### Init prisma
```sh
npx prisma init
```

### Initial project structure
```sh
├── prisma
│   ├── seeders
│       ├── seed.js
│   ├── client.js
│   ├── schema.prisma
├── src
│   ├── controllers
│   ├── helpers
│   ├── middlewares
│   ├── routes
│   ├── app.js
│   ├── server.js
├── .env
├── .env-example
├── .gitignore
├── package.json
├── README.md
```

### Configure `package.json` scripts
```json
{
"scripts": {
    "migrate:dev": "npx prisma migrate dev",
    "migrate:prod": "npx prisma migrate deploy",
    "seed": "npx prisma db-seed",
    "start": "node ./src/server.js",
    "dev": "nodemon ./src/server.js"
  },
  "prisma": {
    "seed": "node prisma/seeders/seed.js"
  },
}
```

## Data Model Definition (Example)

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  email         String         @unique
  password      String
  isActive      Boolean        @default(true) @map("is_active")
  roleId        Int            @map("role_id")
  createdAt     DateTime       @default(now()) @map("created_at")
  updatedAt     DateTime       @updatedAt @map("updated_at")
  role          Role           @relation(fields: [roleId], references: [id])
  loans         Loan[]
  favoriteBooks FavoriteBook[]

  @@index([roleId])
  @@map("users")
}
```

## 📜 Main Prisma CLI scripts

### prisma init
Creates a Prisma directory in the current directory and generates a basic `schema.prisma` file. It does not interpret any existing files.

```bash
npx prisma init
```


### prisma migrate dev
Handles database migrations in development environments.

```bash
npx prisma migrate dev [--create-only] [--skip-seed] [--skip-generate] [--name <nombre>]
```

- `--create-only`: Creates a new migration based on schema changes but does not apply it automatically.
- `--skip-seed`: Skips running seed scripts after applying migrations.
- `--skip-generate`: Skips generating artifacts (like Prisma Client) after applying migrations.
- `--name <nombre>`: Name of the migration.

### prisma migrate deploy
This command applies all pending migrations and creates the database if it does not exist, primarily in non-development environments.

```bash
npx prisma migrate deploy
```

### prisma migrate status
Shows the current status of migrations in the database.

```bash
npx prisma migrate status
```

### prisma db seed 
Executes the data seeding scripts defined in your project to populate the database with initial data

```bash
npx prisma db-seed
```
### prisma generate
Most often used to generate Prisma Client with the prisma-client-js generator. 

> **Note:** Database changes in Prisma schema, require manual Prisma Client regeneration.

```bash
npx prisma generate
```

