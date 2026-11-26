Quick, high-signal guidance for automated agents working on this repo.
Purpose
- Prevent obvious mistakes and save time: exact start commands, env behaviour, DB setup, and tool quirks.
Where to run
- The runnable project is in web-data-viz/ (entrypoint: web-data-viz/app.js). Run commands from that directory.
Start / dev commands (exact)
- Install deps: cd web-data-viz && npm install
- Start with Tailwind watching (recommended for local dev): npm run start
- This uses concurrently to run node app.js and the Tailwind CLI watcher.
- Run with automatic restarts only (nodemon, no Tailwind watch): npm run dev
Environment selection (important, non-obvious)
- The app decides which .env file to load based on a hard-coded variable at the top of app.js:
- app.js contains a line: var ambiente_processo = 'desenvolvimento'
- If set to 'desenvolvimento' the code loads web-data-viz/.env.dev; if 'producao' it loads web-data-viz/.env
- To switch environments change that literal in app.js (comment/uncomment the appropriate line as the file itself instructs).
- Note: config.js reads process.env.AMBIENTE_PROCESSO and expects exactly "desenvolvimento" or "producao"; if that value is missing or different the DB helper will reject.
- The .env and .env.dev files already contain AMBIENTE_PROCESSO and DB/APP settings. If your DB password contains special characters keep the quotes as in the provided files.
Database
- The project connects to MySQL using credentials from the chosen .env file (see src/database/config.js).
- Schema / table creation script: web-data-viz/src/database/script-tabelas.sql — run this on the target MySQL server before using the app.
- Typical quick local setup (example):
- Create a database matching DB_DATABASE and a user matching DB_USER/DB_PASSWORD in .env.dev, then import the SQL file.
Tailwind / CSS
- The start script runs @tailwindcss/cli to watch and compile public/css/style.css -> public/css/output.css. If you edit Tailwind sources, run npm run start (not npm run dev) to keep the watcher running.
Docker
- There is a Dockerfile at web-data-viz/Dockerfile. It uses node:22 and exposes port 3333. The container runs npm start.
- If you run the image, ensure the container environment and port match the .env (or modify app.js to load the desired .env file).
Runtime notes / gotchas
- Entrypoint: web-data-viz/app.js — static files are served from web-data-viz/public
- If you change the environment, confirm process.env.AMBIENTE_PROCESSO matches one of the accepted values ("desenvolvimento" or "producao"). The DB wrapper enforces that.
- start runs two processes (node + tailwind) using concurrently; logs will be interleaved.
- dev uses nodemon but does NOT start Tailwind watch; CSS changes won't be rebuilt unless you run the Tailwind CLI separately.
- Node version: Dockerfile targets Node 22 — use a similar major version locally to avoid runtime differences.
Where to look for more context
- Main app: web-data-viz/app.js
- DB helper and connection: web-data-viz/src/database/config.js
- SQL schema: web-data-viz/src/database/script-tabelas.sql
- Scripts & dependencies: web-data-viz/package.json
If you need to change behaviour
- Prefer small edits: switch the ambiente_processo literal in app.js or make dotenv load a specific file via an environment variable wrapper. Keep changes minimal and document them here.
Database schema (used by the application)

