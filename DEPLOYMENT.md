# PAF Project - Deployment & Operations Guide

## 📋 Quick Start

### Local Development
```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
npm install
npm start
```

### Docker Deployment
```bash
# Build and run everything with Docker Compose
docker-compose up --build

# Then visit:
# Frontend: http://localhost
# Backend API: http://localhost:8080
# PostgreSQL: localhost:5432
```

---

## 🚀 Deployment Options

### Option 1: Cloud Platforms

#### AWS
```bash
# Frontend - S3 + CloudFront
aws s3 sync build/ s3://your-bucket-name/
# Then configure CloudFront distribution

# Backend - Elastic Beanstalk or EC2
eb deploy
# or use docker push to ECR + ECS
```

#### Heroku
```bash
# Create app
heroku create paf-app

# Deploy
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set SPRING_PROFILES_ACTIVE=prod
```

#### Google Cloud / Azure
- Frontend: Cloud Storage + Cloud CDN
- Backend: Cloud Run or App Service
- Database: Cloud SQL or Azure Database

### Option 2: Self-Hosted (VPS/Dedicated Server)

```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone https://github.com/your-repo.git
cd PAF_PROJECT_FE

# Build backend
./deploy-backend.sh

# Build frontend
./deploy-frontend.sh

# Start with Docker Compose
docker-compose -f docker-compose.yml up -d

# Setup SSL with Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com
# Update nginx.conf to use SSL
```

---

## 🔐 Environment Configuration

### Backend (.env.production)
```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://your-db:3306/paf
SPRING_DATASOURCE_USERNAME=db_user
SPRING_DATASOURCE_PASSWORD=db_pass
JWT_SECRET=min-32-char-strong-secret-key
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_ENV=production
```

### Database Options
- Development: H2 (in-memory, included)
- Production: PostgreSQL or MySQL

---

## ✅ Pre-Deployment Checklist

- [ ] Backend builds successfully: `mvn clean package`
- [ ] Frontend builds successfully: `npm run build`
- [ ] All tests pass: `mvn test` and `npm test`
- [ ] Environment variables set correctly
- [ ] Database configured and migrated
- [ ] SSL/TLS certificates ready (production)
- [ ] CORS settings configured for your domain
- [ ] JWT secret changed from default
- [ ] API endpoints tested
- [ ] Error logging configured
- [ ] Database backups automated

---

## 📊 Monitoring & Maintenance

### Backend Health Checks
```bash
# Check API health
curl http://localhost:8080/actuator/health

# View logs
docker logs paf-backend

# Database check
curl http://localhost:8080/actuator/db
```

### Frontend Performance
- Use Chrome DevTools Lighthouse
- Monitor build size: `npm run build -- --stats`
- Check network requests and API latency

### Database Maintenance
```sql
-- Backup
pg_dump paf_database > backup.sql

-- Restore
psql paf_database < backup.sql
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
docker logs paf-backend

# Verify database connection
# Check .env.production settings
# Ensure PORT 8080 is not in use: netstat -an | grep 8080
```

### Frontend shows blank page
```bash
# Check network tab in DevTools
# Verify API_URL in .env matches backend URL
# Clear browser cache: Ctrl+Shift+Delete
# Rebuild: npm run build
```

### CORS errors
- Update CORS_ALLOWED_ORIGINS in backend .env
- Add header: Access-Control-Allow-Credentials: true (if needed)

---

## 📱 API Endpoints (for reference)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /resources | USER | List all resources |
| GET | /resources/{id} | USER | Get single resource |
| POST | /resources | ADMIN | Create resource |
| PUT | /resources/{id} | ADMIN | Update resource |
| DELETE | /resources/{id} | ADMIN | Delete resource |
| GET | /resources/metadata/types | USER | Get resource types |
| GET | /resources/metadata/locations | USER | Get locations |
| GET | /resources/stats/summary | USER | Get statistics |

---

## 🔄 Continuous Integration / Continuous Deployment (CI/CD)

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build backend
        run: ./deploy-backend.sh
      
      - name: Build frontend
        run: ./deploy-frontend.sh
      
      - name: Push to Docker Hub
        run: docker push your-docker-repo/paf-backend
      
      - name: Deploy to production
        run: ./deploy-production.sh
```

---

## 📞 Support

- GitHub Issues: https://github.com/your-repo/issues
- Documentation: See FACILITIES_CATALOGUE_README.md
- API Docs: See QUICK_REFERENCE.md
