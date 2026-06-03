"""
FastAPI JWT Authentication Backend
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import hashlib
import hmac

# Secret key for encoding/decoding JWT tokens
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 300  # 5 minutes

# OAuth2 password bearer scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(
    title="JWT Authentication API",
    description="A FastAPI application implementing JWT authentication",
    version="0.1.0"
)

# Models
class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str
    expires_in: int


class TokenData(BaseModel):
    """Token data model"""
    username: Optional[str] = None


class User(BaseModel):
    """User model"""
    username: str


# Users database (in-memory for this example)
# In production, this would be in a real database
USERS_DB = {
    "admin": {
        "username": "admin",
        "password": "admin123",
        "disabled": False,
    }
}


def verify_password(plain_password: str, stored_password: str) -> bool:
    """Verify a password (simple comparison for this example)"""
    # In production, use proper password hashing like bcrypt
    return hmac.compare_digest(plain_password, stored_password)


def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Authenticate user credentials"""
    user = USERS_DB.get(username)
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = USERS_DB.get(token_data.username)
    if user is None:
        raise credentials_exception
    
    return User(username=user["username"])


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "JWT Authentication API",
        "version": "0.1.0",
        "endpoints": {
            "login": "/token",
            "refresh": "/refresh",
            "me": "/users/me"
        }
    }


@app.post("/token", response_model=Token, tags=["Authentication"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    """
    Login endpoint that accepts username and password and returns a JWT token.
    
    Credentials:
    - username: admin
    - password: admin123
    
    Token expires in 300 seconds (5 minutes).
    """
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS
    )


@app.post("/refresh", response_model=Token, tags=["Authentication"])
async def refresh_token(current_user: User = Depends(get_current_user)) -> Token:
    """
    Refresh token endpoint that accepts a valid JWT token and returns a new one.
    
    The new token will have the same 300 second expiration.
    """
    access_token_expires = timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS
    )


@app.get("/users/me", response_model=User, tags=["Users"])
async def read_users_me(current_user: User = Depends(get_current_user)) -> User:
    """Get current authenticated user information"""
    return current_user


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


