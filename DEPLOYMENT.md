# Deployment Guide - Prime AI

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Use managed database (MongoDB Atlas)
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up monitoring and logging
- [ ] Enable database backups
- [ ] Load test the API
- [ ] Document all environment variables
- [ ] Set up CI/CD pipeline

---

## Deployment Platforms

### 1. Heroku (Easiest for Beginners)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create prime-ai

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prime-ai

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### 2. AWS (EC2)

```bash
# Create EC2 instance (Ubuntu 20.04)
# Install Node.js and MongoDB

# Copy files to server
scp -r backend/ ubuntu@your-server:/home/ubuntu/

# SSH into server
ssh ubuntu@your-server

# Install dependencies
cd backend
npm install

# Create .env
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prime-ai
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://your-domain.com
EOF

# Start with PM2
npm install -g pm2
pm2 start src/index.js --name "prime-ai-backend"
pm2 startup
pm2 save

# Set up Nginx
sudo apt install nginx
# Configure Nginx to proxy to localhost:5000
```

### 3. Google Cloud Run (Serverless)

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Deploy backend
gcloud run deploy prime-ai-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,JWT_SECRET=your_secret

# Deploy frontend
gcloud run deploy prime-ai-frontend \
  --source ./frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 4. Docker + Kubernetes (Advanced)

```bash
# Build images
docker build -t gcr.io/your-project/prime-ai-backend:1.0.0 backend/
docker build -t gcr.io/your-project/prime-ai-frontend:1.0.0 frontend/

# Push to registry
docker push gcr.io/your-project/prime-ai-backend:1.0.0
docker push gcr.io/your-project/prime-ai-frontend:1.0.0

# Deploy to Kubernetes
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/ingress.yaml
```

### 5. Railway / Render (Easiest Docker Deployment)

**Railway:**
1. Push code to GitHub
2. Connect repository in Railway dashboard
3. Set environment variables
4. Deploy automatically

**Render:**
1. https://dashboard.render.com
2. Create new Web Service
3. Connect GitHub repo
4. Select branch
5. Set build command: `npm install`
6. Set start command: `node src/index.js`

---

## Database Options

### Option 1: MongoDB Atlas (Recommended)

```bash
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create cluster (free tier available)
# 3. Get connection string
# 4. Set environment variable

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prime-ai?retryWrites=true&w=majority
```

### Option 2: Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod

# Backup strategy
mongodump --uri "mongodb://localhost:27017/prime-ai" --out /backups/db-$(date +%Y%m%d)

# Restore
mongorestore --uri "mongodb://localhost:27017" /backups/db-20240101
```

---

## SSL/HTTPS Configuration

### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer

# Nginx config
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring & Logging

### 1. Application Performance Monitoring

```javascript
// Use New Relic
require('newrelic');
const app = require('./src/index');

// Or use DataDog
const StatsD = require('node-dogstatsd').StatsD;
const dogstatsd = new StatsD();
dogstatsd.gauge('api.response_time', responseTime);
```

### 2. Error Tracking

```javascript
// Use Sentry
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "https://your-sentry-dsn@sentry.io/..." });
app.use(Sentry.Handlers.errorHandler());
```

### 3. Log Aggregation

```bash
# ELK Stack (Elasticsearch, Logstash, Kibana)
docker run -d --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:7.10.0
docker run -d --name kibana docker.elastic.co/kibana/kibana:7.10.0
```

---

## Performance Optimization

### 1. Enable Caching Headers

```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 2. Enable Gzip Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Database Indexing

```javascript
// Ensure these indexes exist in MongoDB
db.users.createIndex({ email: 1 }, { unique: true });
db.tasks.createIndex({ userId: 1, createdAt: -1 });
db.tasks.createIndex({ status: 1, priority: 1 });
```

### 4. CDN Configuration

```javascript
// Serve static assets from CDN
const CDN_URL = 'https://cdn.your-domain.com';

// In frontend
const API_URL = 'https://api.your-domain.com/api/v1';
```

---

## Backup Strategy

### Daily Backup

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup MongoDB
mongodump \
  --uri "mongodb://user:pass@host:27017/prime-ai" \
  --out "$BACKUP_DIR/backup-$TIMESTAMP"

# Compress
tar -czf "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz" "$BACKUP_DIR/backup-$TIMESTAMP"

# Delete backups older than 30 days
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +30 -delete

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz" s3://your-bucket/backups/
```

### Cron Job

```bash
# Schedule daily at 2 AM
0 2 * * * /home/ubuntu/backup.sh
```

---

## Security Checklist

### Environment Variables
```env
# ✅ DO NOT commit .env to git
# ✅ Use strong random JWT_SECRET (min 32 chars)
# ✅ Change default passwords
# ✅ Use HTTPS in production
# ✅ Set restrictive CORS_ORIGIN
```

### Database Security
```bash
# ✅ Enable MongoDB authentication
# ✅ Use strong passwords
# ✅ Restrict network access (firewall)
# ✅ Enable SSL connection
# ✅ Regular backups
```

### API Security
```bash
# ✅ Enable rate limiting
# ✅ Validate all inputs
# ✅ Use HTTPS only
# ✅ Set security headers (Helmet)
# ✅ Monitor for suspicious activity
```

---

## Scaling Strategy

### Stage 1: Single Server (< 1000 users)
```
┌──────────────┐
│ Single Server│ (Node + MongoDB)
│ + Nginx      │
└──────────────┘
```

### Stage 2: Multiple Servers (1000-10000 users)
```
┌──────────┐
│ Nginx LB │
└────┬─────┘
  ┌──┴──┬──┐
  ▼     ▼  ▼
 App1  App2 App3
  └─────┬──┘
        ▼
   MongoDB RS
```

### Stage 3: Full Scale (10000+ users)
```
┌──────────────┐
│ Kubernetes   │
│ Auto-scaling │
└──────────────┘
```

---

## Troubleshooting Deployment

### Application won't start

```bash
# Check logs
docker logs container-name

# Check environment variables
docker exec container-name env | grep JWT_SECRET

# Check database connection
mongosh mongodb://your-uri/test

# Check port availability
lsof -i :5000
```

### High memory usage

```bash
# Check Node.js heap
node --max-old-space-size=2048 src/index.js

# Profile with clinic.js
npm install -g clinic
clinic doctor -- node src/index.js
```

### Slow API responses

```bash
# Check database indexes
db.tasks.getIndexes()

# Monitor query performance
db.tasks.find().explain("executionStats")
```

---

## Post-Deployment

### 1. Health Checks

```bash
# Check API health
curl https://api.your-domain.com/health

# Check frontend
curl https://your-domain.com
```

### 2. SSL Certificate

```bash
# Verify certificate
openssl s_client -connect your-domain.com:443

# Check expiration
certbot certificates
```

### 3. Monitor Performance

```bash
# Check uptime
uptime

# Check disk usage
df -h

# Check memory
free -h

# Check CPU
top
```

---

## Disaster Recovery Plan

### In case of data loss

```bash
# Restore from backup
mongorestore --uri "mongodb://your-uri" backup-dir/

# Verify data
db.tasks.count()
db.users.count()
```

### In case of service failure

```bash
# Restart all services
docker-compose restart

# Check logs
docker-compose logs -f

# Verify services
curl http://localhost:5000/health
```

---

## Useful Commands

```bash
# View logs
docker logs -f container-name

# Execute command in container
docker exec -it container-name bash

# Monitor resource usage
docker stats

# Database backup
mongodump --uri "mongodb://uri" --out /backups/

# Database restore
mongorestore --uri "mongodb://uri" /backups/

# Check running processes
ps aux | grep node

# Kill process
kill -9 PID
```

---

## Support

For deployment issues:
1. Check logs
2. Review this guide
3. Check official documentation
4. Contact support

---

**Last Updated**: 2024
