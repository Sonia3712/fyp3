# main.py - LivestockSync Admin Backend with Firebase Integration & Real-time Dashboard

from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from jose import jwt, JWTError
import uuid
import re
import uvicorn
import firebase_admin
from firebase_admin import credentials, firestore
import os
from pathlib import Path
import asyncio
import json
import random

# =============================
# FIREBASE CONFIGURATION
# =============================

db = None
firebase_initialized = False

try:
    # Check multiple possible locations for the key file
    current_dir = Path(__file__).parent.absolute()
    possible_paths = [
        current_dir / "serviceAccountKey.json",
        current_dir / "firebase-key.json",
        Path.cwd() / "serviceAccountKey.json",
        Path.cwd() / "firebase-key.json",
    ]
    
    key_file_path = None
    for path in possible_paths:
        if path.exists():
            key_file_path = str(path)
            print(f"✅ Found Firebase key at: {key_file_path}")
            break
    
    if not key_file_path:
        print("❌ ERROR: No Firebase service account key found!")
        print("   Please download serviceAccountKey.json from Firebase Console")
        print("   and place it in the same folder as main.py")
        firebase_initialized = False
    else:
        # Initialize Firebase
        if not firebase_admin._apps:
            cred = credentials.Certificate(key_file_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase initialized successfully!")
        
        db = firestore.client()
        firebase_initialized = True
        print("✅ Firestore client connected")
        
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    print("   Running in development mode...")
    firebase_initialized = False
    db = None

# =============================
# APPLICATION CONFIGURATION
# =============================

SECRET_KEY = "livestock-sync-secret-key-2025-secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
MAX_ADMINS = 1

app = FastAPI(
    title="LivestockSync Admin API", 
    version="5.0.0",
    description="Complete Admin Dashboard Backend with Firebase Integration"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# =============================
# TEMPORARY OTP STORAGE
# =============================

otp_storage = {}  # {email: {"otp": "123456", "created_at": datetime, "user_id": "..."}}

def generate_otp():
    """Generate 6-digit OTP"""
    return str(random.randint(100000, 999999))

async def send_otp_to_email(email: str, otp: str):
    """Simulate sending OTP to email"""
    # Production mein yahan actual email sending code hoga
    print(f"📧 OTP sent to {email}: {otp}")
    return True

# =============================
# IMPROVED WEBSOCKET MANAGER
# =============================

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"✅ WebSocket connected. Total connections: {len(self.active_connections)}")
        # Send initial data immediately
        await self.send_initial_data(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"❌ WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_initial_data(self, websocket: WebSocket):
        """Send initial dashboard data to new connection"""
        try:
            stats = await get_dashboard_stats()
            recent_activities = await get_recent_activities(10)
            
            initial_data = {
                "type": "initial_data",
                "data": {
                    "stats": stats,
                    "recent_activities": recent_activities,
                    "timestamp": datetime.now().isoformat(),
                    "connection_id": id(websocket)
                }
            }
            await websocket.send_json(initial_data)
            print(f"📊 Initial data sent to client")
        except Exception as e:
            print(f"❌ Error sending initial data: {e}")

    async def broadcast_activity(self, activity_data: dict):
        """Broadcast activity to all connected clients"""
        dead_connections = []
        
        # Format activity for frontend
        notification_data = {
            "type": "activity",
            "data": {
                **activity_data,
                "timestamp": datetime.now().isoformat() if "timestamp" not in activity_data else activity_data["timestamp"]
            }
        }
        
        for connection in self.active_connections:
            try:
                await connection.send_json(notification_data)
                print(f"📢 Activity broadcasted to client: {activity_data.get('type')}")
            except Exception as e:
                print(f"❌ Error broadcasting to client: {e}")
                dead_connections.append(connection)
        
        # Remove dead connections
        for conn in dead_connections:
            self.disconnect(conn)

manager = ConnectionManager()

# =============================
# ENUMS & MODELS
# =============================

class UserRole(str, Enum):
    Hospital = "hospital"
    VETERINARIAN = "veterinarian"
    SLAUGHTERHOUSE = "slaughterhouse"
    ADMIN = "admin"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class ActivityType(str, Enum):
    USER_REGISTERED = "user_registered"
    USER_LOGIN = "user_login"
    HOSPITAL_ADDED = "hospital_added"
    HOSPITAL_UPDATED = "hospital_updated"
    HOSPITAL_DELETED = "hospital_deleted"
    SLAUGHTERHOUSE_ADDED = "slaughterhouse_added"
    SLAUGHTERHOUSE_UPDATED = "slaughterhouse_updated"
    SLAUGHTERHOUSE_DELETED = "slaughterhouse_deleted"
    FEEDBACK_SUBMITTED = "feedback_submitted"
    USER_UPDATED = "user_updated"
    USER_DELETED = "user_deleted"
    SETTINGS_UPDATED = "settings_updated"
    TWO_FACTOR_ENABLED = "two_factor_enabled"
    TWO_FACTOR_DISABLED = "two_factor_disabled"
    PASSWORD_RESET = "password_reset"

# =============================
# THEME SETTINGS MODELS
# =============================

class ThemeSettings(BaseModel):
    theme: str = Field(default="light", description="Theme: light, dark, or auto")
    language: str = Field(default="english", description="Language preference")
    notifications: bool = Field(default=True, description="Enable push notifications")
    sounds: bool = Field(default=True, description="Enable sound effects")
    auto_save: bool = Field(default=True, description="Enable auto save")
    two_factor_auth: bool = Field(default=False, description="Enable two-factor authentication")

class UserSettingsRequest(BaseModel):
    user_id: str
    settings: ThemeSettings

class TwoFactorAuthRequest(BaseModel):
    user_id: str
    enabled: bool
    verification_code: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: UserRole
    business_name: Optional[str] = None
    address: Optional[str] = None

# =============================
# PASSWORD RESET MODELS
# =============================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# =============================
# FLEXIBLE MODELS FOR FRONTEND COMPATIBILITY
# =============================

class FlexibleHospitalRequest(BaseModel):
    name: str
    address: Optional[str] = None
    contact: Optional[str] = None
    phone: Optional[str] = None  # Add this for frontend compatibility
    email: Optional[str] = None
    services: Optional[Union[List[str], str]] = None
    doctors: Optional[int] = None
    status: Optional[str] = "Active"
    operating_hours: Optional[str] = None
    hours: Optional[str] = None
    
    @validator('services', pre=True)
    def convert_services(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            # Convert comma-separated string to list
            return [s.strip() for s in v.split(',') if s.strip()]
        return v

class FlexibleSlaughterhouseRequest(BaseModel):
    name: str
    address: Optional[str] = None
    contact: Optional[str] = None
    phone: Optional[str] = None  # Add this for frontend compatibility
    email: Optional[str] = None
    capacity: Optional[str] = None
    status: Optional[str] = "Active"
    operating_hours: Optional[str] = None
    hours: Optional[str] = None
    certification: Optional[str] = None

class FeedbackRequest(BaseModel):
    user_id: str
    user_name: str
    target_type: str
    target_id: str
    target_name: str
    rating: int
    comment: str

# =============================
# HELPER FUNCTIONS
# =============================

def validate_email_format(email: str) -> bool:
    """Validate email format"""
    email = email.strip().lower()
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def verify_admin(token_data: dict = Depends(verify_token)):
    if token_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return token_data

async def log_activity(activity_type: ActivityType, user_id: str, user_name: str, 
                       details: Dict[str, Any] = None):
    """Log activity to Firestore and broadcast via WebSocket"""
    
    if not firebase_initialized or not db:
        print(f"⚠️ Activity logged (Firebase not initialized): {activity_type.value}")
        return None
    
    activity_id = str(uuid.uuid4())
    current_time = datetime.now()
    
    activity_data = {
        "id": activity_id,
        "type": activity_type.value,
        "user_id": user_id,
        "user_name": user_name,
        "details": details or {},
        "timestamp": current_time,
        "created_at": current_time
    }
    
    try:
        # Store in Firestore
        db.collection("activities").document(activity_id).set(activity_data)
        print(f"✅ Activity logged: {activity_type.value} by {user_name}")
        
        # Format for WebSocket broadcast
        broadcast_data = {
            "id": activity_id,
            "type": activity_type.value,
            "user_id": user_id,
            "user_name": user_name,
            "details": details or {},
            "timestamp": current_time.isoformat(),
            "created_at": current_time.isoformat()
        }
        
        # Broadcast to all connected clients
        await manager.broadcast_activity(broadcast_data)
        
    except Exception as e:
        print(f"❌ Error logging activity: {e}")
    
    return activity_data

# =============================
# FIREBASE DATABASE FUNCTIONS
# =============================

async def get_user_by_email(email: str):
    """Get user from Firestore by email"""
    if not firebase_initialized or not db:
        return None
    
    try:
        users_ref = db.collection("users")
        query = users_ref.where("email", "==", email.lower()).limit(1)
        docs = query.stream()
        
        for doc in docs:
            user_data = doc.to_dict()
            user_data["id"] = doc.id
            return user_data
    except Exception as e:
        print(f"❌ Error fetching user: {e}")
    
    return None

async def create_user_in_firestore(user_data: dict):
    """Create user in Firestore"""
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized. Please configure Firebase.")
    
    try:
        # Store password as plain text for now
        password = user_data.get("password")
        
        # Create user document
        user_id = str(uuid.uuid4())
        
        # Prepare user document
        user_doc = {
            "id": user_id,
            "email": user_data["email"].lower(),
            "password": password,
            "full_name": user_data["full_name"],
            "phone": user_data.get("phone"),
            "role": user_data.get("role", "farmer"),
            "business_name": user_data.get("business_name"),
            "address": user_data.get("address"),
            "created_at": datetime.now(),
            "last_login": None,
            "status": "active"
        }
        
        # Save to Firestore
        db.collection("users").document(user_id).set(user_doc)
        
        print(f"✅ User created in Firestore: {user_data['email']}")
        return user_doc
        
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

async def get_all_users():
    """Get all users from Firestore"""
    if not firebase_initialized or not db:
        return []
    
    try:
        users_ref = db.collection("users")
        docs = users_ref.stream()
        
        users = []
        for doc in docs:
            user_data = doc.to_dict()
            user_data["id"] = doc.id
            # Convert datetime to string
            if "created_at" in user_data and user_data["created_at"]:
                if isinstance(user_data["created_at"], datetime):
                    user_data["created_at"] = user_data["created_at"].isoformat()
            if "last_login" in user_data and user_data["last_login"]:
                if isinstance(user_data["last_login"], datetime):
                    user_data["last_login"] = user_data["last_login"].isoformat()
            users.append(user_data)
        
        return users
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        return []

async def get_all_hospitals():
    """Get all hospitals from Firestore"""
    if not firebase_initialized or not db:
        return []
    
    try:
        hospitals_ref = db.collection("hospitals")
        docs = hospitals_ref.stream()
        
        hospitals = []
        for doc in docs:
            hospital_data = doc.to_dict()
            hospital_data["id"] = doc.id
            if "created_at" in hospital_data and hospital_data["created_at"]:
                if isinstance(hospital_data["created_at"], datetime):
                    hospital_data["created_at"] = hospital_data["created_at"].isoformat()
            hospitals.append(hospital_data)
        
        return hospitals
    except Exception as e:
        print(f"❌ Error fetching hospitals: {e}")
        return []

async def get_all_slaughterhouses():
    """Get all slaughterhouses from Firestore"""
    if not firebase_initialized or not db:
        return []
    
    try:
        slaughterhouses_ref = db.collection("slaughterhouses")
        docs = slaughterhouses_ref.stream()
        
        slaughterhouses = []
        for doc in docs:
            slaughterhouse_data = doc.to_dict()
            slaughterhouse_data["id"] = doc.id
            if "created_at" in slaughterhouse_data and slaughterhouse_data["created_at"]:
                if isinstance(slaughterhouse_data["created_at"], datetime):
                    slaughterhouse_data["created_at"] = slaughterhouse_data["created_at"].isoformat()
            slaughterhouses.append(slaughterhouse_data)
        
        return slaughterhouses
    except Exception as e:
        print(f"❌ Error fetching slaughterhouses: {e}")
        return []

async def get_recent_activities(limit: int = 20):
    """Get recent activities from Firestore"""
    if not firebase_initialized or not db:
        return []
    
    try:
        activities_ref = db.collection("activities").order_by(
            "timestamp", direction=firestore.Query.DESCENDING
        ).limit(limit)
        docs = activities_ref.stream()
        
        activities = []
        for doc in docs:
            activity_data = doc.to_dict()
            activity_data["id"] = doc.id
            # Convert timestamp to ISO format
            if "timestamp" in activity_data and activity_data["timestamp"]:
                if isinstance(activity_data["timestamp"], datetime):
                    activity_data["timestamp"] = activity_data["timestamp"].isoformat()
            if "created_at" in activity_data and activity_data["created_at"]:
                if isinstance(activity_data["created_at"], datetime):
                    activity_data["created_at"] = activity_data["created_at"].isoformat()
            activities.append(activity_data)
        
        return activities
    except Exception as e:
        print(f"❌ Error fetching activities: {e}")
        return []

# =============================
# USER SETTINGS FUNCTIONS
# =============================

async def get_user_settings(user_id: str):
    """Get user settings from Firestore"""
    if not firebase_initialized or not db:
        return None
    
    try:
        settings_ref = db.collection("user_settings").document(user_id)
        settings_doc = settings_ref.get()
        
        if settings_doc.exists:
            settings_data = settings_doc.to_dict()
            return settings_data
        else:
            # Return default settings if not found
            default_settings = {
                "theme": "light",
                "language": "english",
                "notifications": True,
                "sounds": True,
                "auto_save": True,
                "two_factor_auth": False,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "user_id": user_id
            }
            # Save default settings
            settings_ref.set(default_settings)
            return default_settings
    except Exception as e:
        print(f"❌ Error fetching user settings: {e}")
        return None

async def update_user_settings(user_id: str, settings_data: dict):
    """Update user settings in Firestore"""
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        settings_ref = db.collection("user_settings").document(user_id)
        
        # Add metadata
        settings_data["updated_at"] = datetime.now()
        settings_data["user_id"] = user_id
        
        # Update or create settings
        settings_ref.set(settings_data, merge=True)
        print(f"✅ Settings updated for user: {user_id}")
        
        return settings_data
    except Exception as e:
        print(f"❌ Error updating user settings: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating settings: {str(e)}")

# =============================
# DASHBOARD ANALYTICS
# =============================

async def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    
    if not firebase_initialized or not db:
        return {
            "total_users": 0,
            "total_farmers": 0,
            "total_veterinarians": 0,
            "total_slaughterhouses": 0,
            "total_hospitals": 0,
            "total_feedbacks": 0,
            "pending_feedbacks": 0,
            "last_month_users": 0,
            "user_distribution": {
                "farmers": 0,
                "veterinarians": 0,
                "slaughterhouses": 0
            },
            "recent_activities": [],
            "last_updated": datetime.now().isoformat(),
            "firebase_status": "not_initialized"
        }
    
    try:
        # Get all collections
        users = await get_all_users()
        hospitals = await get_all_hospitals()
        slaughterhouses = await get_all_slaughterhouses()
        activities = await get_recent_activities(10)
        
        # Get feedbacks
        total_feedbacks = 0
        pending_feedbacks = 0
        try:
            feedbacks_ref = db.collection("feedbacks")
            feedbacks_docs = list(feedbacks_ref.stream())
            total_feedbacks = len(feedbacks_docs)
            pending_feedbacks = sum(1 for doc in feedbacks_docs if doc.to_dict().get("status") == "new")
        except:
            pass
        
        # Count by role
        total_users = len(users)
        farmers = [u for u in users if u.get("role") == "farmer"]
        veterinarians = [u for u in users if u.get("role") == "veterinarian"]
        slaughter_users = [u for u in users if u.get("role") == "slaughterhouse"]
        
        # Calculate last month users - FIXED TIMEZONE ISSUE
        from datetime import timezone
        
        # Use timezone-aware datetime for comparison
        current_time = datetime.now(timezone.utc)
        one_month_ago = current_time - timedelta(days=30)
        
        last_month_users = 0
        for user in users:
            created_at = user.get("created_at")
            if created_at:
                try:
                    if isinstance(created_at, str):
                        # Parse string to datetime
                        if created_at.endswith('Z'):
                            created_at_dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        else:
                            created_at_dt = datetime.fromisoformat(created_at)
                    elif isinstance(created_at, datetime):
                        created_at_dt = created_at
                    else:
                        continue
                    
                    # Make sure datetime is timezone-aware
                    if created_at_dt.tzinfo is None:
                        created_at_dt = created_at_dt.replace(tzinfo=timezone.utc)
                    
                    # Now compare with timezone-aware datetime
                    if created_at_dt >= one_month_ago:
                        last_month_users += 1
                except Exception as e:
                    # If there's any error, skip this user
                    continue
        
        # Calculate percentages
        if total_users > 0:
            farmer_percent = (len(farmers) / total_users) * 100
            vet_percent = (len(veterinarians) / total_users) * 100
            slaughter_percent = (len(slaughter_users) / total_users) * 100
        else:
            farmer_percent = vet_percent = slaughter_percent = 0
        
        # Format activities for frontend
        formatted_activities = []
        for activity in activities:
            activity_type = activity.get("type", "")
            details = activity.get("details", {})
            
            action_map = {
                "user_registered": f"New {details.get('role', 'user')} registered",
                "user_login": "User logged in",
                "hospital_added": f"Hospital '{details.get('hospital_name', 'Unknown')}' added",
                "hospital_updated": f"Hospital '{details.get('hospital_name', 'Unknown')}' updated",
                "hospital_deleted": f"Hospital '{details.get('hospital_name', 'Unknown')}' deleted",
                "slaughterhouse_added": f"Slaughterhouse '{details.get('slaughterhouse_name', 'Unknown')}' added",
                "slaughterhouse_updated": f"Slaughterhouse '{details.get('slaughterhouse_name', 'Unknown')}' updated",
                "slaughterhouse_deleted": f"Slaughterhouse '{details.get('slaughterhouse_name', 'Unknown')}' deleted",
                "feedback_submitted": f"Feedback submitted for {details.get('target_name', 'Unknown')}",
                "user_updated": "User profile updated",
                "user_deleted": "User account deleted",
                "settings_updated": f"Settings updated by {activity.get('user_name', 'User')}",
                "two_factor_enabled": f"Two-factor authentication enabled by {activity.get('user_name', 'User')}",
                "two_factor_disabled": f"Two-factor authentication disabled by {activity.get('user_name', 'User')}",
                "password_reset": f"Password reset by {activity.get('user_name', 'User')}"
            }
            
            action_text = action_map.get(activity_type, "Activity")
            
            # Calculate time ago
            timestamp = activity.get("timestamp", "")
            time_text = "Just now"
            if timestamp:
                try:
                    if isinstance(timestamp, str):
                        if timestamp.endswith('Z'):
                            activity_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                        else:
                            activity_time = datetime.fromisoformat(timestamp)
                    else:
                        activity_time = timestamp
                    
                    # Make sure activity_time is timezone-aware
                    if activity_time.tzinfo is None:
                        activity_time = activity_time.replace(tzinfo=timezone.utc)
                    
                    # Use current timezone-aware datetime
                    current_time_aware = datetime.now(timezone.utc)
                    time_diff = current_time_aware - activity_time
                    minutes = int(time_diff.total_seconds() / 60)
                    
                    if minutes < 1:
                        time_text = "Just now"
                    elif minutes < 60:
                        time_text = f"{minutes} min ago"
                    elif minutes < 1440:
                        hours = minutes // 60
                        time_text = f"{hours} hour{'s' if hours > 1 else ''} ago"
                    else:
                        days = minutes // 1440
                        time_text = f"{days} day{'s' if days > 1 else ''} ago"
                except Exception as e:
                    print(f"Error calculating time ago: {e}")
                    time_text = "Recently"
            
            formatted_activities.append({
                "action": action_text,
                "user": activity.get("user_name", "Unknown"),
                "time": time_text,
                "type": activity_type,
                "status": "completed"
            })
        
        return {
            "total_users": total_users,
            "total_farmers": len(farmers),
            "total_veterinarians": len(veterinarians),
            "total_slaughterhouses": len(slaughter_users),
            "total_hospitals": len(hospitals),
            "total_slaughterhouse_facilities": len(slaughterhouses),
            "total_feedbacks": total_feedbacks,
            "pending_feedbacks": pending_feedbacks,
            "last_month_users": last_month_users,
            "user_distribution": {
                "farmers": round(farmer_percent, 1),
                "veterinarians": round(vet_percent, 1),
                "slaughterhouses": round(slaughter_percent, 1)
            },
            "recent_activities": formatted_activities,
            "last_updated": current_time.isoformat(),
            "firebase_status": "connected"
        }
        
    except Exception as e:
        print(f"❌ Error getting dashboard stats: {e}")
        import traceback
        traceback.print_exc()
        return {
            "total_users": 0,
            "total_farmers": 0,
            "total_veterinarians": 0,
            "total_slaughterhouses": 0,
            "total_hospitals": 0,
            "total_feedbacks": 0,
            "pending_feedbacks": 0,
            "last_month_users": 0,
            "user_distribution": {
                "farmers": 0,
                "veterinarians": 0,
                "slaughterhouses": 0
            },
            "recent_activities": [],
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "firebase_status": "error"
        }

# =============================
# API ENDPOINTS
# =============================

@app.get("/")
async def root():
    return {
        "message": "LivestockSync Admin API v5.0",
        "version": "5.0.0",
        "status": "active",
        "firebase": "connected" if firebase_initialized else "not_initialized",
        "endpoints": {
            "auth": "/api/auth/login, /api/auth/signup",
            "password_reset": "/api/auth/forgot-password, /api/auth/verify-otp, /api/auth/reset-password",
            "dashboard": "/api/admin/dashboard/stats",
            "hospitals": "/api/admin/hospitals",
            "slaughterhouses": "/api/admin/slaughterhouses",
            "users": "/api/admin/users",
            "feedback": "/api/feedback",
            "settings": "/api/user/settings",
            "two_factor_auth": "/api/user/two-factor-auth",
            "debug": "/api/debug/hospitals, /api/debug/slaughterhouses"
        }
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "firebase": "connected" if firebase_initialized else "not_initialized",
        "timestamp": datetime.now().isoformat(),
        "websocket_connections": len(manager.active_connections)
    }

# =============================
# IMPROVED WEBSOCKET ENDPOINT
# =============================

@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time dashboard updates"""
    await manager.connect(websocket)
    try:
        # Keep connection alive with heartbeat
        while True:
            try:
                # Wait for ping or message
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30)
                if data == "ping":
                    await websocket.send_text("pong")
                elif data == "get_activities":
                    # Send recent activities on request
                    activities = await get_recent_activities(20)
                    await websocket.send_json({
                        "type": "activities",
                        "data": activities,
                        "timestamp": datetime.now().isoformat()
                    })
            except asyncio.TimeoutError:
                # Send heartbeat to keep connection alive
                try:
                    await websocket.send_json({
                        "type": "heartbeat",
                        "timestamp": datetime.now().isoformat()
                    })
                except:
                    break
            except Exception:
                break
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# =============================
# AUTH ENDPOINTS
# =============================

@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    """User registration endpoint"""
    
    print(f"📝 DEBUG: Signup attempt for: {request.email}")
    
    if not firebase_initialized:
        print(f"❌ DEBUG: Firebase not initialized!")
        raise HTTPException(
            status_code=503, 
            detail="Firebase not initialized. Please configure serviceAccountKey.json"
        )
    
    email_lower = request.email.strip().lower()
    print(f"📧 DEBUG: Checking email: {email_lower}")
    
    # Validate email
    if not validate_email_format(email_lower):
        print(f"❌ DEBUG: Invalid email format")
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Check if user exists
    existing_user = await get_user_by_email(email_lower)
    if existing_user:
        print(f"❌ DEBUG: User already exists: {email_lower}")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    print(f"✅ DEBUG: Email available: {email_lower}")
    
    # Check admin limit
    if request.role == UserRole.ADMIN:
        users = await get_all_users()
        admin_count = sum(1 for u in users if u.get("role") == "admin")
        if admin_count >= MAX_ADMINS:
            raise HTTPException(status_code=403, detail="Admin account limit reached")
    
    # Validate password
    if len(request.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Create user
    user_data = {
        "email": email_lower,
        "password": request.password,
        "full_name": request.full_name,
        "phone": request.phone,
        "role": request.role.value,
        "business_name": request.business_name,
        "address": request.address
    }
    
    created_user = await create_user_in_firestore(user_data)
    
    # Create default settings for new user
    default_settings = {
        "theme": "light",
        "language": "english",
        "notifications": True,
        "sounds": True,
        "auto_save": True,
        "two_factor_auth": False,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "user_id": created_user["id"]
    }
    
    # Save default settings
    await update_user_settings(created_user["id"], default_settings)
    
    # Log activity
    await log_activity(
        ActivityType.USER_REGISTERED,
        created_user["id"],
        request.full_name,
        {"role": request.role.value, "email": email_lower}
    )
    
    return {
        "message": "Registration successful! Please login",
        "user": {
            "id": created_user["id"],
            "email": email_lower,
            "full_name": request.full_name,
            "role": request.role.value
        },
        "settings": default_settings
    }

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """User login endpoint"""
    
    print(f"🔐 DEBUG: Login attempt for email: {request.email}")
    
    if not firebase_initialized:
        print(f"❌ DEBUG: Firebase not initialized!")
        raise HTTPException(
            status_code=503,
            detail="Firebase not initialized. Please configure serviceAccountKey.json"
        )
    
    email_lower = request.email.strip().lower()
    print(f"📧 DEBUG: Searching for email: {email_lower}")
    
    # Get user from Firestore
    user = await get_user_by_email(email_lower)
    
    if not user:
        print(f"❌ DEBUG: User NOT FOUND in database!")
        print(f"❌ DEBUG: Check Firestore 'users' collection for email: {email_lower}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    print(f"✅ DEBUG: User FOUND: {user.get('email')}")
    
    # Verify password
    if user.get("password") != request.password:
        print(f"❌ DEBUG: Password MISMATCH!")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    print(f"✅ DEBUG: Password MATCH!")
    
    # Check status
    if user.get("status") != "active":
        print(f"❌ DEBUG: Account is {user.get('status')}")
        raise HTTPException(status_code=403, detail="Account is inactive or suspended")
    
    print(f"🎉 DEBUG: Login SUCCESSFUL for {email_lower}")
    
    # Update last login
    try:
        db.collection("users").document(user["id"]).update({
            "last_login": datetime.now()
        })
    except Exception as e:
        print(f"Note: Could not update last login: {e}")
    
    # Get user settings
    user_settings = await get_user_settings(user["id"])
    
    # Create token
    token_data = {
        "sub": user["id"],
        "email": user["email"],
        "role": user.get("role", "farmer")
    }
    access_token = create_access_token(token_data)
    
    # Log activity
    await log_activity(
        ActivityType.USER_LOGIN,
        user["id"],
        user.get("full_name", "Unknown"),
        {"role": user.get("role"), "email": email_lower}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user.get("full_name"),
            "role": user.get("role"),
            "business_name": user.get("business_name"),
            "address": user.get("address")
        },
        "settings": user_settings
    }

# =============================
# PASSWORD RESET ENDPOINTS
# =============================

@app.post("/api/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Send OTP to email for password reset"""
    
    print(f"🔑 Password reset request for: {request.email}")
    
    # Check if user exists
    user = await get_user_by_email(request.email.lower())
    if not user:
        # Security ke liye, user nahi hai to bhi success message dena
        return {
            "message": "If the email exists, OTP has been sent",
            "success": True
        }
    
    # Generate OTP
    otp = generate_otp()
    
    # Store OTP temporarily (24 hours validity)
    otp_storage[request.email.lower()] = {
        "otp": otp,
        "created_at": datetime.now(),
        "user_id": user["id"]
    }
    
    # Send OTP to email (simulated)
    await send_otp_to_email(request.email, otp)
    
    print(f"✅ OTP generated for {request.email}: {otp}")
    
    return {
        "message": "OTP sent to your email",
        "success": True,
        "otp": otp  # Debug ke liye - production mein hata dena
    }

@app.post("/api/auth/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    """Verify OTP for password reset"""
    
    email_lower = request.email.lower()
    
    # Check if OTP exists and is valid
    if email_lower not in otp_storage:
        raise HTTPException(status_code=400, detail="OTP expired or not found")
    
    otp_data = otp_storage[email_lower]
    
    # Check OTP expiry (24 hours)
    time_diff = datetime.now() - otp_data["created_at"]
    if time_diff.total_seconds() > 24 * 60 * 60:  # 24 hours
        del otp_storage[email_lower]
        raise HTTPException(status_code=400, detail="OTP expired")
    
    # Verify OTP
    if otp_data["otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    return {
        "message": "OTP verified successfully",
        "success": True,
        "user_id": otp_data["user_id"]
    }

@app.post("/api/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password with OTP verification"""
    
    email_lower = request.email.lower()
    
    # Check if OTP exists and is valid
    if email_lower not in otp_storage:
        raise HTTPException(status_code=400, detail="OTP expired or not found")
    
    otp_data = otp_storage[email_lower]
    
    # Check OTP expiry (24 hours)
    time_diff = datetime.now() - otp_data["created_at"]
    if time_diff.total_seconds() > 24 * 60 * 60:  # 24 hours
        del otp_storage[email_lower]
        raise HTTPException(status_code=400, detail="OTP expired")
    
    # Verify OTP
    if otp_data["otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Get user from database
    user = await get_user_by_email(email_lower)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate new password
    if len(request.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Update password in Firestore
    try:
        db.collection("users").document(user["id"]).update({
            "password": request.new_password,
            "updated_at": datetime.now()
        })
        
        print(f"✅ Password reset for: {email_lower}")
        
        # Remove OTP after successful reset
        del otp_storage[email_lower]
        
        # Log activity
        await log_activity(
            ActivityType.PASSWORD_RESET,
            user["id"],
            user.get("full_name", "Unknown"),
            {"action": "password_reset", "email": email_lower}
        )
        
        return {
            "message": "Password reset successfully! Please login with new password",
            "success": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting password: {str(e)}")

# =============================
# DASHBOARD ENDPOINTS (NO AUTH REQUIRED)
# =============================

@app.get("/api/admin/dashboard/stats")
async def get_dashboard_statistics():
    """Get real-time dashboard statistics (NO AUTH)"""
    stats = await get_dashboard_stats()
    return stats

@app.get("/api/admin/dashboard/recent-activities")
async def get_dashboard_activities(limit: int = 20):
    """Get recent activities (NO AUTH)"""
    activities = await get_recent_activities(limit)
    return {"activities": activities}

# =============================
# HOSPITAL MANAGEMENT (FLEXIBLE DATA - NO AUTH)
# =============================

@app.post("/api/admin/hospitals")
async def add_hospital(hospital: FlexibleHospitalRequest):
    """Add new hospital (NO AUTH) - FLEXIBLE VERSION"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    hospital_id = str(uuid.uuid4())
    
    # Get phone from either contact or phone field
    phone = hospital.phone or hospital.contact or ""
    
    # Convert services if needed
    services = []
    if hospital.services:
        if isinstance(hospital.services, str):
            services = [s.strip() for s in hospital.services.split(',') if s.strip()]
        elif isinstance(hospital.services, list):
            services = hospital.services
    
    hospital_data = {
        "id": hospital_id,
        "name": hospital.name,
        "address": hospital.address or "",
        "contact": phone,
        "phone": phone,
        "email": hospital.email or "",
        "services": services,
        "doctors": hospital.doctors or 0,
        "status": hospital.status or "Active",
        "operating_hours": hospital.operating_hours or hospital.hours or "",
        "created_at": datetime.now(),
        "created_by": "system"
    }
    
    try:
        # Clean up None values
        hospital_data = {k: v for k, v in hospital_data.items() if v is not None}
        
        # SAVE TO FIRESTORE
        db.collection("hospitals").document(hospital_id).set(hospital_data)
        print(f"✅ Hospital saved to Firestore: {hospital.name}")
        
        # Log activity with proper details
        await log_activity(
            ActivityType.HOSPITAL_ADDED,
            "system",
            "system",
            {
                "hospital_name": hospital.name,
                "hospital_id": hospital_id,
                "address": hospital.address or "",
                "contact": phone,
                "email": hospital.email or ""
            }
        )
        
        return {
            "message": "Hospital added successfully",
            "hospital": hospital_data,
            "success": True,
            "id": hospital_id
        }
    except Exception as e:
        print(f"❌ Error adding hospital: {e}")
        raise HTTPException(status_code=500, detail=f"Error adding hospital: {str(e)}")

@app.get("/api/admin/hospitals")
async def get_hospitals():
    """Get all hospitals (NO AUTH)"""
    hospitals = await get_all_hospitals()
    return {"hospitals": hospitals, "total": len(hospitals), "success": True}

@app.delete("/api/admin/hospitals/{hospital_id}")
async def delete_hospital(hospital_id: str):
    """Delete hospital (NO AUTH)"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Get hospital name before deleting
        hospital_doc = db.collection("hospitals").document(hospital_id).get()
        hospital_name = "Unknown"
        if hospital_doc.exists:
            hospital_name = hospital_doc.to_dict().get("name", "Unknown")
        
        # Delete hospital
        db.collection("hospitals").document(hospital_id).delete()
        print(f"✅ Hospital deleted: {hospital_name}")
        
        # Log activity
        await log_activity(
            ActivityType.HOSPITAL_DELETED,
            "system",
            "system",
            {
                "hospital_name": hospital_name,
                "hospital_id": hospital_id,
                "deleted_by": "system"
            }
        )
        
        return {"message": "Hospital deleted successfully", "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting hospital: {str(e)}")

# =============================
# SLAUGHTERHOUSE MANAGEMENT (FLEXIBLE DATA - NO AUTH)
# =============================

@app.post("/api/admin/slaughterhouses")
async def add_slaughterhouse(slaughterhouse: FlexibleSlaughterhouseRequest):
    """Add new slaughterhouse (NO AUTH) - FLEXIBLE VERSION"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    slaughterhouse_id = str(uuid.uuid4())
    
    # Get phone from either contact or phone field
    phone = slaughterhouse.phone or slaughterhouse.contact or ""
    
    slaughterhouse_data = {
        "id": slaughterhouse_id,
        "name": slaughterhouse.name,
        "address": slaughterhouse.address or "",
        "contact": phone,
        "phone": phone,
        "email": slaughterhouse.email or "",
        "capacity": slaughterhouse.capacity or "",
        "status": slaughterhouse.status or "Active",
        "operating_hours": slaughterhouse.operating_hours or slaughterhouse.hours or "",
        "certification": slaughterhouse.certification or "",
        "created_at": datetime.now(),
        "created_by": "system"
    }
    
    try:
        # Clean up None values
        slaughterhouse_data = {k: v for k, v in slaughterhouse_data.items() if v is not None}
        
        # SAVE TO FIRESTORE
        db.collection("slaughterhouses").document(slaughterhouse_id).set(slaughterhouse_data)
        print(f"✅ Slaughterhouse saved to Firestore: {slaughterhouse.name}")
        
        # Log activity with proper details
        await log_activity(
            ActivityType.SLAUGHTERHOUSE_ADDED,
            "system",
            "system",
            {
                "slaughterhouse_name": slaughterhouse.name,
                "slaughterhouse_id": slaughterhouse_id,
                "address": slaughterhouse.address or "",
                "contact": phone,
                "email": slaughterhouse.email or "",
                "capacity": slaughterhouse.capacity or ""
            }
        )
        
        return {
            "message": "Slaughterhouse added successfully",
            "slaughterhouse": slaughterhouse_data,
            "success": True,
            "id": slaughterhouse_id
        }
    except Exception as e:
        print(f"❌ Error adding slaughterhouse: {e}")
        raise HTTPException(status_code=500, detail=f"Error adding slaughterhouse: {str(e)}")

@app.get("/api/admin/slaughterhouses")
async def get_slaughterhouses_endpoint():
    """Get all slaughterhouses (NO AUTH)"""
    slaughterhouses = await get_all_slaughterhouses()
    return {"slaughterhouses": slaughterhouses, "total": len(slaughterhouses), "success": True}

@app.delete("/api/admin/slaughterhouses/{slaughterhouse_id}")
async def delete_slaughterhouse(slaughterhouse_id: str):
    """Delete slaughterhouse (NO AUTH)"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Get slaughterhouse name before deleting
        slaughterhouse_doc = db.collection("slaughterhouses").document(slaughterhouse_id).get()
        slaughterhouse_name = "Unknown"
        if slaughterhouse_doc.exists:
            slaughterhouse_name = slaughterhouse_doc.to_dict().get("name", "Unknown")
        
        # Delete slaughterhouse
        db.collection("slaughterhouses").document(slaughterhouse_id).delete()
        print(f"✅ Slaughterhouse deleted: {slaughterhouse_name}")
        
        # Log activity
        await log_activity(
            ActivityType.SLAUGHTERHOUSE_DELETED,
            "system",
            "system",
            {
                "slaughterhouse_name": slaughterhouse_name,
                "slaughterhouse_id": slaughterhouse_id,
                "deleted_by": "system"
            }
        )
        
        return {"message": "Slaughterhouse deleted successfully", "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting slaughterhouse: {str(e)}")

# =============================
# USER MANAGEMENT (NO AUTH REQUIRED)
# =============================

@app.get("/api/admin/users")
async def get_all_users_endpoint():
    """Get all users (NO AUTH)"""
    users = await get_all_users()
    return {"users": users, "total": len(users), "success": True}

@app.get("/api/admin/users/count")
async def get_users_count():
    """Get user count (NO AUTH)"""
    users = await get_all_users()
    return {"total_users": len(users), "last_month_users": 0}

@app.get("/api/admin/hospitals/count")
async def get_hospitals_count():
    """Get hospitals count (NO AUTH)"""
    hospitals = await get_all_hospitals()
    return {"total_hospitals": len(hospitals)}

@app.get("/api/admin/slaughterhouses/count")
async def get_slaughterhouses_count():
    """Get slaughterhouses count (NO AUTH)"""
    slaughterhouses = await get_all_slaughterhouses()
    return {"total_slaughterhouses": len(slaughterhouses)}

# =============================
# FEEDBACK MANAGEMENT
# =============================

@app.post("/api/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """Submit feedback (NO AUTH)"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    feedback_id = str(uuid.uuid4())
    feedback_data = {
        "id": feedback_id,
        "user_id": feedback.user_id,
        "user_name": feedback.user_name,
        "target_type": feedback.target_type,
        "target_id": feedback.target_id,
        "target_name": feedback.target_name,
        "rating": feedback.rating,
        "comment": feedback.comment,
        "created_at": datetime.now(),
        "status": "new"
    }
    
    try:
        db.collection("feedbacks").document(feedback_id).set(feedback_data)
        
        # Log activity
        await log_activity(
            ActivityType.FEEDBACK_SUBMITTED,
            feedback.user_id,
            feedback.user_name,
            {
                "target_type": feedback.target_type,
                "target_name": feedback.target_name,
                "rating": feedback.rating,
                "feedback_id": feedback_id
            }
        )
        
        return {
            "message": "Feedback submitted successfully",
            "feedback": feedback_data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting feedback: {str(e)}")

@app.get("/api/admin/feedback")
async def get_all_feedback():
    """Get all feedback (NO AUTH)"""
    
    if not firebase_initialized or not db:
        return {"feedbacks": [], "total": 0, "success": True}
    
    try:
        feedbacks_ref = db.collection("feedbacks").order_by("created_at", direction=firestore.Query.DESCENDING)
        docs = feedbacks_ref.stream()
        
        feedbacks = []
        for doc in docs:
            feedback_data = doc.to_dict()
            feedback_data["id"] = doc.id
            if "created_at" in feedback_data and feedback_data["created_at"]:
                if isinstance(feedback_data["created_at"], datetime):
                    feedback_data["created_at"] = feedback_data["created_at"].isoformat()
            feedbacks.append(feedback_data)
        
        return {"feedbacks": feedbacks, "total": len(feedbacks), "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching feedback: {str(e)}")

# =============================
# UPDATE HOSPITAL ENDPOINT (FLEXIBLE DATA - NO AUTH)
# =============================

@app.put("/api/admin/hospitals/{hospital_id}")
async def update_hospital(
    hospital_id: str,
    hospital_update: dict = Body(...)
):
    """Update hospital (NO AUTH) - FLEXIBLE VERSION"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Get existing hospital
        hospital_ref = db.collection("hospitals").document(hospital_id)
        hospital_doc = hospital_ref.get()
        
        if not hospital_doc.exists:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        existing_data = hospital_doc.to_dict()
        hospital_name = existing_data.get("name", "Unknown")
        
        # Handle services field conversion if it's a string
        if 'services' in hospital_update and isinstance(hospital_update['services'], str):
            hospital_update['services'] = [s.strip() for s in hospital_update['services'].split(',') if s.strip()]
        
        # Handle contact/phone fields
        if 'phone' in hospital_update and 'contact' not in hospital_update:
            hospital_update['contact'] = hospital_update['phone']
        elif 'contact' in hospital_update and 'phone' not in hospital_update:
            hospital_update['phone'] = hospital_update['contact']
        
        # Add update metadata
        hospital_update["updated_at"] = datetime.now()
        hospital_update["updated_by"] = "system"
        
        # Update hospital
        hospital_ref.update(hospital_update)
        
        # Get updated data for activity log
        updated_data = {**existing_data, **hospital_update}
        
        # Log activity
        await log_activity(
            ActivityType.HOSPITAL_UPDATED,
            "system",
            "system",
            {
                "hospital_name": hospital_name,
                "hospital_id": hospital_id,
                "updated_fields": list(hospital_update.keys()),
                "updated_by": "system"
            }
        )
        
        return {"message": "Hospital updated successfully", "success": True}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating hospital: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating hospital: {str(e)}")

# =============================
# UPDATE SLAUGHTERHOUSE ENDPOINT (FLEXIBLE DATA - NO AUTH)
# =============================

@app.put("/api/admin/slaughterhouses/{slaughterhouse_id}")
async def update_slaughterhouse(
    slaughterhouse_id: str,
    slaughterhouse_update: dict = Body(...)
):
    """Update slaughterhouse (NO AUTH) - FLEXIBLE VERSION"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Get existing slaughterhouse
        slaughterhouse_ref = db.collection("slaughterhouses").document(slaughterhouse_id)
        slaughterhouse_doc = slaughterhouse_ref.get()
        
        if not slaughterhouse_doc.exists:
            raise HTTPException(status_code=404, detail="Slaughterhouse not found")
        
        existing_data = slaughterhouse_doc.to_dict()
        slaughterhouse_name = existing_data.get("name", "Unknown")
        
        # Handle contact/phone fields
        if 'phone' in slaughterhouse_update and 'contact' not in slaughterhouse_update:
            slaughterhouse_update['contact'] = slaughterhouse_update['phone']
        elif 'contact' in slaughterhouse_update and 'phone' not in slaughterhouse_update:
            slaughterhouse_update['phone'] = slaughterhouse_update['contact']
        
        # Add update metadata
        slaughterhouse_update["updated_at"] = datetime.now()
        slaughterhouse_update["updated_by"] = "system"
        
        # Update slaughterhouse
        slaughterhouse_ref.update(slaughterhouse_update)
        
        # Log activity
        await log_activity(
            ActivityType.SLAUGHTERHOUSE_UPDATED,
            "system",
            "system",
            {
                "slaughterhouse_name": slaughterhouse_name,
                "slaughterhouse_id": slaughterhouse_id,
                "updated_fields": list(slaughterhouse_update.keys()),
                "updated_by": "system"
            }
        )
        
        return {"message": "Slaughterhouse updated successfully", "success": True}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating slaughterhouse: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating slaughterhouse: {str(e)}")

# =============================
# USER MANAGEMENT ENDPOINTS
# =============================

@app.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: str):
    """Delete user (NO AUTH)"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Get user data before deleting
        user_doc = db.collection("users").document(user_id).get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        user_name = user_data.get("full_name", "Unknown")
        user_email = user_data.get("email", "Unknown")
        user_role = user_data.get("role", "Unknown")
        
        # Delete user
        db.collection("users").document(user_id).delete()
        print(f"✅ User deleted: {user_name} ({user_email})")
        
        # Log activity
        await log_activity(
            ActivityType.USER_DELETED,
            "system",
            "system",
            {
                "deleted_user": user_name,
                "deleted_user_id": user_id,
                "email": user_email,
                "role": user_role,
                "deleted_by": "system"
            }
        )
        
        return {"message": "User deleted successfully", "success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")

@app.put("/api/admin/users/{user_id}")
async def update_user(user_id: str, user_update: dict = Body(...)):
    """Update user (NO AUTH)"""
    
    if not firebase_initialized or not db:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Get existing user
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        existing_data = user_doc.to_dict()
        user_name = existing_data.get("full_name", "Unknown")
        
        # Add update metadata
        user_update["updated_at"] = datetime.now()
        user_update["updated_by"] = "system"
        
        # Update user
        user_ref.update(user_update)
        
        # Log activity
        await log_activity(
            ActivityType.USER_UPDATED,
            "system",
            "system",
            {
                "user_name": user_name,
                "user_id": user_id,
                "updated_fields": list(user_update.keys()),
                "updated_by": "system"
            }
        )
        
        return {"message": "User updated successfully", "success": True}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

# =============================
# THEME SETTINGS ENDPOINTS
# =============================

@app.post("/api/user/settings")
async def save_user_settings(request: UserSettingsRequest):
    """Save user theme settings"""
    
    if not firebase_initialized:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Verify user exists
        user_ref = db.collection("users").document(request.user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        
        # Convert settings to dict
        settings_dict = request.settings.dict()
        
        # Update settings in Firestore
        updated_settings = await update_user_settings(request.user_id, settings_dict)
        
        # Log activity
        await log_activity(
            ActivityType.SETTINGS_UPDATED,
            request.user_id,
            user_data.get("full_name", "Unknown"),
            {
                "theme": settings_dict.get("theme"),
                "language": settings_dict.get("language"),
                "notifications": settings_dict.get("notifications"),
                "sounds": settings_dict.get("sounds"),
                "auto_save": settings_dict.get("auto_save"),
                "two_factor_auth": settings_dict.get("two_factor_auth")
            }
        )
        
        return {
            "message": "Settings saved successfully",
            "settings": updated_settings,
            "success": True
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving settings: {str(e)}")

@app.get("/api/user/settings/{user_id}")
async def get_user_settings_endpoint(user_id: str):
    """Get user theme settings"""
    
    if not firebase_initialized:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Verify user exists
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user settings
        settings = await get_user_settings(user_id)
        
        if not settings:
            # Return default settings
            default_settings = {
                "theme": "light",
                "language": "english",
                "notifications": True,
                "sounds": True,
                "auto_save": True,
                "two_factor_auth": False,
                "user_id": user_id
            }
            return default_settings
        
        return settings
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching settings: {str(e)}")

# =============================
# TWO-FACTOR AUTHENTICATION ENDPOINTS
# =============================

@app.post("/api/user/two-factor-auth")
async def toggle_two_factor_auth(request: TwoFactorAuthRequest):
    """Enable/Disable two-factor authentication"""
    
    if not firebase_initialized:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Verify user exists
        user_ref = db.collection("users").document(request.user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        
        # Get current settings
        settings = await get_user_settings(request.user_id)
        
        if request.enabled:
            # For demo purposes, we'll just enable it
            # In production, you would verify the verification code
            
            # Generate a secret key (simulated)
            import string
            secret_key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=16))
            
            # Update settings
            updated_settings = {
                **settings,
                "two_factor_auth": True,
                "two_factor_secret": secret_key,
                "updated_at": datetime.now()
            }
            
            await update_user_settings(request.user_id, updated_settings)
            
            # Log activity
            await log_activity(
                ActivityType.TWO_FACTOR_ENABLED,
                request.user_id,
                user_data.get("full_name", "Unknown"),
                {"two_factor_enabled": True}
            )
            
            return {
                "message": "Two-factor authentication enabled successfully",
                "success": True,
                "secret_key": secret_key,
                "provisioning_uri": f"otpauth://totp/LivestockSync:{user_data['email']}?secret={secret_key}&issuer=LivestockSync"
            }
            
        else:
            # Disable 2FA
            updated_settings = {
                **settings,
                "two_factor_auth": False,
                "two_factor_secret": None,
                "updated_at": datetime.now()
            }
            
            await update_user_settings(request.user_id, updated_settings)
            
            # Log activity
            await log_activity(
                ActivityType.TWO_FACTOR_DISABLED,
                request.user_id,
                user_data.get("full_name", "Unknown"),
                {"two_factor_enabled": False}
            )
            
            return {
                "message": "Two-factor authentication disabled successfully",
                "success": True
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating 2FA: {str(e)}")

@app.post("/api/user/verify-2fa")
async def verify_two_factor_auth(request: TwoFactorAuthRequest):
    """Verify two-factor authentication code"""
    
    if not firebase_initialized:
        raise HTTPException(status_code=503, detail="Firebase not initialized")
    
    try:
        # Verify user exists
        user_ref = db.collection("users").document(request.user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        
        # Get settings
        settings = await get_user_settings(request.user_id)
        
        if not settings.get("two_factor_auth"):
            raise HTTPException(status_code=400, detail="Two-factor authentication is not enabled")
        
        if not request.verification_code:
            raise HTTPException(status_code=400, detail="Verification code is required")
        
        # For demo purposes, accept any 6-digit code
        # In production, use pyotp or similar library to verify TOTP
        if len(request.verification_code) == 6 and request.verification_code.isdigit():
            # Code is valid (simulated)
            return {
                "message": "Verification successful",
                "success": True
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid verification code")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying 2FA: {str(e)}")

# =============================
# DEBUG ENDPOINTS
# =============================

@app.post("/api/debug/hospitals")
async def debug_hospital(data: dict = Body(...)):
    """Debug endpoint to see what data frontend is sending"""
    print("=" * 80)
    print("🔍 DEBUG: Hospital data received from frontend:")
    print(f"📦 Full request: {data}")
    print(f"📊 Keys: {list(data.keys())}")
    
    # Check each field
    expected_fields = ['name', 'email', 'phone', 'address', 'services', 'doctors', 'status', 'hours']
    for field in expected_fields:
        print(f"   {field}: {data.get(field, 'NOT PRESENT')}")
    
    print("=" * 80)
    
    return {
        "received_data": data,
        "message": "Data received successfully",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/debug/slaughterhouses")
async def debug_slaughterhouse(data: dict = Body(...)):
    """Debug endpoint to see what data frontend is sending"""
    print("=" * 80)
    print("🔍 DEBUG: Slaughterhouse data received from frontend:")
    print(f"📦 Full request: {data}")
    print(f"📊 Keys: {list(data.keys())}")
    
    # Check each field
    expected_fields = ['name', 'email', 'phone', 'address', 'capacity', 'hours', 'certification', 'status']
    for field in expected_fields:
        print(f"   {field}: {data.get(field, 'NOT PRESENT')}")
    
    print("=" * 80)
    
    return {
        "received_data": data,
        "message": "Data received successfully",
        "timestamp": datetime.now().isoformat()
    }

# =============================
# ACTIVITY ENDPOINTS
# =============================

@app.get("/api/activities")
async def get_activities(limit: int = 50):
    """Get recent activities"""
    activities = await get_recent_activities(limit)
    return {
        "activities": activities,
        "total": len(activities),
        "success": True
    }

@app.get("/api/activities/latest")
async def get_latest_activities():
    """Get latest 10 activities"""
    activities = await get_recent_activities(10)
    return {
        "activities": activities,
        "total": len(activities),
        "success": True
    }

# =============================
# APPLICATION STARTUP
# =============================

if __name__ == "__main__":
    print("=" * 80)
    print("🚀 LivestockSync Admin Backend API v5.0 (ENHANCED REAL-TIME VERSION)")
    print("=" * 80)
    print(f"📍 Server URL: http://localhost:8000")
    print(f"📚 API Docs: http://localhost:8000/docs")
    print(f"🔥 Firebase: {'✅ Connected' if firebase_initialized else '❌ Not Initialized'}")
    print(f"🔌 WebSocket: /ws/dashboard")
    print("=" * 80)
    print("\n✨ ENHANCED FEATURES:")
    print("   ✅ Complete Password Reset System with OTP")
    print("   ✅ Theme Settings Management")
    print("   ✅ Two-Factor Authentication")
    print("   ✅ Improved Real-time WebSocket Notifications")
    print("   ✅ Detailed Activity Logging for ALL operations")
    print("   ✅ Hospital Added/Updated/Deleted notifications")
    print("   ✅ Slaughterhouse Added/Updated/Deleted notifications")
    print("   ✅ User Added/Updated/Deleted notifications")
    print("   ✅ Feedback submission notifications")
    print("   ✅ Settings updates notifications")
    print("   ✅ 2FA enable/disable notifications")
    print("   ✅ Password reset notifications")
    print("   ✅ Proper timestamp and details in all activities")
    print("\n🔓 ALL ENDPOINTS ARE ACCESSIBLE WITHOUT AUTHENTICATION!")
    print("\n📊 Key Endpoints:")
    print("   POST /api/auth/login - User login")
    print("   POST /api/auth/signup - User registration")
    print("   POST /api/auth/forgot-password - Send OTP for password reset")
    print("   POST /api/auth/verify-otp - Verify OTP")
    print("   POST /api/auth/reset-password - Reset password with OTP")
    print("   POST /api/user/settings - Save theme settings")
    print("   GET  /api/user/settings/{user_id} - Get theme settings")
    print("   POST /api/user/two-factor-auth - Enable/disable 2FA")
    print("   POST /api/user/verify-2fa - Verify 2FA code")
    print("   GET  /api/admin/dashboard/stats - Dashboard statistics")
    print("   GET  /api/activities - Get recent activities")
    print("   GET  /api/activities/latest - Get latest activities")
    print("   POST /api/admin/hospitals - Add hospital")
    print("   PUT  /api/admin/hospitals/{id} - Update hospital")
    print("   DELETE /api/admin/hospitals/{id} - Delete hospital")
    print("   POST /api/admin/slaughterhouses - Add slaughterhouse")
    print("   PUT  /api/admin/slaughterhouses/{id} - Update slaughterhouse")
    print("   DELETE /api/admin/slaughterhouses/{id} - Delete slaughterhouse")
    print("   DELETE /api/admin/users/{id} - Delete user")
    print("   PUT  /api/admin/users/{id} - Update user")
    print("\n🔔 Real-time Notifications:")
    print("   ✅ hospital_added - When hospital is added")
    print("   ✅ hospital_updated - When hospital is updated")
    print("   ✅ hospital_deleted - When hospital is deleted")
    print("   ✅ slaughterhouse_added - When slaughterhouse is added")
    print("   ✅ slaughterhouse_updated - When slaughterhouse is updated")
    print("   ✅ slaughterhouse_deleted - When slaughterhouse is deleted")
    print("   ✅ user_registered - When new user registers")
    print("   ✅ user_login - When user logs in")
    print("   ✅ user_updated - When user profile is updated")
    print("   ✅ user_deleted - When user is deleted")
    print("   ✅ feedback_submitted - When feedback is submitted")
    print("   ✅ settings_updated - When user settings are updated")
    print("   ✅ two_factor_enabled - When 2FA is enabled")
    print("   ✅ two_factor_disabled - When 2FA is disabled")
    print("   ✅ password_reset - When password is reset")
    
    if not firebase_initialized:
        print("\n⚠️  IMPORTANT: Firebase not initialized!")
        print("   Please add 'serviceAccountKey.json' to the project directory")
        print("   Download it from Firebase Console > Project Settings > Service Accounts")
    
    print("=" * 80)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)