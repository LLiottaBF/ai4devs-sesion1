"""
Tests for JWT authentication endpoints
"""
import pytest
from fastapi.testclient import TestClient
from main import app, ACCESS_TOKEN_EXPIRE_SECONDS

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_login_success():
    """Test successful login"""
    response = client.post(
        "/token",
        data={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == ACCESS_TOKEN_EXPIRE_SECONDS


def test_login_invalid_username():
    """Test login with invalid username"""
    response = client.post(
        "/token",
        data={"username": "invalid", "password": "admin123"}
    )
    assert response.status_code == 401


def test_login_invalid_password():
    """Test login with invalid password"""
    response = client.post(
        "/token",
        data={"username": "admin", "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_get_current_user_success():
    """Test getting current user with valid token"""
    # First, login
    login_response = client.post(
        "/token",
        data={"username": "admin", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Then, get current user
    response = client.get(
        "/users/me",
        headers={"Authorization": f"bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "admin"


def test_get_current_user_without_token():
    """Test getting current user without token"""
    response = client.get("/users/me")
    assert response.status_code in [401, 403]


def test_get_current_user_invalid_token():
    """Test getting current user with invalid token"""
    response = client.get(
        "/users/me",
        headers={"Authorization": "bearer invalid_token"}
    )
    assert response.status_code == 401


def test_refresh_token_success():
    """Test refreshing token"""
    # First, login
    login_response = client.post(
        "/token",
        data={"username": "admin", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Then, refresh token
    response = client.post(
        "/refresh",
        headers={"Authorization": f"bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == ACCESS_TOKEN_EXPIRE_SECONDS


def test_refresh_token_without_token():
    """Test refreshing token without providing token"""
    response = client.post("/refresh")
    assert response.status_code in [401, 403]


def test_refresh_token_invalid_token():
    """Test refreshing token with invalid token"""
    response = client.post(
        "/refresh",
        headers={"Authorization": "bearer invalid_token"}
    )
    assert response.status_code == 401
