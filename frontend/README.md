# Prime AI Frontend

A React.js frontend application for task management with JWT authentication and role-based access control.

## Features

- 🔐 User Authentication (Login/Register with JWT)
- 📋 Task Management (CRUD operations)
- 🎯 Task Filtering (by status, priority)
- 📊 Task Statistics Dashboard
- 🎨 Modern, responsive UI
- 🛡️ Protected routes and authentication handling

## Tech Stack

- **React** 18.x
- **React Router** 6.x for client-side routing
- **Axios** for API calls
- **JWT** for authentication
- **CSS-in-JS** for styling

## Installation

### Prerequisites
- Node.js 14+ and npm
- Backend API running on `http://localhost:5000/api/v1`

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file** (optional, for custom API URL)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

3. **Start development server**
```bash
npm start
```

App will open at `http://localhost:3000`

## Usage

### Register New Account
1. Navigate to `/register`
2. Enter name, email, and password (min 6 characters)
3. Click "Register"

### Login
1. Navigate to `/login`
2. Enter email and password
3. Click "Login"

### Dashboard
After login, you'll see:
- **Statistics**: Total, completed, in-progress, and pending tasks
- **Task List**: All your tasks with filters
- **Create Task**: Click "Add New Task" button
- **Edit Task**: Click "Edit" on any task
- **Delete Task**: Click "Delete" on any task

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation.js       # Top navigation bar
│   │   ├── TaskForm.js          # Create/edit task form
│   │   └── ProtectedRoute.js    # Authentication guard
│   ├── context/
│   │   └── AuthContext.js       # Authentication state
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Dashboard.js
│   ├── services/
│   │   └── api.js               # API client with Axios
│   ├── styles/
│   │   └── global.js            # Global styles
│   ├── utils/
│   │   └── hooks.js             # useAuth hook
│   ├── App.js
│   └── index.js
├── package.json
├── Dockerfile
└── README.md
```

## API Integration

### Authentication Endpoints

**Register**
```javascript
POST /auth/register
Body: { name, email, password }
Returns: { user, token }
```

**Login**
```javascript
POST /auth/login
Body: { email, password }
Returns: { user, token }
```

**Get Profile**
```javascript
GET /auth/me
Headers: Authorization: Bearer <token>
Returns: { user }
```

### Task Endpoints

**Get All Tasks**
```javascript
GET /tasks?status=pending&priority=high&sortBy=-createdAt
Headers: Authorization: Bearer <token>
Returns: { count, tasks }
```

**Create Task**
```javascript
POST /tasks
Body: { title, description, status, priority, dueDate, tags }
Headers: Authorization: Bearer <token>
Returns: { task }
```

**Update Task**
```javascript
PUT /tasks/:id
Body: { title, description, status, priority, dueDate, tags }
Headers: Authorization: Bearer <token>
Returns: { task }
```

**Delete Task**
```javascript
DELETE /tasks/:id
Headers: Authorization: Bearer <token>
Returns: { success message }
```

**Get Stats**
```javascript
GET /tasks/stats
Headers: Authorization: Bearer <token>
Returns: { stats: { total, completed, pending, inProgress, cancelled } }
```

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token and user data
3. Token is stored in localStorage
4. Token is sent with every API request via Authorization header
5. If token is invalid/expired, user is redirected to login
6. On logout, token and user data are removed from localStorage

## Styling

The application uses inline CSS with global styles injected into the head. Key classes:

- `.btn` - Button base styles
- `.btn-primary` - Primary button (blue)
- `.btn-secondary` - Secondary button (gray)
- `.btn-danger` - Danger button (red)
- `.card` - Card container
- `.form-group` - Form field container
- `.alert` - Alert messages
- `.loading` - Loading spinner
- `.navbar` - Navigation bar

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api/v1    # Backend API URL
```

## Docker Deployment

### Build Image
```bash
docker build -t prime-ai-frontend:latest .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:5000/api/v1 \
  prime-ai-frontend:latest
```

### With Docker Compose
```bash
docker-compose up
```

## Available Scripts

### `npm start`
Runs the app in development mode at `http://localhost:3000`

### `npm test`
Runs the test suite

### `npm run build`
Builds the app for production

### `npm run eject`
Ejects from Create React App (irreversible)

## Troubleshooting

### CORS Errors
- Ensure backend is running
- Check `CORS_ORIGIN` in backend `.env`
- Verify API URL in `REACT_APP_API_URL`

### 401 Unauthorized
- Token may be expired
- Log out and log back in
- Check browser localStorage for token

### Tasks not loading
- Ensure you're logged in
- Check browser console for errors
- Verify backend is running and API is accessible

## Performance Optimization

- Uses functional components with hooks
- Lazy loading for routes (can be added)
- Memoization for expensive computations (can be added)
- Request debouncing for filters (can be added)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Dark mode theme
- [ ] Task search functionality
- [ ] Real-time notifications
- [ ] File attachments for tasks
- [ ] Task comments/collaboration
- [ ] Calendar view
- [ ] Export tasks to CSV/PDF
- [ ] Offline support with Service Workers

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License

---

**Last Updated**: 2024
**Frontend Version**: 1.0.0
