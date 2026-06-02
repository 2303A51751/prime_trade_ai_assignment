# Prime AI - Task Management Platform

## Overview

A full-stack task management application built with Node.js, Express, MongoDB, JWT Authentication, and React.

### Tech Stack

* Backend: Node.js, Express.js, MongoDB
* Frontend: React.js
* Authentication: JWT
* Documentation: Swagger
* Deployment:

  * Backend: Render
  * Frontend: Vercel

---

## Live Demo

### Frontend
https://prime-trade-ai-assignment-nu.vercel.app/login

### Backend API

https://prime-trade-ai-assignment-b7br.onrender.com

### Swagger Documentation

https://prime-trade-ai-assignment-b7br.onrender.com/api/v1/docs

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Task Management

* Create Task
* View Tasks
* Update Task
* Delete Task
* Task Filtering and Statistics

---

## API Endpoints

### Authentication

* POST `/api/v1/auth/register`
* POST `/api/v1/auth/login`
* GET `/api/v1/auth/me`

### Tasks

* GET `/api/v1/tasks`
* GET `/api/v1/tasks/:id`
* POST `/api/v1/tasks`
* PUT `/api/v1/tasks/:id`
* DELETE `/api/v1/tasks/:id`

---

## Local Setup

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Environment Variables

### Backend

```env
MONGODB_URI= confidential
JWT_SECRET= confidential
API_VERSION=v1
```

### Frontend

```env
REACT_APP_API_URL= confidential
```

---

## Scalability Considerations

### Microservices

Authentication and task management can be separated into independent services as traffic grows.

### Caching

Redis can be used to cache frequently accessed data and reduce database load.

### Load Balancing

Multiple backend instances can be be deployed behind a load balancer to improve availability and handle increased traffic.

### Database Scaling

MongoDB Atlas supports replication and sharding for horizontal scaling.

### Monitoring

Tools such as Prometheus, Grafana, and centralized logging can be used for monitoring and alerting.

---


