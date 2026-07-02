<#
    Scaffolds an Express + TypeScript backend API in the current directory,
    including a Dockerfile and .dockerignore, then installs dependencies.
#>

New-Item -ItemType Directory -Force -Path "src" | Out-Null

@'
{
  "name": "demo-express-api",
  "version": "1.0.0",
  "description": "Express API written in TypeScript",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.9",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.3"
  }
}
'@ | Set-Content -Path "package.json" -Encoding utf8

@'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
'@ | Set-Content -Path "tsconfig.json" -Encoding utf8

@'
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from the Express + TypeScript API' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
'@ | Set-Content -Path "src/index.ts" -Encoding utf8

@'
# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- Production stage ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
'@ | Set-Content -Path "Dockerfile" -Encoding utf8

@'
node_modules
dist
npm-debug.log
.git
.gitignore
.dockerignore
Dockerfile
*.md
.vscode
.env
'@ | Set-Content -Path ".dockerignore" -Encoding utf8

@'
node_modules
dist
.env
'@ | Set-Content -Path ".gitignore" -Encoding utf8

Write-Host "Installing dependencies..."
npm install

Write-Host "Scaffold complete."
