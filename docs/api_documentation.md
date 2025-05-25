# MPF API Documentation

> **Complete API reference for the MPF Portfolio & Blog System**

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Public Endpoints](#public-endpoints)
4. [Protected Endpoints](#protected-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [File Upload](#file-upload)
9. [Webhooks](#webhooks)
10. [SDKs & Examples](#sdks--examples)

## 🎯 Overview

The MPF API provides RESTful endpoints for managing bookings, blog content, and administrative functions. The API is designed with **security**, **performance**, and **developer experience** as primary concerns.

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

### API Versioning
- **Current Version**: v1 (implicit)
- **Versioning Strategy**: URL versioning (future: `/api/v2/`)

### Response Format
All API responses follow a consistent JSON structure:

```json
{
  "success": true|false,
  "data": { ... },
  "message": "Human readable message",
  "errors": [ ... ],
  "meta": {
    "timestamp": "2025-05-25T10:30:00Z",
    "requestId": "req_abc123",
    "version": "1.0.0"
  }
}
```

## 🔐 Authentication

### Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as Database
    
    C->>A: POST /api/auth/login
    Note over C,A: {email, password}
    
    A->>D: Validate credentials
    D->>A: User data (if valid)
    
    A->>A: Generate JWT token
    A->>D: Update last_login
    
    A->>C: Login response
    Note over A,C: {token, user, expiresIn}
    
    C->>A: Protected request
    Note over C,A: Authorization: Bearer <token>
    
    A->>A: Verify JWT token
    A->>C: Protected data
```

### Login Endpoint

#### `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "admin@mpf.com",
  "password": "your_secure_password"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "siddartha",
      "email": "admin@mpf.com",
      "full_name": "Yerabati Siddartha",
      "role": "admin"
    },
    "expiresIn": "7d"
  },
  "message": "Login successful"
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [
    {
      "field": "credentials",
      "message": "Email or password is incorrect"
    }
  ]
}
```

### Token Usage

Include the JWT token in the Authorization header for protected endpoints:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     https://api.mpf.com/api/admin/dashboard
```

### Logout Endpoint

#### `POST /api/auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 🌐 Public Endpoints

### Blog Content

#### `GET /api/blog/posts`

Retrieve published blog posts with filtering and pagination.

**Query Parameters**:
- `category` (string): Filter by category slug
- `tag` (string): Filter by tag slug  
- `featured` (boolean): Show only featured posts
- `search` (string): Search in title and content
- `page` (integer): Page number (default: 1)
- `limit` (integer): Posts per page (default: 10, max: 50)

**Example Request**:
```bash
GET /api/blog/posts?category=quality-assurance&limit=5&page=1
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "post_id": 1,
        "title": "Advanced QA Strategies for 2025",
        "slug": "advanced-qa-strategies-2025",
        "excerpt": "Discover the latest trends in quality assurance...",
        "featured_image_url": "/uploads/images/qa-strategies.jpg",
        "category": {
          "name": "Quality Assurance",
          "slug": "quality-assurance",
          "color_hex": "#FF6B6B"
        },
        "tags": [
          {"name": "QA", "slug": "qa"},
          {"name": "Best Practices", "slug": "best-practices"}
        ],
        "reading_time_minutes": 8,
        "view_count": 1247,
        "published_at": "2025-05-20T09:00:00Z",
        "created_at": "2025-05-18T14:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_posts": 23,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

#### `GET /api/blog/posts/:slug`

Get a single blog post by its URL slug.

**Path Parameters**:
- `slug` (string): URL-friendly post identifier

**Example Request**:
```bash
GET /api/blog/posts/advanced-qa-strategies-2025
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "post": {
      "post_id": 1,
      "title": "Advanced QA Strategies for 2025",
      "slug": "advanced-qa-strategies-2025",
      "content": "Full HTML content of the blog post...",
      "excerpt": "Discover the latest trends...",
      "featured_image_url": "/uploads/images/qa-strategies.jpg",
      "category": {
        "category_id": 1,
        "name": "Quality Assurance",
        "slug": "quality-assurance",
        "color_hex": "#FF6B6B"
      },
      "tags": [
        {"tag_id": 1, "name": "QA", "slug": "qa"},
        {"tag_id": 2, "name": "Best Practices", "slug": "best-practices"}
      ],
      "seo_title": "Advanced QA Strategies for 2025 | MPF Blog",
      "seo_description": "Discover cutting-edge quality assurance strategies...",
      "reading_time_minutes": 8,
      "view_count": 1248,
      "published_at": "2025-05-20T09:00:00Z",
      "created_at": "2025-05-18T14:30:00Z",
      "updated_at": "2025-05-19T16:45:00Z"
    },
    "related_posts": [
      {
        "post_id": 2,
        "title": "Test Automation Best Practices",
        "slug": "test-automation-best-practices",
        "excerpt": "Learn how to implement effective test automation..."
      }
    ]
  }
}
```

**Note**: This endpoint automatically increments the `view_count` for analytics.

#### `GET /api/blog/categories`

Get all active blog categories.

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category_id": 1,
        "name": "Quality Assurance",
        "slug": "quality-assurance",
        "description": "QA practices and methodologies",
        "color_hex": "#FF6B6B",
        "post_count": 12
      },
      {
        "category_id": 2,
        "name": "Test Automation",
        "slug": "test-automation",
        "description": "Automated testing frameworks and tools",
        "color_hex": "#4ECDC4",
        "post_count": 8
      }
    ]
  }
}
```

#### `GET /api/blog/tags`

Get all blog tags with usage statistics.

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "tag_id": 1,
        "name": "Selenium",
        "slug": "selenium",
        "post_count": 5
      },
      {
        "tag_id": 2,
        "name": "Jenkins",
        "slug": "jenkins", 
        "post_count": 3
      }
    ]
  }
}
```

### Booking System

#### `POST /api/bookings`

Create a new booking consultation request.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "date": "2025-05-30",
  "time": "14:00",
  "timezone": "Asia/Kolkata",
  "topic": "QA Consultation",
  "message": "I need help setting up automated testing for my React application. Looking for guidance on best practices and tool selection.",
  "services": [
    {
      "serviceId": 1,
      "quantity": 1
    }
  ]
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "booking": {
      "booking_id": 123,
      "customer_name": "John Doe",
      "customer_email": "john.doe@example.com",
      "booking_subject": "QA Consultation",
      "booking_utc": "2025-05-30T08:30:00Z",
      "start_time_ist": "14:00:00",
      "end_time_ist": "15:00:00",
      "notes": "I need help setting up automated testing...",
      "booking_status": "Pending",
      "services": [
        {
          "service_name": "QA Consultation",
          "quantity": 1,
          "agreed_price": 150.00
        }
      ],
      "total_amount": 150.00,
      "created_at_utc": "2025-05-25T10:30:00Z"
    }
  },
  "message": "Booking created successfully. You will receive confirmation within 24 hours."
}
```

#### `GET /api/services`

Get all available consultation services.

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "service_id": 1,
        "service_name": "QA Consultation",
        "description": "Expert guidance on QA processes and best practices",
        "default_price": 150.00,
        "duration_minutes": 60
      },
      {
        "service_id": 2,
        "service_name": "Career Mentoring",
        "description": "One-on-one career guidance and advice",
        "default_price": 100.00,
        "duration_minutes": 60
      }
    ]
  }
}
```

## 🔒 Protected Endpoints (Admin Only)

All protected endpoints require authentication via JWT token.

### Blog Management

#### `POST /api/blog/posts`

Create a new blog post.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Getting Started with API Testing",
  "content": "<h2>Introduction</h2><p>API testing is crucial...</p>",
  "excerpt": "Learn the fundamentals of API testing and best practices.",
  "category_id": 1,
  "tags": [1, 3, 5],
  "status": "draft",
  "is_featured": false,
  "seo_title": "API Testing Guide | MPF Blog",
  "seo_description": "Complete guide to API testing fundamentals and best practices",
  "featured_image_url": "/uploads/images/api-testing.jpg"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "post": {
      "post_id": 25,
      "title": "Getting Started with API Testing",
      "slug": "getting-started-api-testing",
      "status": "draft",
      "reading_time_minutes": 6,
      "created_at": "2025-05-25T10:45:00Z"
    }
  },
  "message": "Blog post created successfully"
}
```

#### `PUT /api/blog/posts/:id`

Update an existing blog post.

**Path Parameters**:
- `id` (integer): Blog post ID

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Same as POST, all fields optional

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "post": {
      "post_id": 25,
      "title": "Getting Started with API Testing - Updated",
      "slug": "getting-started-api-testing",
      "status": "published",
      "published_at": "2025-05-25T11:00:00Z",
      "updated_at": "2025-05-25T11:00:00Z"
    }
  },
  "message": "Blog post updated successfully"
}
```

#### `DELETE /api/blog/posts/:id`

Delete a blog post.

**Path Parameters**:
- `id` (integer): Blog post ID

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

### Booking Management

#### `GET /api/bookings`

Get all bookings with filtering options.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status` (string): Filter by booking status
- `from_date` (date): Start date filter (YYYY-MM-DD)
- `to_date` (date): End date filter (YYYY-MM-DD)
- `page` (integer): Page number
- `limit` (integer): Items per page

**Example Request**:
```bash
GET /api/bookings?status=Pending&page=1&limit=20
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "booking_id": 123,
        "customer_name": "John Doe",
        "customer_email": "john.doe@example.com",
        "booking_subject": "QA Consultation",
        "booking_utc": "2025-05-30T08:30:00Z",
        "booking_status": "Pending",
        "services": ["QA Consultation"],
        "total_amount": 150.00,
        "created_at_utc": "2025-05-25T10:30:00Z",
        "notes": "Truncated notes for listing..."
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_bookings": 47,
      "has_next": true,
      "has_prev": false
    },
    "summary": {
      "total_pending": 12,
      "total_confirmed": 8,
      "total_completed": 25,
      "total_revenue": 12500.00
    }
  }
}
```

#### `PUT /api/bookings/:id`

Update booking status and details.

**Path Parameters**:
- `id` (integer): Booking ID

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "booking_status": "Confirmed",
  "notes": "Additional notes about the booking..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "booking": {
      "booking_id": 123,
      "booking_status": "Confirmed",
      "updated_at_utc": "2025-05-25T11:15:00Z"
    }
  },
  "message": "Booking updated successfully"
}
```

### Admin Dashboard

#### `GET /api/admin/dashboard`

Get dashboard statistics and analytics.

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "stats": {
      "bookings": {
        "total": 156,
        "this_month": 23,
        "pending": 8,
        "confirmed": 12,
        "completed": 3
      },
      "blog": {
        "total_posts": 45,
        "published_posts": 38,
        "draft_posts": 7,
        "total_views": 15420,
        "comments_pending": 5
      },
      "revenue": {
        "total": 45600.00,
        "this_month": 3200.00,
        "last_month": 2800.00,
        "average_booking_value": 292.31
      }
    },
    "recent_activity": [
      {
        "type": "booking",
        "message": "New booking from John Doe",
        "timestamp": "2025-05-25T10:30:00Z"
      },
      {
        "type": "comment", 
        "message": "New comment on 'API Testing Guide'",
        "timestamp": "2025-05-25T09:15:00Z"
      }
    ],
    "popular_content": [
      {
        "post_id": 12,
        "title": "Complete Guide to Selenium WebDriver",
        "views": 2340,
        "comments": 18
      }
    ]
  }
}
```

## 📤 File Upload

### Image Upload for Blog Posts

#### `POST /api/upload/image`

Upload images for blog posts with automatic optimization.

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
```
image: [Binary file data]
alt_text: "Description of the image"
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "image": {
      "url": "/uploads/images/blog-image-20250525-123456.jpg",
      "filename": "blog-image-20250525-123456.jpg",
      "size": 245760,
      "width": 1200,
      "height": 800,
      "alt_text": "Description of the image"
    }
  },
  "message": "Image uploaded successfully"
}
```

**File Constraints**:
- **Maximum Size**: 5MB
- **Allowed Types**: JPG, PNG, GIF, WebP
- **Automatic Processing**: Resize, optimize, generate thumbnails

## 📊 Data Models

### Booking Model
```javascript
{
  "booking_id": "integer (Primary Key)",
  "customer_name": "string (Required, Max: 255)",
  "customer_email": "string (Email format)",
  "booking_subject": "string (Required, Max: 255)",
  "booking_utc": "datetime (ISO 8601, UTC)",
  "start_time_ist": "time (HH:MM format)",
  "end_time_ist": "time (HH:MM format)",
  "notes": "text (Max: 5000 chars)",
  "booking_status": "enum ['Pending', 'Confirmed', 'Completed', 'Cancelled']",
  "revenue": "decimal (10,2)",
  "created_at_utc": "datetime (Auto-generated)",
  "updated_at_utc": "datetime (Auto-updated)"
}
```

### Blog Post Model
```javascript
{
  "post_id": "integer (Primary Key)",
  "title": "string (Required, Max: 255)",
  "slug": "string (Unique, URL-friendly)",
  "excerpt": "text (Max: 500 chars)",
  "content": "text (Required, HTML content)",
  "featured_image_url": "string (URL)",
  "category_id": "integer (Foreign Key)",
  "status": "enum ['draft', 'published', 'archived']",
  "is_featured": "boolean (Default: false)",
  "view_count": "integer (Default: 0)",
  "reading_time_minutes": "integer (Auto-calculated)",
  "seo_title": "string (Max: 60 chars)",
  "seo_description": "string (Max: 160 chars)",
  "published_at": "datetime (Set when status = published)",
  "created_at": "datetime (Auto-generated)",
  "updated_at": "datetime (Auto-updated)"
}
```

## ❌ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "VALIDATION_ERROR"
    }
  ],
  "meta": {
    "timestamp": "2025-05-25T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resources (e.g., slug already exists) |
| 422 | Unprocessable Entity | Business logic validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server errors |

### Common Error Scenarios

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email address is required",
      "code": "INVALID_EMAIL"
    },
    {
      "field": "booking_date", 
      "message": "Booking date must be in the future",
      "code": "INVALID_DATE"
    }
  ]
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Authentication required",
  "errors": [
    {
      "field": "authorization",
      "message": "Valid JWT token required",
      "code": "MISSING_TOKEN"
    }
  ]
}
```

#### Rate Limit Error (429)
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "errors": [
    {
      "field": "rate_limit",
      "message": "Too many requests. Try again in 15 minutes.",
      "code": "RATE_LIMIT_EXCEEDED"
    }
  ],
  "meta": {
    "retry_after": 900,
    "limit": 100,
    "remaining": 0,
    "reset_time": "2025-05-25T11:00:00Z"
  }
}
```

## 🚦 Rate Limiting

### Rate Limit Headers
All API responses include rate limiting information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1684825200
X-RateLimit-Window: 900
```

### Rate Limits by Endpoint Category

| Endpoint Category | Limit | Window | Notes |
|------------------|-------|--------|-------|
| Authentication | 5 requests | 15 minutes | Per IP address |
| Public Blog API | 100 requests | 15 minutes | Per IP address |
| Public Booking | 10 requests | 1 hour | Per IP address |
| Admin API | 1000 requests | 1 hour | Per authenticated user |
| File Upload | 20 requests | 1 hour | Per authenticated user |

## 🔗 Webhooks (Future Feature)

### Webhook Events
```json
{
  "event": "booking.created",
  "data": {
    "booking_id": 123,
    "customer_email": "john@example.com",
    "booking_status": "Pending"
  },
  "timestamp": "2025-05-25T10:30:00Z",
  "signature": "sha256=abc123..."
}
```

### Available Events
- `booking.created` - New booking submitted
- `booking.confirmed` - Booking status changed to confirmed
- `booking.completed` - Booking marked as completed
- `blog.published` - New blog post published
- `comment.created` - New comment submitted

## 🛠️ SDKs & Code Examples

### JavaScript/Node.js Example

```javascript
// MPF API Client Example
class MPFApiClient {
  constructor(baseUrl, token = null) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      this.token = data.data.token;
    }
    return data;
  }

  async createBlogPost(postData) {
    const response = await fetch(`${this.baseUrl}/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(postData)
    });
    
    return await response.json();
  }

  async getBlogPosts(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${this.baseUrl}/blog/posts?${queryParams}`);
    return await response.json();
  }

  async createBooking(bookingData) {
    const response = await fetch(`${this.baseUrl}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    return await response.json();
  }
}

// Usage Example
const client = new MPFApiClient('http://localhost:5000/api');

// Login as admin
await client.login('admin@mpf.com', 'password');

// Create a blog post
const newPost = await client.createBlogPost({
  title: 'New QA Insights',
  content: '<p>Quality assurance best practices...</p>',
  status: 'published'
});

// Get published blog posts
const posts = await client.getBlogPosts({
  status: 'published',
  limit: 10
});
```

### cURL Examples

#### Get Blog Posts
```bash
curl -X GET "http://localhost:5000/api/blog/posts?limit=5" \
  -H "Accept: application/json"
```

#### Create Booking
```bash
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2025-05-30",
    "time": "14:00",
    "topic": "QA Consultation",
    "message": "Need help with test automation",
    "services": [{"serviceId": 1, "quantity": 1}]
  }'
```

#### Admin Login
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mpf.com",
    "password": "your_password"
  }'
```

#### Create Blog Post (Admin)
```bash
curl -X POST "http://localhost:5000/api/blog/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "title": "Advanced Testing Strategies",
    "content": "<h2>Introduction</h2><p>Testing strategies...</p>",
    "category_id": 1,
    "status": "published"
  }'
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "success": true,
  "status": "healthy",
  "database": {"status": "healthy"},
  "uptime": 3600,
  "version": "1.0.0"
}
```

### API Documentation
- **Interactive Docs**: Available at `/docs` (Swagger UI)
- **OpenAPI Spec**: Available at `/api-spec.json`
- **Postman Collection**: Available in project repository

---

## 📝 Summary

The MPF API provides comprehensive endpoints for managing both booking consultations and blog content. The API emphasizes **security**, **performance**, and **ease of use**, with consistent response formats, comprehensive error handling, and robust authentication.

### Key Features
- ✅ **RESTful Design** - Standard HTTP methods and status codes
- ✅ **JWT Authentication** - Secure admin access
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **Input Validation** - Comprehensive data validation
- ✅ **Error Handling** - Detailed error responses
- ✅ **File Upload** - Image upload with optimization
- ✅ **Pagination** - Efficient data retrieval
- ✅ **Search & Filtering** - Flexible data querying

### Next Steps
1. Set up API client libraries for common languages
2. Implement webhook system for real-time notifications
3. Add API versioning for future enhancements
4. Create comprehensive test suite
5. Set up API monitoring and analytics

*This documentation is automatically updated with each API change. For the most current version, refer to the interactive documentation at `/docs`.*

---

**API Version**: 1.0.0  
**Last Updated**: May 2025  
**Next Review**: After webhook implementation