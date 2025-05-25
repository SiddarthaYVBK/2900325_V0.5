# MPF Portfolio & Blog System

> **Personal Portfolio with Integrated Blogging Platform**  
> Built by Yerabati Venkata Balakrishna Siddartha - QA Manager & Tech Consultant

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)](https://postgresql.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey)](https://expressjs.com/)

## 🎯 Project Overview

MPF is a sophisticated personal portfolio website with integrated booking system and blog platform. The system manages client bookings with advanced UTC/IST time handling, revenue tracking, and provides a content management system for professional blogging.

### ✨ Key Features
- 📅 **Advanced Booking System** - UTC/IST time zones, revenue tracking, service management
- ✍️ **Personal Blog Platform** - Single-author CMS with rich text editing
- 📊 **Admin Dashboard** - Booking analytics, content management, FAQ generation
- 🔐 **Secure Authentication** - JWT-based admin access
- 📱 **Responsive Design** - Mobile-first React frontend
- 🚀 **Performance Optimized** - Connection pooling, image optimization

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[Portfolio Pages]
        B[Blog Interface]  
        C[Booking Form]
        D[Admin Dashboard]
    end
    
    subgraph "Backend (Express.js)"
        E[API Routes]
        F[Authentication]
        G[File Upload]
        H[Business Logic]
    end
    
    subgraph "Database (PostgreSQL)"
        I[Booking System]
        J[Blog Content]
        K[User Management]
        L[Analytics]
    end
    
    A --> E
    B --> E
    C --> E
    D --> F
    E --> I
    E --> J
    F --> K
    H --> L
```

## 🗄️ Database Schema

### Complete Entity Relationship Diagram

```mermaid
erDiagram
    %% === BOOKING SYSTEM (Core Business Logic) ===
    bookings {
        int booking_id PK
        varchar customer_name
        varchar customer_email
        varchar booking_subject
        timestamptz booking_utc "UTC timestamp"
        time start_time_ist "IST reference"
        time end_time_ist "IST reference"
        text notes "Service categorization data"
        varchar booking_status "Manual updates"
        decimal revenue
        timestamptz created_at_utc
        timestamptz updated_at_utc
    }

    services {
        int service_id PK
        varchar service_name UK
        text description
        decimal default_price
        timestamptz created_at_utc
        timestamptz updated_at_utc
    }

    booking_services {
        int booking_service_id PK
        int booking_id FK
        int service_id FK
        int quantity
        decimal agreed_price
        timestamptz created_at_utc
        timestamptz updated_at_utc
    }

    revenue_records {
        int revenue_record_id PK
        int booking_id FK "UNIQUE"
        decimal revenue_amount
        timestamptz payment_date_utc
        varchar payment_method
        varchar transaction_id
        text notes
        timestamptz created_at_utc
    }

    %% === BLOG SYSTEM (Content Management) ===
    admin_user {
        int user_id PK
        varchar username "siddartha"
        varchar email UK
        varchar password_hash
        varchar full_name
        text profile_image_url
        timestamp last_login
        timestamp created_at
    }

    blog_posts {
        int post_id PK
        varchar title
        varchar slug UK
        text excerpt
        text content
        text featured_image_url
        int category_id FK
        varchar status "draft/published/archived"
        boolean is_featured
        int view_count
        int reading_time_minutes
        varchar seo_title
        varchar seo_description
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }

    blog_categories {
        int category_id PK
        varchar name UK
        varchar slug UK
        text description
        varchar color_hex
        boolean is_active
        timestamp created_at
    }

    blog_tags {
        int tag_id PK
        varchar name UK
        varchar slug UK
        timestamp created_at
    }

    blog_post_tags {
        int post_tag_id PK
        int post_id FK
        int tag_id FK
    }

    blog_comments {
        int comment_id PK
        int post_id FK
        int parent_comment_id FK "Nested replies"
        varchar author_name
        varchar author_email
        text content
        varchar status "pending/approved/rejected"
        inet ip_address
        timestamp created_at
    }

    %% === KNOWLEDGE BASE ===
    faqs {
        int faq_id PK
        varchar question
        text answer
        varchar category "From booking patterns"
        int booking_count "FAQ inspiration source"
        boolean is_published
        int view_count
        timestamp created_at
    }

    %% === RELATIONSHIPS ===
    bookings ||--o{ booking_services : "includes"
    services ||--o{ booking_services : "booked_as"
    bookings ||--o| revenue_records : "generates"
    bookings ||--o{ faqs : "inspires"
    
    admin_user ||--o{ blog_posts : "authors"
    blog_categories ||--o{ blog_posts : "categorizes"
    blog_posts ||--o{ blog_post_tags : "tagged_with"
    blog_tags ||--o{ blog_post_tags : "applied_to"
    blog_posts ||--o{ blog_comments : "receives"
    blog_comments ||--o{ blog_comments : "replies_to"
```

### Key Design Decisions

#### 🎯 **Single-Author Blog System**
- **Decision**: One admin user (you) authors all blog content
- **Rationale**: Personal portfolio - maintains consistent voice and quality
- **Benefit**: Simplified permissions, focused content strategy

#### ⏰ **Sophisticated Time Handling**  
- **UTC Storage**: `booking_utc` for accurate cross-timezone scheduling
- **IST Reference**: `start_time_ist` / `end_time_ist` for local context
- **Business Logic**: Supports international clients with timezone clarity

#### 💡 **FAQ Generation from Bookings**
- **Innovation**: Analyze `booking.notes` to identify common patterns
- **Automation**: Build knowledge base from real client questions
- **Scalability**: Reduce repetitive consultation requests

## 🛠️ Technology Stack

### Frontend
- **React 19.x** - Modern UI framework with hooks
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **Context API** - State management
- **CKEditor** - Rich text editing for blog posts

### Backend  
- **Node.js 18.x** - JavaScript runtime
- **Express.js 4.x** - Web application framework
- **PostgreSQL 15.x** - Primary database
- **JWT** - Authentication & authorization
- **Multer** - File upload handling
- **Joi** - Input validation

### DevOps & Tools
- **Raw SQL** - Direct database queries (no ORM)
- **Custom Migrations** - Database version control
- **Winston Logging** - Comprehensive logging system
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL 15.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SiddarthaYVBK/mpf-portfolio.git
   cd mpf-portfolio
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Configure your database credentials
   nano server/.env
   ```

4. **Database setup**
   ```bash
   # Run migrations
   cd server
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Start backend (Terminal 1)
   cd server
   npm run dev
   
   # Start frontend (Terminal 2)
   cd ..
   npm start
   ```

6. **Access the application**
   - **Portfolio**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin
   - **API Health**: http://localhost:5000/health

## 📚 API Documentation

### Authentication Flow
```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as Database
    
    C->>A: POST /api/auth/login
    A->>D: Validate credentials
    D->>A: User data
    A->>A: Generate JWT token
    A->>C: Return token + user info
    
    C->>A: GET /api/admin/* (with token)
    A->>A: Verify JWT token
    A->>D: Fetch protected data
    D->>A: Return data
    A->>C: Protected response
```

### Core API Endpoints

#### Public Endpoints
```bash
# Blog content (public access)
GET  /api/blog/posts              # List published posts
GET  /api/blog/posts/:slug        # Get single post
GET  /api/blog/categories         # List categories
GET  /api/blog/tags              # List tags

# Booking system (public access)  
POST /api/bookings               # Create new booking
GET  /api/services               # List available services
```

#### Protected Endpoints (Admin Only)
```bash
# Authentication
POST /api/auth/login             # Admin login
POST /api/auth/logout            # Logout
GET  /api/auth/profile           # Get current user

# Blog management
POST   /api/blog/posts           # Create new post
PUT    /api/blog/posts/:id       # Update post
DELETE /api/blog/posts/:id       # Delete post
POST   /api/blog/upload          # Upload images

# Booking management
GET  /api/bookings               # List all bookings
PUT  /api/bookings/:id           # Update booking status
GET  /api/admin/dashboard        # Dashboard analytics
```

## 📊 Admin Dashboard Features

### Booking Management
```mermaid
graph TD
    A[Booking Dashboard] --> B[Recent Bookings]
    A --> C[Status Management]
    A --> D[Revenue Tracking]
    A --> E[Service Analytics]
    
    B --> F[Priority Assignment]
    B --> G[Status Updates]
    C --> H[Pending → Confirmed]
    C --> I[Confirmed → Completed]
    D --> J[Payment Tracking]
    D --> K[Revenue Reports]
    E --> L[Popular Services]
    E --> M[FAQ Opportunities]
```

### Content Management
- ✍️ **Blog Post Editor** - Rich text editing with image uploads
- 📂 **Category Management** - Organize content by topics
- 🏷️ **Tag System** - Flexible content tagging
- 💬 **Comment Moderation** - Approve/reject visitor comments
- 📈 **Analytics Dashboard** - Post views, engagement metrics

### Business Intelligence
- 📊 **Booking Trends** - Identify popular services and time slots
- 💰 **Revenue Analysis** - Track income patterns and growth
- ❓ **FAQ Generation** - Build knowledge base from booking inquiries
- 📝 **Message Analysis** - Categorize client requests automatically

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** - Secure session management
- **Password Hashing** - bcrypt encryption
- **Role-Based Access** - Admin-only protected routes
- **Rate Limiting** - API abuse prevention

### Data Protection
- **Input Validation** - Joi schema validation
- **SQL Injection Prevention** - Parameterized queries
- **CORS Configuration** - Cross-origin request control
- **Helmet Security** - HTTP header protection

### File Upload Security
- **File Type Validation** - Allowed extensions only
- **File Size Limits** - Prevent large uploads
- **Secure Storage** - Protected upload directory
- **Image Processing** - Automatic optimization

## 📁 Project Structure

```
mpf/
├── 📄 README.md                 # This file
├── 📄 package.json              # Frontend dependencies
├── 📁 public/                   # Static assets
├── 📁 src/                      # React frontend
│   ├── 📁 api/                  # API client
│   ├── 📁 components/           # React components
│   ├── 📁 pages/                # Page components
│   ├── 📁 context/              # React context
│   ├── 📁 hooks/                # Custom hooks
│   ├── 📁 services/             # Business logic
│   └── 📁 data/                 # Static data files
├── 📁 server/                   # Backend API
│   ├── 📄 index.js              # Express server
│   ├── 📄 config.js             # Configuration
│   ├── 📄 db.js                 # Database connection
│   ├── 📁 models/               # Database models
│   ├── 📁 routes/               # API routes
│   ├── 📁 middleware/           # Express middleware
│   ├── 📁 migrations/           # Database migrations
│   ├── 📁 utils/                # Utility functions
│   └── 📁 uploads/              # File storage
├── 📁 docs/                     # Documentation
│   ├── 📄 database-design.md    # Database documentation
│   ├── 📄 api-documentation.md  # API reference
│   └── 📄 deployment-guide.md   # Deployment instructions
└── 📁 tests/                    # Test suites
    ├── 📁 unit/                 # Unit tests
    ├── 📁 integration/          # Integration tests
    └── 📁 e2e/                  # End-to-end tests
```

## 🚦 Development Workflow

### Database Migrations
```mermaid
graph LR
    A[Code Changes] --> B[Create Migration]
    B --> C[Test Locally]
    C --> D[Review & Commit]
    D --> E[Deploy to Staging]
    E --> F[Run Migration]
    F --> G[Verify Changes]
    G --> H[Deploy to Production]
```

### Content Publishing Flow
```mermaid
graph TD
    A[Write Blog Post] --> B[Save as Draft]
    B --> C[Preview & Edit]
    C --> D[Add SEO Data]
    D --> E[Upload Images]
    E --> F[Publish Post]
    F --> G[Monitor Analytics]
    G --> H[Respond to Comments]
```

## 📈 Performance Considerations

### Database Optimization
- **Connection Pooling** - Efficient database connections
- **Strategic Indexing** - Optimized query performance
- **Query Optimization** - Hand-tuned SQL queries
- **Raw SQL Approach** - Maximum performance control

### Frontend Performance
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Automatic image compression
- **Caching Strategy** - Smart data caching
- **Bundle Optimization** - Minimized JavaScript bundles

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

### Reporting Issues
- Use GitHub Issues for bug reports
- Include steps to reproduce
- Provide environment details

### Feature Requests
- Discuss major changes via GitHub Discussions
- Consider backward compatibility
- Focus on personal portfolio use cases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

**Yerabati Venkata Balakrishna Siddartha**
- 🎯 QA Manager & Tech Consultant
- 💼 14+ years in Software Testing & Quality Assurance
- 🚀 Ex-Flynas, Specialized in DevOps & Test Automation
- 📧 [Contact for Consultations](mailto:your-email@domain.com)

### Professional Services
- 🔍 **QA Consultation** - Process optimization & best practices
- 🤖 **Test Automation** - Framework setup & implementation  
- 💼 **Career Mentoring** - Tech career guidance & mock interviews
- ⚙️ **DevOps Implementation** - CI/CD pipeline setup

---

**⭐ Star this repository if you find it helpful!**

*Last updated: May 2025*