# Prime AI Backend API

## Overview

A scalable REST API with authentication, role-based access control, and CRUD operations for task management. Built with Express.js and MongoDB.

## Features

✅ **Authentication & Security**
- User registration and login with JWT tokens
- Secure password hashing using bcryptjs
- Role-based access control (user vs admin)
- Input validation and sanitization
- CORS security

✅ **API Capabilities**
- RESTful API design with proper HTTP status codes
- API versioning (`/api/v1`)
- Comprehensive error handling
- Request rate limiting
- Swagger/OpenAPI documentation

✅ **Database**
- MongoDB with Mongoose ODM
- Scalable schema design
- User and Task models with relationships

✅ **Infrastructure**
- Docker containerization
- Docker Compose for full stack deployment
- Health checks and monitoring
- Logging with Winston

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection
│   │   └── swagger.js   # Swagger documentation setup
│   ├── controllers/     # Route controllers
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT authentication
│   │   ├── authorize.js # Role-based authorization
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── utils/           # Utility functions
│   │   ├── logger.js
│   │   ├── tokenUtils.js
│   │   └── validationSchemas.js
│   └── index.js         # Express app setup
├── Dockerfile           # Container image definition
├── docker-compose.yml   # Multi-container setup
├── package.json
├── .env.example         # Environment variables template
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+
- Docker & Docker Compose (optional, for containerized setup)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prime-ai
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
API_VERSION=v1
```

5. **Start MongoDB** (if not using Docker)
```bash
mongod
```

6. **Start the development server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Docker Setup

### Using Docker Compose (Recommended for Full Stack)

1. **Build and start all services**
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

2. **View logs**
```bash
docker-compose logs -f
```

3. **Stop services**
```bash
docker-compose down
```

### Building Docker Image Only

```bash
docker build -t prime-ai-backend:latest .
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongodb:27017/prime-ai \
  -e JWT_SECRET=your_secret_key \
  prime-ai-backend:latest
```

## API Documentation

### Access Swagger UI
```
http://localhost:5000/api/v1/docs
```

### Base URL
```
http://localhost:5000/api/v1
```

## Authentication Endpoints

### Register User
```bash
POST /auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { user, token }
```

### Login
```bash
POST /auth/login

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { user, token }
```

### Get Profile
```bash
GET /auth/me
Headers: Authorization: Bearer <token>

Response: { user }
```

## Task Management Endpoints

All task endpoints require JWT authentication

### Get All Tasks
```bash
GET /tasks?status=pending&priority=high&sortBy=-createdAt
Headers: Authorization: Bearer <token>

Response: { count, tasks }
```

### Get Task by ID
```bash
GET /tasks/:id
Headers: Authorization: Bearer <token>

Response: { task }
```

### Create Task
```bash
POST /tasks

{
  "title": "Complete project",
  "description": "Finish the backend API",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2024-12-31",
  "tags": ["urgent", "backend"]
}

Response: { task }
```

### Update Task
```bash
PUT /tasks/:id

{
  "status": "completed",
  "priority": "medium"
}

Response: { task }
```

### Delete Task
```bash
DELETE /tasks/:id
Headers: Authorization: Bearer <token>

Response: { success message }
```

### Get Task Statistics
```bash
GET /tasks/stats
Headers: Authorization: Bearer <token>

Response: { stats: { total, completed, pending, inProgress, cancelled } }
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

Common HTTP Status Codes:
- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry
- `500 Internal Server Error` - Server error

## Security Considerations

1. **JWT Tokens**
   - Change `JWT_SECRET` in production
   - Tokens expire after specified period (`JWT_EXPIRE`)
   - Stored in secure HTTP-only cookies on client

2. **Password Security**
   - Passwords hashed with bcryptjs (10 rounds by default)
   - Never stored in plain text
   - Min 6 characters required

3. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents abuse and DDoS attacks

4. **Input Validation**
   - Joi schemas validate all inputs
   - SQL injection & XSS protection
   - Request size limited to 10MB

5. **CORS**
   - Configurable origin via `CORS_ORIGIN`
   - Prevents unauthorized cross-origin requests

6. **Helmet Security**
   - Sets security HTTP headers
   - Protects against common vulnerabilities

## Logging

Logs are stored in:
- `combined.log` - All logs
- `error.log` - Error logs only

Log levels: `error`, `warn`, `info`, `debug`

## Testing

Run tests:
```bash
npm test
```

With coverage:
```bash
npm test -- --coverage
```

## Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS/SSL
- [ ] Set proper `CORS_ORIGIN`
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Enable database backups
- [ ] Review security headers (Helmet)
- [ ] Load test the API

### Deployment Options

**Heroku**
```bash
git push heroku main
```

**AWS (EC2 + Docker)**
```bash
docker build -t prime-ai:latest .
docker run -p 80:5000 prime-ai:latest
```

**Google Cloud Run**
```bash
gcloud run deploy prime-ai \
  --source . \
  --platform managed \
  --region us-central1
```

**Railway/Render** - Use docker-compose.yml

## Scalability Architecture

### Current Design
- Single Node.js instance with MongoDB
- In-memory rate limiting
- Stateless API (scale horizontally)

### Future Enhancements

1. **Microservices**
   - Separate authentication service
   - Separate task service
   - API Gateway pattern

2. **Caching Layer**
   - Redis for session caching
   - Cache frequently accessed data
   - Reduces database load

3. **Message Queues**
   - RabbitMQ/Kafka for async operations
   - Background job processing
   - Email notifications

4. **Database Optimization**
   - Indexing strategy
   - Database replication
   - Sharding for large datasets

5. **Load Balancing**
   - Multiple server instances
   - Nginx reverse proxy
   - Auto-scaling (Kubernetes)

6. **Monitoring & Observability**
   - Application Performance Monitoring (APM)
   - Distributed tracing
   - Real-time alerts

7. **CDN & Static Assets**
   - CloudFlare CDN for API responses
   - S3 for file storage
   - Static content caching

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@primetrade.ai

---

**Last Updated**: 2024
**API Version**: v1.0.0
