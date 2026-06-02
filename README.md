# Prime AI - Full Stack Task Management Platform

A complete, production-ready REST API with frontend UI for secure task management with JWT authentication and role-based access control.

## 🎯 Project Overview

This project demonstrates a scalable, secure full-stack application built with:
- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React.js
- **Infrastructure**: Docker, Docker Compose
- **Documentation**: Swagger/OpenAPI

## ✅ Implemented Features

### Backend API
- ✅ User authentication (Register/Login) with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (user, admin)
- ✅ CRUD APIs for task management
- ✅ Input validation with Joi
- ✅ Comprehensive error handling
- ✅ API versioning (`/api/v1`)
- ✅ Swagger/OpenAPI documentation
- ✅ Rate limiting (100 req/15min per IP)
- ✅ CORS security
- ✅ Helmet security headers
- ✅ Winston logging
- ✅ Health check endpoints
- ✅ MongoDB integration with Mongoose

### Frontend
- ✅ User authentication (Register/Login)
- ✅ Protected routes with JWT
- ✅ Task management dashboard
- ✅ Create, read, update, delete tasks
- ✅ Task filtering (status, priority)
- ✅ Task statistics
- ✅ Responsive UI
- ✅ Error handling and user feedback
- ✅ Secure token management

### Infrastructure
- ✅ Docker containerization (backend & frontend)
- ✅ Docker Compose for full stack
- ✅ Environment configuration
- ✅ Health checks
- ✅ MongoDB container

## 📁 Project Structure

```
prime.ai ass/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # MongoDB connection
│   │   │   └── swagger.js       # Swagger setup
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT middleware
│   │   │   ├── authorize.js     # Role authorization
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── tokenUtils.js
│   │   │   └── validationSchemas.js
│   │   └── index.js             # Express app
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.js
    │   │   ├── TaskForm.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   └── global.js
    │   ├── utils/
    │   │   └── hooks.js
    │   ├── App.js
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── Dockerfile
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
cd backend
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

Access the application at `http://localhost:3000`

### Option 2: Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## 📚 API Documentation

### Swagger UI
After starting the backend, visit:
```
http://localhost:5000/api/v1/docs
```

### Authentication Endpoints
```
POST   /api/v1/auth/register     # Register new user
POST   /api/v1/auth/login        # Login user
GET    /api/v1/auth/me           # Get user profile
```

### Task Endpoints (All require authentication)
```
GET    /api/v1/tasks             # Get all tasks
GET    /api/v1/tasks/:id         # Get task by ID
POST   /api/v1/tasks             # Create task
PUT    /api/v1/tasks/:id         # Update task
DELETE /api/v1/tasks/:id         # Delete task
GET    /api/v1/tasks/stats       # Get task statistics
```

## 🔐 Security Features

1. **Authentication**: JWT tokens with expiration
2. **Password Security**: bcryptjs hashing (10 rounds)
3. **Input Validation**: Joi schemas for all inputs
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS**: Configurable origins
6. **Helmet**: Security headers
7. **SQL Injection Prevention**: Parameterized queries via Mongoose
8. **XSS Protection**: Input sanitization
9. **HTTPS Ready**: Production-ready SSL configuration

## 🛠️ Configuration

### Backend Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prime-ai
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
API_VERSION=v1
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## 📊 Database Schema

### User Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed),
  "role": String (user, admin),
  "isActive": Boolean,
  "lastLogin": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Task Collection
```json
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "status": String (pending, in-progress, completed, cancelled),
  "priority": String (low, medium, high, critical),
  "userId": ObjectId (reference to User),
  "dueDate": Date,
  "tags": [String],
  "isCompleted": Boolean,
  "completedAt": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

## 📈 Scalability Architecture

### Current Design
- Single-instance Node.js server
- MongoDB for persistence
- In-memory rate limiting
- Stateless API design

### Recommended Enhancements for Scale

1. **Horizontal Scaling**
   - Deploy multiple backend instances
   - Use Nginx as reverse proxy/load balancer
   - Kubernetes for orchestration

2. **Caching Layer**
   - Redis for session management
   - Cache frequently accessed data
   - Reduce database load

3. **Database Optimization**
   - Proper indexing strategy
   - Database replication
   - Read replicas for scaling reads

4. **Microservices Architecture**
   - Separate auth service
   - Separate task service
   - API Gateway pattern

5. **Message Queues**
   - RabbitMQ/Kafka for async processing
   - Background job processing
   - Event-driven architecture

6. **CDN & Static Assets**
   - CloudFlare for API responses
   - S3 for file storage
   - Compress and cache responses

7. **Monitoring & Observability**
   - New Relic/DataDog for APM
   - ELK stack for logging
   - Real-time alerts

## 🚢 Deployment

### Heroku Deployment
```bash
git push heroku main
```

### AWS EC2 + Docker
```bash
docker build -t prime-ai:latest .
docker run -p 80:5000 prime-ai:latest
```

### Google Cloud Run
```bash
gcloud run deploy prime-ai --source .
```

### Railway / Render
Push to GitHub and connect repository for auto-deployment.

## 🧪 Testing

### Backend Tests
```bash
npm test
npm test -- --coverage
```

### API Testing with Curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":"high"}'
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database name

### Frontend API Errors
- Check if backend is running on port 5000
- Verify CORS_ORIGIN in backend `.env`
- Clear browser cache and localStorage

### Port Already in Use
```bash
# Find and kill process on port
lsof -i :5000    # Mac/Linux
netstat -ano | findstr :5000  # Windows
```

## 📝 Important Notes

1. **Change JWT Secret**: Update `JWT_SECRET` in production
2. **Use HTTPS**: Enable SSL/TLS in production
3. **Database Backup**: Set up regular MongoDB backups
4. **Monitoring**: Implement APM and logging
5. **Rate Limiting**: Adjust based on your needs
6. **CORS**: Configure appropriate origins

## 🔄 Git Workflow

```bash
# Clone repository
git clone <repository-url>
cd prime.ai ass

# Backend setup
cd backend
npm install
cp .env.example .env

# Frontend setup
cd ../frontend
npm install

# Start development
cd backend && npm run dev  # Terminal 1
cd frontend && npm start    # Terminal 2
```

## 📋 Checklist for Production

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS_ORIGIN properly
- [ ] Set up monitoring and alerts
- [ ] Enable database backups
- [ ] Load test the API
- [ ] Set up CI/CD pipeline
- [ ] Document API endpoints
- [ ] Create runbooks for operations

## 📞 Support & Contact

For issues, questions, or contributions:
- GitHub Issues: [Create an issue]
- Email: support@primetrade.ai
- Documentation: See backend/ and frontend/ README.md

## 📄 License

MIT License - Open source and free to use

## 🙏 Credits

Built for Prime Trade AI as an internship assignment.

---

**Project Status**: ✅ Complete and Production Ready
**Last Updated**: 2024
**API Version**: v1.0.0
**Frontend Version**: 1.0.0
