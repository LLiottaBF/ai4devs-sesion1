# ai4devs-sesion1

## Projects

### Backend - JWT Authentication API

A FastAPI-based Web API implementing JWT (JSON Web Token) authentication with token refresh functionality.

**Location:** `/backend`

**Features:**
- JWT authentication with 300-second token expiration
- Token refresh endpoint
- User authentication with default credentials (admin/admin123)
- Docker and Docker Compose support
- Comprehensive API documentation (Swagger UI)

**Quick Start:**

```bash
cd backend
poetry install
poetry run uvicorn main:app --reload
```

**Docker Deployment:**

```bash
cd backend
docker-compose up --build
```

API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

For detailed information, see [backend/README.md](./backend/README.md)

---

### Frontend — Compliance Platform

A React single-page application with a login page and a protected welcome dashboard, styled according to the [DESIGN.md](./DESIGN.md) specification.

**Location:** `/frontend`

**Features:**
- Login form that authenticates against the backend `POST /token` endpoint
- JWT token stored in `sessionStorage` (cleared when the tab is closed)
- Protected welcome dashboard — inaccessible without a valid session
- Auto-redirect to login if the token expires or is invalid
- Glass-surface UI with WebGL ambient background (Inter font, design tokens from DESIGN.md)

**Quick Start:**

```bash
# 1. Start the backend first (see above)

# 2. Install and run the frontend
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`

**Default credentials:** `admin` / `admin123`

For detailed information, see [frontend/README.md](./frontend/README.md)