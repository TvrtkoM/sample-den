# Sample den

Web shop for selling digital audio files. Sanity Studio (separate repo) is the CMS; this app reads it via GROQ queries.

---

## Environment variables / .env files

All environment variables are available in `.env.example` and this is only environment file that can be read by LLMs, all other `.env` files like `.env` or `.env.*` are forbidden to both read and write operations in any way!

## Technology stack

### Backend

- **Next.js** route handlers for API layer.
- **PostgreSQL** database.
- **Prisma** ORM for database access.
- **better-auth** for authentication.
- **Sanity** as headless CMS, accessed via GROQ queries (studio lives in a separate repository).

### Frontend

- **Next.js** fullstack framework.
- **Tanstack react-query** for client-side fetching.
- **Shadcn with RadixUI** for implementing user interface.
- **Tailwind** for UI styling.
- **Jotai** for state management.
- **Lucide react** icon library.

## Project structure

- **app**: Next.js pages and route handlers. Ideally only high-level structure and data fetching logic for SSR go here.
- **components**: React components. UI primitives (shadcn) go in **components/ui**. Feature folders: `auth/`, `cart/`, `samples/`.
- **lib**: Utilities, types, data transformation, entities used across the app, state management (`store/`), data fetchers (`fetch/`), search-param helpers. Only _.ts_ files; exported entities should be commented with _tsdoc_.
- **hooks**: Custom React hooks (e.g. `use-session`, `use-cart`).
- **context**: React context providers (e.g. `SessionContext`).
- **groq**: GROQ query definitions for the Sanity API.
- **generated**: Generated code — Prisma client output and Sanity GROQ result types. Do not edit by hand.
- **prisma**: Prisma schema and migrations.

## Development

### Docker compose

- **docker-compose.yml** file containing configuration to run a **PostgreSQL** database (port 5432) and **pgAdmin** (port 5050, web UI for inspecting the database) as docker containers locally for development purposes.

### Coding

- **strict _typescript_**: _unknown_ should be preferred to _any_, but generally everything should be typed.
- **SOLID principles**: where possible, write reusable and maintainable code according to SOLID principles.
- **icons**: use icons from lucide-react library, avoid inline svg.
- **formatting**: use formatting utility functions located in `lib/utils.ts` file.
- **Hooks**: Don't reinvent what's already available in `@mantine/hooks` library.
- **lodash**: Use `lodash` package. Don't reinvent what's already there.
- **tsdoc**: Upon editing an entity that is documented with _tsdoc_, update its documentation. Invoke the `tsdoc` skill when writing or updating tsdoc comments.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
