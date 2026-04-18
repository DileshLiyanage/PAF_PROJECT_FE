# Facilities & Assets Catalogue Module - Complete Documentation

## Overview

The Facilities & Assets Catalogue is a comprehensive module for managing bookable resources in an educational or corporate facility. It provides a complete system for cataloguing, searching, filtering, and managing resources like lecture halls, laboratories, meeting rooms, and equipment.

## Features

### User Features
- **Browse Resources**: View all available resources in a grid layout
- **Advanced Search & Filtering**: 
  - Search by name or description
  - Filter by type, location, status, and capacity range
  - Real-time filtering with result count
- **Resource Details**: View comprehensive information about each resource
- **Availability Windows**: See when resources are available for booking
- **Statistics Dashboard**: View overview statistics (total, active, out-of-service resources)

### Admin Features
- **Create Resources**: Add new resources to the catalogue
- **Edit Resources**: Update resource information
- **Delete Resources**: Remove resources from the system
- **Status Management**: Toggle resource status (ACTIVE/OUT_OF_SERVICE)
- **Advanced Dashboard**: Sortable and filterable resource management table
- **Bulk Operations**: Quick status changes and resource management

## Project Structure

### Backend (Java Spring Boot)

```
backend/
├── src/main/java/com/example/backend/
│   ├── model/
│   │   └── ResourceEntity.java       # Entity with validation
│   ├── repository/
│   │   └── ResourceRepository.java   # Data access layer
│   ├── service/
│   │   └── ResourceService.java      # Business logic
│   └── controller/
│       └── ResourceController.java   # REST API endpoints
└── pom.xml                            # Maven dependencies
```

### Frontend (React)

```
src/
├── pages/
│   ├── ResourceCatalogue.jsx         # Main catalogue view
│   ├── ResourceDetail.jsx            # Single resource detail
│   └── admin/
│       ├── ResourceDashboard.jsx     # Admin management dashboard
│       ├── AddResource.jsx           # Create new resource
│       ├── EditResource.jsx          # Edit existing resource
│       └── ResourceForm.jsx          # Reusable form component
├── styles/
│   ├── ResourceCatalogue.css         # Catalogue styling
│   ├── ResourceDetail.css            # Detail page styling
│   ├── ResourceDashboard.css         # Admin dashboard styling
│   ├── ResourceForm.css              # Form styling
│   └── AddEditResource.css           # Add/Edit page styling
└── api/
    └── axiosInstance.js              # HTTP client
```

## Backend API Endpoints

### Resource Management

#### Get All Resources (with optional filtering)
```
GET /resources
Query Parameters:
  - q: Search by name/description
  - type: Filter by type
  - status: Filter by status (ACTIVE/OUT_OF_SERVICE)
  - location: Filter by location
  - minCapacity: Minimum capacity filter
  - maxCapacity: Maximum capacity filter

Response: List<ResourceEntity>
```

#### Get Single Resource
```
GET /resources/{id}
Response: ResourceEntity
```

#### Create Resource (Admin only)
```
POST /resources
Body: {
  "name": "string (required)",
  "type": "string (required)",
  "capacity": "number (required, min: 1)",
  "location": "string (required)",
  "description": "string (optional)",
  "availability": ["string"],
  "status": "ACTIVE|OUT_OF_SERVICE"
}
Response: ResourceEntity
```

#### Update Resource (Admin only)
```
PUT /resources/{id}
Body: ResourceEntity (partial update)
Response: ResourceEntity
```

#### Delete Resource (Admin only)
```
DELETE /resources/{id}
Response: 200 OK
```

### Metadata & Statistics

#### Get All Resource Types
```
GET /resources/metadata/types
Response: List<String>
```

#### Get All Locations
```
GET /resources/metadata/locations
Response: List<String>
```

#### Get Resources by Type
```
GET /resources/by-type/{type}
Response: List<ResourceEntity>
```

#### Get Resources by Location
```
GET /resources/by-location/{location}
Response: List<ResourceEntity>
```

#### Get Resources by Status
```
GET /resources/by-status/{status}
Response: List<ResourceEntity>
```

#### Get Statistics
```
GET /resources/stats/summary
Response: {
  "total": number,
  "active": number,
  "outOfService": number
}
```

## Database Schema

### Resources Table
```sql
CREATE TABLE resources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resource_availability (
  resource_id BIGINT NOT NULL,
  availability VARCHAR(255),
  FOREIGN KEY (resource_id) REFERENCES resources(id)
);
```

## Data Model

### ResourceEntity
```java
{
  "id": Long,
  "name": String,           // Resource name (3-255 chars)
  "type": String,           // Type (e.g., "Lecture Hall")
  "capacity": Integer,      // Seating/usage capacity (≥1)
  "location": String,       // Physical location
  "description": String,    // Optional description
  "status": String,         // ACTIVE or OUT_OF_SERVICE
  "availability": String[], // Availability windows
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime
}
```

## Frontend Components

### ResourceCatalogue
Main browsing interface with:
- Statistics cards (total, active, out-of-service)
- Advanced filter panel
- Responsive grid layout
- Search functionality

**Props**: None (uses API directly)

### ResourceDetail
Displays detailed information about a resource:
- Full resource information
- Availability windows
- Status with warning if out of service
- Book button (disabled if out of service)

**Props**: 
- `id` from URL params

### ResourceDashboard
Admin management interface with:
- Sortable/filterable table
- Search functionality
- Status toggle buttons
- Edit/Delete options
- Resource statistics

**Props**: None (admin only, uses API directly)

### ResourceForm
Reusable form for creating/editing resources:
- Input validation
- Field-level error messages
- Responsive layout
- Loading state

**Props**:
- `initial`: Initial form values (optional)
- `onSubmit`: Callback function
- `submitLabel`: Button text

## Validation Rules

### Frontend Validation
- **Name**: Required, 3+ characters
- **Type**: Required, must be from predefined list
- **Capacity**: Required, positive integer, ≥1
- **Location**: Required, 2+ characters
- **Status**: Required, ACTIVE or OUT_OF_SERVICE

### Backend Validation (Spring Bean Validation)
- All fields validated on server side
- Comprehensive error messages
- HTTP 400 for invalid input
- HTTP 404 for not found resources
- HTTP 500 for server errors

## Security Features

### Role-Based Access Control
- **USER Role**: Can view resources and details
- **ADMIN Role**: Can manage (create, update, delete) resources
- **TECHNICIAN Role**: Can view resources

### Endpoints Protection
- All endpoints require authentication
- Resource modification endpoints require ADMIN role
- Read endpoints available to authenticated users

## Search & Filter Examples

### Search by Name
```
GET /resources?q=lecture%20hall%20a
```

### Filter by Type and Location
```
GET /resources?type=Lecture%20Hall&location=Building%201
```

### Find Large Meeting Rooms
```
GET /resources?type=Meeting%20Room&minCapacity=20&maxCapacity=50
```

### Active Resources Only
```
GET /resources?status=ACTIVE
```

### Combined Filters
```
GET /resources?q=lab&type=Laboratory&status=ACTIVE&minCapacity=10&location=Building%202
```

## Styling & UI/UX

### Design System
- **Color Palette**:
  - Primary: #667eea (purple)
  - Success: #10b981 (green)
  - Error: #ef4444 (red)
  - Neutral: #f1f5f9 (light)

- **Components**:
  - Cards with hover effects
  - Status badges with color coding
  - Gradient headers
  - Responsive grid layouts
  - Toast notifications

### Responsive Design
- Mobile: Single column layouts
- Tablet: 2-3 column grids
- Desktop: 3-4 column grids
- All components are fully responsive

## Testing Guide

### Manual Testing Checklist

#### User Features
- [ ] Browse all resources
- [ ] Search by resource name
- [ ] Filter by type
- [ ] Filter by location
- [ ] Filter by status
- [ ] Filter by capacity range
- [ ] View resource details
- [ ] See availability windows
- [ ] Check statistics
- [ ] Test responsive design on mobile/tablet

#### Admin Features
- [ ] Create new resource
- [ ] Edit existing resource
- [ ] Delete resource
- [ ] Toggle resource status
- [ ] Search in dashboard
- [ ] Sort by different fields
- [ ] Pagination (if implemented)

#### Edge Cases
- [ ] Empty catalogue
- [ ] Resource out of service
- [ ] No availability windows
- [ ] Special characters in names
- [ ] Very long descriptions
- [ ] Network errors
- [ ] Unauthorized access attempts

## Performance Optimization

### Frontend
- Component memoization
- Lazy loading for large lists
- Efficient state management
- CSS optimization with variables

### Backend
- Database indexing on frequently queried fields
- N+1 query prevention
- Response caching (future)
- Pagination support (future)

## Future Enhancements

1. **Pagination & Lazy Loading**
   - Load resources in batches
   - Infinite scroll support

2. **Booking Integration**
   - Link to booking system
   - Real-time availability
   - Calendar view

3. **Resource Images**
   - Upload resource photos
   - Gallery view

4. **Maintenance Tracking**
   - Maintenance schedules
   - Maintenance history

5. **Advanced Analytics**
   - Resource usage reports
   - Popular resources
   - Peak hours analysis

6. **Export Functionality**
   - Export to PDF/CSV
   - Resource reports

7. **Multi-language Support**
   - i18n integration

8. **Geolocation**
   - Map view of resource locations
   - Distance calculation

## Installation & Setup

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
npm install
npm start
```

### Environment Variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8080
```

## Troubleshooting

### Common Issues

**Issue**: CORS errors
- **Solution**: Ensure `@CrossOrigin` is present on controller or add to security config

**Issue**: 401 Unauthorized
- **Solution**: Ensure JWT token is valid and user has required role

**Issue**: 404 Not Found
- **Solution**: Check resource ID exists in database

**Issue**: Filters not working
- **Solution**: Clear browser cache, verify API response

## Support & Maintenance

For issues or improvements, please:
1. Check the troubleshooting guide
2. Review API endpoint documentation
3. Check network requests in browser dev tools
4. Contact development team

## Version History

- **v1.0.0** (Current): Initial release with full CRUD operations
  - Resource management (Create, Read, Update, Delete)
  - Advanced filtering and search
  - Admin dashboard
  - Statistics and metadata endpoints
  - Responsive UI design