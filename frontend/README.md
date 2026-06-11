# Frontend — Compliance Platform

A React single-page application that provides a secure login flow and a protected welcome dashboard. It consumes the JWT authentication backend located in the `../backend` directory.

---

## Features

- **Login page** — sends credentials to the backend `POST /token` endpoint and stores the returned JWT in `sessionStorage`.
- **Protected welcome page** — only accessible when authenticated; loads the current user profile from `GET /users/me`.
- **Session persistence** — the token survives page refreshes within the same browser tab; closing the tab or window clears it automatically.
- **Auto logout** — if the backend returns `401`, the user is redirected back to the login page.
- **Design system** — styled according to the [DESIGN.md](../DESIGN.md) specification: Inter font, glass surfaces, gradient-border card shells, and a WebGL ambient background.

---

## Tech stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vitejs.dev) | Build tool & dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| WebGL (custom shader) | Ambient background effect |

---

## Prerequisites

- **Node.js** ≥ 18
- The backend running at `http://localhost:8000` (or override via `VITE_API_URL`)

---

## Getting started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure the API URL (optional)

Copy the example environment file and edit it if your backend runs on a different host or port:

```bash
cp .env.example .env
# Edit VITE_API_URL if needed
```

By default `VITE_API_URL` is `http://localhost:8000`.

### 3. Start the backend

From the project root:

```bash
cd backend
poetry install
poetry run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 4. Start the dev server

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

### Logging in

1. Navigate to `http://localhost:5173` — you are automatically redirected to `/login`.
2. Enter your credentials (default: **admin** / **admin123**).
3. Click **Sign in**.

On success the JWT token is saved in `sessionStorage` and you are redirected to the welcome dashboard at `/welcome`.

### Welcome dashboard

The dashboard displays:
- Your authenticated username (fetched live from the API).
- Session status, authentication method, and token expiry information.
- A **Sign out** button in the top navigation bar.

### Signing out

Click **Sign out** in the navbar. The session token is cleared and you are redirected back to the login page. Attempting to navigate directly to `/welcome` without a token redirects you to `/login`.

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Compile the production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## Project structure

```
frontend/
├── public/             Static assets
├── src/
│   ├── context/
│   │   └── AuthContext.jsx     JWT auth state & sessionStorage logic
│   ├── components/
│   │   ├── ProtectedRoute.jsx  Redirects unauthenticated users to /login
│   │   └── WebGLBackground.jsx Ambient shader background with pointer drift
│   ├── pages/
│   │   ├── LoginPage.jsx       Login form page
│   │   └── WelcomePage.jsx     Protected dashboard page
│   ├── App.jsx                 Routes definition
│   ├── main.jsx                React entry point
│   └── index.css               Global styles & design-token CSS variables
├── .env.example        Example environment variables
├── index.html          HTML shell with Inter font link
├── vite.config.js      Vite configuration
└── package.json
```

---

## Backend API reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/token` | Login — returns `{ access_token, token_type, expires_in }` |
| `GET` | `/users/me` | Returns `{ username }` for the authenticated user |
| `POST` | `/refresh` | Returns a fresh token for the current user |
| `GET` | `/health` | Health check |

The login request body must use `application/x-www-form-urlencoded` with `username` and `password` fields (standard OAuth2 password form).
