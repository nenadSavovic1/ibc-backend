# Node + Express + Prisma (SQLite) API

A tiny, batteries-included backend with:

- **Express** REST API  
- **Prisma** ORM + **SQLite** (no external DB)  
- Endpoints for **/health**, **/notes** (CRUD), and **/users** (CRUD)

---

## Tech Stack

- Node.js (v20+ recommended)  
- Express  
- Prisma ORM  
- SQLite (file: `dev.db`)  

---

## Prerequisites

- **Node.js** v20+ and **npm**  
- (Optional) **curl** or **Postman** for testing

Check versions:

```bash
node -v
npm -v
```

---

## 1) Clone & Install

```bash
# 1) Clone this repository
git clone <YOUR_REPO_URL> api
cd api

# 2) Install dependencies
npm install

# 3) Create .env
cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
PORT=3001
EOF

# 4) Initialize DB & generate Prisma client
npx prisma migrate dev --name init
# (Optional GUI to browse data)
# npx prisma studio
```

> If this repo already contains migrations, the command above will apply them and create `dev.db`.

---

## 2) Run

```bash
# Dev with auto-reload
npm run dev

# or production style
npm run start
```

Server prints:

```
API running at http://localhost:3001
```

---

## 3) Project Structure

```
.
├─ index.js                 # Express app (routes)
├─ prisma/
│  └─ schema.prisma         # Prisma models (Note, User)
├─ dev.db                   # SQLite DB (auto-created)
├─ .env                     # DATABASE_URL + PORT
└─ package.json             # scripts
```

---

## 4) NPM Scripts

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "migrate": "prisma migrate dev",
    "studio": "prisma studio"
  }
}
```

- `npm run dev` – start with hot reload  
- `npm run start` – start without nodemon  
- `npm run migrate` – apply schema changes during dev  
- `npm run studio` – open Prisma Studio DB browser

---

## 5) Database Schema

Models are defined in [`prisma/schema.prisma`](prisma/schema.prisma). Example basic models used here:

```prisma
model Note {
  id        Int      @id @default(autoincrement())
  text      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Apply changes after editing the schema:

```bash
npx prisma migrate dev --name <change_name>
```

---

## 6) API Endpoints

### Health

```bash
curl http://localhost:3001/health
# => {"ok":true}
```

### Notes

- **List**
  ```bash
  curl http://localhost:3001/notes
  ```
- **Create**
  ```bash
  curl -X POST http://localhost:3001/notes     -H "Content-Type: application/json"     -d '{"text":"hello world"}'
  ```
- **Update**
  ```bash
  curl -X PUT http://localhost:3001/notes/1     -H "Content-Type: application/json"     -d '{"text":"updated text"}'
  ```
- **Delete**
  ```bash
  curl -X DELETE http://localhost:3001/notes/1
  ```

### Users

> Basic table with `id`, `email` (unique), `name`, timestamps.

- **List**
  ```bash
  curl http://localhost:3001/users
  ```
- **Get by ID**
  ```bash
  curl http://localhost:3001/users/1
  ```
- **Create**
  ```bash
  curl -X POST http://localhost:3001/users     -H "Content-Type: application/json"     -d '{"email":"test@example.com","name":"Test User"}'
  ```
- **Update**
  ```bash
  curl -X PUT http://localhost:3001/users/1     -H "Content-Type: application/json"     -d '{"name":"Updated Name"}'
  ```
- **Delete**
  ```bash
  curl -X DELETE http://localhost:3001/users/1
  ```

---

## 7) Editing the Schema (adding fields/tables)

1) Open `prisma/schema.prisma` and edit models.  
2) Apply changes and generate a new client:

```bash
npx prisma migrate dev --name <change_name>
```

3) Restart server if needed.

---

## 8) Testing (quick smoke)

```bash
# Health
curl -s http://localhost:3001/health

# Create user
curl -s -X POST http://localhost:3001/users   -H "Content-Type: application/json"   -d '{"email":"smoke@test.dev","name":"Smoke"}'

# Create note
curl -s -X POST http://localhost:3001/notes   -H "Content-Type: application/json"   -d '{"text":"smoke note"}'

# List all
curl -s http://localhost:3001/users
curl -s http://localhost:3001/notes
```

*(Optional) Install `jq` for pretty JSON on macOS: `brew install jq`*

---

## 9) Troubleshooting

**“@prisma/client did not initialize yet. Please run ‘prisma generate’ …”**

```bash
npm install
npx prisma generate
# If still failing:
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

**No DB file / migration failed**

- Ensure `.env` has `DATABASE_URL="file:./dev.db"`  
- Re-run `npx prisma migrate dev --name init`

**Port already in use**

- Change `PORT` in `.env` (e.g., `PORT=4000`) and restart.

**Custom client output**

- Use the default client location unless you change your import path. Recommended:
  ```prisma
  generator client { provider = "prisma-client-js" }
  ```

---

## 10) Next Steps

- Add validation (e.g., **Zod**)  
- Add auth (JWT or session)  
- Swap SQLite → Postgres (change datasource + DSN, then migrate)  
- Containerize with Docker when ready

---

## License

MIT (or your choice).
