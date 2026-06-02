# Quick Start Guide - Prime AI Backend & Frontend

## 🚀 30-Minute Setup Guide

### Prerequisites
- Docker & Docker Compose installed
- OR: Node.js 18+, npm, MongoDB

---

## Option 1: Docker Compose (Recommended - 5 minutes)

### 1. Start Everything
```bash
cd backend
docker-compose up -d
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **API Docs**: http://localhost:5000/api/v1/docs

### 3. Test Registration & Login
- Go to http://localhost:3000/register
- Create an account
- You'll be redirected to dashboard

Done! ✅

---

## Option 2: Local Development Setup (15 minutes)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start MongoDB (ensure it's running)
mongod  # Terminal 1 - keep running

# Start backend server
npm run dev  # Terminal 2 - keep running
```

Backend will be available at: `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start  # Terminal 3 - will open http://localhost:3000
```

Frontend will open automatically in your browser.

---

## 🧪 Quick API Testing

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Save Token & Use for Protected Routes
```bash
# Save the token
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Create a task
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task",
    "priority": "high",
    "status": "pending"
  }'
```

### 3. Get All Tasks
```bash
curl -X GET http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Swagger API Documentation

### Access Swagger UI
```
http://localhost:5000/api/v1/docs
```

Use Swagger UI to:
- View all endpoints
- See request/response schemas
- Test APIs directly
- Check error codes

---

## 📝 Default Test User

For quick testing without registration:

1. **Register**: Use form at http://localhost:3000/register
2. **Login**: Use credentials at http://localhost:3000/login

---

## 🔍 File Structure Overview

```
prime.ai ass/
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # MongoDB schemas
│   │   └── middleware/    # Auth, validation, errors
│   ├── docker-compose.yml # Full stack setup
│   └── Dockerfile
│
├── frontend/              # React.js UI
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── context/       # Auth context
│   ├── Dockerfile
│   └── package.json
│
├── README.md              # Main documentation
├── SCALABILITY.md         # Architecture & scaling
└── backend/
    └── Prime-AI-API.postman_collection.json  # Postman collection
```

---

## ⚙️ Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prime-ai
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Ensure MongoDB is running
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo:latest
```

### "Port 5000 already in use"
```bash
# Find process using port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### "Cannot reach frontend API"
- Check backend is running: http://localhost:5000/health
- Check CORS_ORIGIN in backend .env
- Clear browser cache

### Frontend shows "Unauthorized"
- Token may be expired
- Clear localStorage in browser DevTools
- Log in again

---

## 🔐 Key Features to Try

### 1. **Create Multiple Tasks**
- Click "Add New Task"
- Set different priorities and statuses
- Due dates and tags

### 2. **Filter Tasks**
- Filter by status (pending, in-progress, completed)
- Filter by priority (low, medium, high, critical)

### 3. **Dashboard Statistics**
- See total, completed, pending, and in-progress counts
- Updates in real-time

### 4. **Edit Tasks**
- Click "Edit" on any task
- Change any field
- Mark as completed

### 5. **Delete Tasks**
- Click "Delete"
- Confirm deletion

---

## 📚 Full Documentation

- **Backend Docs**: See `backend/README.md`
- **Frontend Docs**: See `frontend/README.md`
- **Scalability**: See `SCALABILITY.md`
- **API Docs**: Visit http://localhost:5000/api/v1/docs

---

## 🚀 Next Steps

### For Development
1. Explore code in `src/` folders
2. Run tests: `npm test`
3. Check logs: `docker-compose logs -f`

### For Deployment
1. Update `.env` with production values
2. Build images: `docker build -t prime-ai .`
3. Deploy to your platform

### For Learning
1. Study the authentication flow
2. Review error handling
3. Check database schemas
4. Understand API versioning

---

## 📞 Support

For issues:
1. Check logs: `docker-compose logs`
2. Read README files in each folder
3. Check Swagger documentation
4. Review source code comments

---

## ✅ Verification Checklist

- [ ] Backend running: http://localhost:5000/health returns OK
- [ ] Frontend running: http://localhost:3000 loads
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create a task
- [ ] Can see tasks in dashboard
- [ ] Can edit a task
- [ ] Can delete a task
- [ ] API docs load: http://localhost:5000/api/v1/docs

---

**Everything set up? You're ready to explore the application! 🎉**
