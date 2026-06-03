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