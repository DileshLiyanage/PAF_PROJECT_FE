# Facilities & Assets Catalogue - Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
# Backend running on: http://localhost:8080
```

### 2. Start Frontend
```bash
npm install  # (first time only)
npm start
# Frontend running on: http://localhost:3000
```

### 3. Access the Application
- **User View**: http://localhost:3000/resources
- **Admin View**: http://localhost:3000/admin/resources
- **API**: http://localhost:8080/resources

---

## 📡 API Quick Reference

### Base URL
```
http://localhost:8080/resources
```

### Authentication
```
Header: Authorization: Bearer <JWT_TOKEN>
```

### Core Operations

#### Get All Resources
```
GET /resources
Parameters: q, type, status, location, minCapacity, maxCapacity
Example: GET /resources?type=Lecture%20Hall&minCapacity=50
```

#### Get Single Resource
```
GET /resources/123
```

#### Create Resource (Admin)
```
POST /resources
Body: {
  "name": "Lab 101",
  "type": "Laboratory",
  "capacity": 30,
  "location": "Building 2",
  "description": "Equipped lab",
  "availability": ["Mon-Fri 9-5"],
  "status": "ACTIVE"
}
```

#### Update Resource (Admin)
```
PUT /resources/123
Body: { updated fields }
```

#### Delete Resource (Admin)
```
DELETE /resources/123
```

---

## 🔍 Search Examples

### Search by Name
```
GET /resources?q=lecture
```

### Filter by Type
```
GET /resources?type=Laboratory
```

### Filter by Location
```
GET /resources?location=Building%201
```

### Capacity Range
```
GET /resources?minCapacity=20&maxCapacity=50
```

### Active Only
```
GET /resources?status=ACTIVE
```

### Combined Search
```
GET /resources?q=lab&type=Laboratory&status=ACTIVE&minCapacity=10
```

---

## 🎯 Frontend Navigation

### User Routes
```
/                           Home
/resources                  Resource Catalogue
/resources/:id             Resource Detail
/bookings                  Booking Page
```

### Admin Routes
```
/admin/resources           Resource Dashboard
/admin/resources/new       Add Resource
/admin/resources/:id/edit  Edit Resource
```

---

## 📝 Resource Object

```javascript
{
  "id": 1,                                    // Auto-generated
  "name": "Lecture Hall A101",               // Required
  "type": "Lecture Hall",                    // Required
  "capacity": 50,                            // Required (≥1)
  "location": "Building 1, Floor 2",        // Required
  "description": "Well-equipped hall",       // Optional
  "status": "ACTIVE",                        // ACTIVE|OUT_OF_SERVICE
  "availability": [                          // Optional
    "Mon-Fri 9:00 AM - 5:00 PM",
    "Sat 10:00 AM - 2:00 PM"
  ],
  "createdAt": "2026-04-19T10:30:00",       // Auto-set
  "updatedAt": "2026-04-19T10:30:00"        // Auto-updated
}
```

---

## ✅ Validation Rules

### Frontend Validation
| Field | Rules |
|-------|-------|
| name | Required, 3+ chars |
| type | Required, predefined list |
| capacity | Required, positive integer ≥1 |
| location | Required, 2+ chars |
| status | Required, ACTIVE or OUT_OF_SERVICE |

### Backend Validation
- Same as frontend
- Additional server-side checks
- Detailed error messages

---

## 🎨 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST success) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing JWT) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Server Error |

---

## 🔐 Roles & Permissions

| Operation | Roles |
|-----------|-------|
| View Resources | USER, ADMIN, TECHNICIAN |
| Create Resource | ADMIN |
| Update Resource | ADMIN |
| Delete Resource | ADMIN |

---

## 📊 Statistics Endpoint

```
GET /resources/stats/summary

Response:
{
  "total": 15,
  "active": 12,
  "outOfService": 3
}
```

---

## 🏷️ Metadata Endpoints

```
GET /resources/metadata/types
Response: ["Lecture Hall", "Laboratory", "Meeting Room", ...]

GET /resources/metadata/locations
Response: ["Building 1", "Building 2", "Building 3", ...]
```

---

## 🔄 Common Workflows

### User: Browse and View Resources
```
1. GET /resources                    (list all)
2. GET /resources?type=Lecture%20Hall (filter)
3. GET /resources/123               (view detail)
```

### Admin: Create Resource
```
1. Navigate to /admin/resources/new
2. Fill form
3. POST /resources
4. Redirected to dashboard
```

### Admin: Edit Resource
```
1. Navigate to /admin/resources/123/edit
2. Form pre-populated with current data
3. Modify fields
4. PUT /resources/123
5. Redirected to dashboard
```

### Admin: Delete Resource
```
1. In dashboard, click Delete
2. Confirm deletion
3. DELETE /resources/123
4. Dashboard updated
```

---

## 🛠️ Useful Commands

### Backend
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Package
mvn clean package

# Run tests
mvn test
```

### Frontend
```bash
# Install
npm install

# Start dev server
npm start

# Build
npm run build

# Test
npm test
```

---

## 🐛 Common Issues & Fixes

### CORS Error
**Problem**: `Access to XMLHttpRequest blocked by CORS`
**Solution**: Restart backend, verify @CrossOrigin is present

### 401 Unauthorized
**Problem**: API returns 401
**Solution**: Check JWT token is valid, ensure user is logged in

### 404 Not Found
**Problem**: GET /resources/999 returns 404
**Solution**: Verify resource ID exists in database

### Form Not Submitting
**Problem**: Form validation errors
**Solution**: Check all required fields are filled, values are valid

### Page Won't Load
**Problem**: Blank page or error
**Solution**: Check browser console for errors, verify API is running

---

## 📱 Responsive Breakpoints

```css
Mobile:  < 480px   (single column)
Tablet:  480-768px (2 columns)
Desktop: > 768px   (3+ columns)
```

---

## 💾 Database

### H2 Console
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:pafdb
Username: sa
Password: (leave empty)
```

### Tables
```
- resources
- resource_availability
```

---

## 🔌 Resource Types

Predefined types available:
- Lecture Hall
- Laboratory
- Meeting Room
- Auditorium
- Seminar Room
- Computer Lab
- Equipment - Projector
- Equipment - Camera
- Equipment - Microphone
- Other

---

## 📋 Component Quick Guide

| Component | File | Purpose |
|-----------|------|---------|
| ResourceCatalogue | `ResourceCatalogue.jsx` | Browse/search view |
| ResourceDetail | `ResourceDetail.jsx` | Single resource view |
| ResourceDashboard | `ResourceDashboard.jsx` | Admin management |
| ResourceForm | `ResourceForm.jsx` | Form component |
| AddResource | `AddResource.jsx` | Create interface |
| EditResource | `EditResource.jsx` | Edit interface |

---

## 🎯 Testing Quick Checklist

```
□ Browse resources
□ Search by name
□ Filter by type
□ Filter by location
□ Filter by capacity
□ View resource details
□ Check availability
□ Add new resource (admin)
□ Edit resource (admin)
□ Delete resource (admin)
□ Toggle status (admin)
□ Test on mobile
□ Test error cases
```

---

## 📖 Documentation Map

| Document | Purpose |
|----------|---------|
| README.md (this folder) | Main module documentation |
| FACILITIES_CATALOGUE_README.md | Comprehensive API & features |
| SETUP_GUIDE.md | Setup instructions & troubleshooting |
| IMPLEMENTATION_SUMMARY.md | What was implemented |

---

## 🔗 Useful Links

| Link | Purpose |
|------|---------|
| http://localhost:3000 | Frontend |
| http://localhost:8080 | Backend |
| http://localhost:8080/h2-console | Database console |
| http://localhost:3000/resources | Resource catalogue |
| http://localhost:3000/admin/resources | Admin dashboard |

---

## ⚡ Performance Tips

1. **Use filters** to reduce data loaded
2. **Clear filters** if search is slow
3. **Restart backend** if responses are slow
4. **Check browser console** for errors
5. **Use DevTools Network tab** to debug API calls

---

## 🚨 Emergency Troubleshooting

### Nothing works
```bash
# 1. Kill all processes
killall java
killall node

# 2. Clear cache
rm -rf ~/.m2/repository (or just delete .m2)
rm -rf node_modules

# 3. Reinstall
mvn clean install
npm install

# 4. Start fresh
mvn spring-boot:run
npm start
```

### Database corrupted
```bash
# H2 in-memory database resets on restart
# Just restart the backend
```

### Port already in use
```bash
# Find and kill process on port
lsof -ti:8080 | xargs kill -9      # Backend
lsof -ti:3000 | xargs kill -9      # Frontend
```

---

## 📞 When Stuck

1. **Check logs** - Backend: console output, Frontend: browser console
2. **Check DevTools** - Network tab for API calls
3. **Review documentation** - See FACILITIES_CATALOGUE_README.md
4. **Check troubleshooting** - See SETUP_GUIDE.md
5. **Verify setup** - Follow SETUP_GUIDE.md setup steps again

---

## ✨ Pro Tips

1. Use **Postman** to test API endpoints
2. Use **VS Code REST Client** extension for quick API testing
3. Use **React DevTools** to debug component state
4. Use **Network tab** in DevTools to see all API calls
5. Keep **browser console** open while testing
6. Use **curl** for quick command-line API testing

---

## 📊 Quick Stats

- **Backend Endpoints**: 13
- **Frontend Pages**: 6
- **CSS Files**: 5
- **React Components**: 6
- **Documentation Pages**: 4
- **Total LOC**: ~3,000+

---

**Last Updated**: April 19, 2026  
**Version**: 1.0.0