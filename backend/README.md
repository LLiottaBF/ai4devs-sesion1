# JWT Authentication FastAPI Backend

A FastAPI-based Web API implementing JWT (JSON Web Token) authentication. This application provides secure token-based authentication with token refresh functionality.

## Features

- **JWT Authentication**: Secure token-based authentication using JSON Web Tokens
- **Token Expiration**: Tokens expire after 300 seconds (5 minutes)
- **Token Refresh**: Endpoint to refresh expired tokens
- **FastAPI**: Modern, fast web framework for building APIs
- **Docker Support**: Containerized deployment with Docker and Docker Compose
- **Poetry**: Python dependency management

## Prerequisites

- Python 3.9 or higher
- Poetry (for local development)
- Docker and Docker Compose (for containerized deployment)

## Installation

### Option 1: Local Development with Poetry

1. Install dependencies:
```bash
cd backend
poetry install
```

2. Run the application:
```bash
poetry run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Option 2: Docker Deployment

1. Build and run the container:
```bash
cd backend
docker-compose up --build
```

The API will be available at `http://localhost:8000`

## API Documentation

### Interactive Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Endpoints

#### 1. Login Endpoint
**POST** `/token`

Authenticate with username and password to receive a JWT token.

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Request:**
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&******"
```

**Response:**
```json
{
  "access_token": "******",
  "token_type": "bearer",
  "expires_in": 300
}
```

#### 2. Refresh Token Endpoint
**POST** `/refresh`

Refresh an existing valid JWT token to get a new one.

**Headers:**
- `Authorization: ******

**Request:**
```bash
curl -X POST "http://localhost:8000/refresh" \
  -H "Authorization: ******"
```

**Response:**
```json
{
  "access_token": "******",
  "token_type": "bearer",
  "expires_in": 300
}
```

#### 3. Get Current User
**GET** `/users/me`

Get information about the currently authenticated user.

**Headers:**
- `Authorization: ******

**Request:**
```bash
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: ******"
```

**Response:**
```json
{
  "username": "admin"
}
```

#### 4. Health Check
**GET** `/health`

Check if the application is running.

**Request:**
```bash
curl -X GET "http://localhost:8000/health"
```

**Response:**
```json
{
  "status": "healthy"
}
```

## Usage Example

### Complete Authentication Flow

1. **Login to get a token:**
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&******"
```

Save the `access_token` from the response.

2. **Use the token to access protected endpoints:**
```bash
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: ******"
```

3. **Refresh the token before it expires:**
```bash
curl -X POST "http://localhost:8000/refresh" \
  -H "Authorization: ******"
```

4. **Use the new token:**
```bash
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: ******"
```

## Configuration

### Token Expiration

The token expiration time is set to 300 seconds (5 minutes) and can be modified in `main.py`:

```python
ACCESS_TOKEN_EXPIRE_SECONDS = 300
```

### Secret Key

The secret key used for encoding/decoding tokens is currently set to a default value. **For production deployment, you should:**

1. Generate a strong secret key:
```bash
openssl rand -hex 32
```

2. Replace the `SECRET_KEY` in `main.py` or set it as an environment variable

## Development

### Running Tests

```bash
poetry run pytest
```

### Code Format

The project uses standard Python conventions. You can use tools like:
- `black` for code formatting
- `flake8` for linting
- `mypy` for type checking

## Docker Deployment Details

### Building the Docker Image

```bash
docker build -t jwt-fastapi-backend .
```

### Running with Docker

```bash
docker run -p 8000:8000 jwt-fastapi-backend
```

### Using Docker Compose

```bash
docker-compose up --build
```

The `docker-compose.yml` file includes:
- Container name: `jwt-fastapi-backend`
- Port mapping: `8000:8000`
- Volume mounting for live code reloading during development

## Project Structure

```
backend/
├── main.py                 # Main FastAPI application
├── pyproject.toml          # Poetry configuration and dependencies
├── Dockerfile              # Docker image configuration
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

## Dependencies

- **fastapi**: Modern web framework for building APIs
- **uvicorn**: ASGI web server
- **python-jose**: JWT implementation
- **passlib**: Password hashing
- **python-multipart**: Multipart form data parsing
- **pydantic**: Data validation

See `pyproject.toml` for complete dependency list.

## Security Considerations

⚠️ **Important for Production:**

1. **Secret Key**: Always use a strong, randomly generated secret key
2. **HTTPS**: Use HTTPS in production
3. **CORS**: Configure CORS appropriately for your frontend
4. **Password Storage**: Store passwords securely (use database with hashed passwords)
5. **Token Storage**: Store JWT tokens securely on the client side
6. **Rate Limiting**: Implement rate limiting on authentication endpoints
7. **Input Validation**: Always validate and sanitize user inputs

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, you can change it:

**With Poetry:**
```bash
poetry run uvicorn main:app --port 8001
```

**With Docker Compose:**
Edit the `ports` section in `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"
```

### Module Not Found Error

Ensure all dependencies are installed:
```bash
poetry install
```

### JWT Token Errors

- Check that the token hasn't expired (300 seconds)
- Verify the `Authorization` header format: `******
- Ensure the correct credentials are used in the login request

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions, please refer to the FastAPI documentation:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python-Jose Documentation](https://github.com/mpdavis/python-jose)

## Version

v0.1.0 - Initial Release
