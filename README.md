Express API written in TypeScript, backed by PostgreSQL.

## Requirements

- Node.js 20+
- npm
- PostgreSQL (or Docker, to run one via Compose)

## Configuration

Configuration is read from environment variables. Copy `.env.example` to `.env` and adjust as needed:

```sh
cp .env.example .env
```

| Variable      | Description                          | Default              |
| ------------- | ------------------------------------- | --------------------- |
| `PORT`        | Port the API listens on               | `3000`                |
| `DB_HOST`     | Postgres host                         | *(required)*          |
| `DB_PORT`     | Postgres port                         | `5432`                |
| `DB_USER`     | Postgres user                         | *(required)*          |
| `DB_PASSWORD` | Postgres password                     | *(required)*          |
| `DB_NAME`     | Postgres database name                | *(required)*          |

`.env` is gitignored — never commit real credentials.

## Getting started

Install dependencies:

```sh
npm install
```

Start a local Postgres instance (or point `.env` at your own):

```sh
docker compose up -d db
```

Run in development mode (auto-restarts on change):

```sh
npm run dev
```

Build and run the compiled output:

```sh
npm run build
npm start
```

The `users` table is created automatically on startup if it doesn't exist.

## Endpoints

- `GET /` — hello message
- `GET /health` — health check
- `GET /users` — list users
- `GET /users/:id` — get a user
- `POST /users` — create a user (`{ "name": string, "email": string }`)
- `PUT /users/:id` — update a user
- `DELETE /users/:id` — delete a user

## Docker

Run the full stack (API + Postgres):

```sh
docker compose up -d --build
```

This starts Postgres and the API, connecting them over the Compose network.
