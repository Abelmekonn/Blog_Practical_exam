# 🚀 Full Stack Blog Platform

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> **Enterprise-grade full stack blog platform built with modern technologies and best practices. Features clean architecture, comprehensive testing, and professional documentation.**

## 🖼️ Live Preview

![Blog Platform Landing Page](https://res.cloudinary.com/detxtubji/image/upload/v1751548413/screencapture-localhost-5173-2025-07-03-16_11_27_zanzsi.png)

*Modern, responsive blog platform with dark mode support and intuitive user interface*

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🔒 Security](#-security)
- [📁 Project Structure](#-project-structure)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## 🎯 Overview

A comprehensive full stack blog platform that demonstrates enterprise-level software development practices. The project consists of a robust NestJS backend API and a modern React frontend, both built with TypeScript and following industry best practices.

### 🎯 **Key Highlights**

- **🏗️ Clean Architecture**: Backend implements Clean Architecture with CQRS patterns
- **🎨 Modern Frontend**: React 19 with feature-based architecture and Redux Toolkit
- **🔐 Secure Authentication**: JWT-based auth with protected routes and ownership guards
- **📚 Professional Documentation**: Comprehensive Swagger API docs and technical documentation
- **🧪 Testing Excellence**: Full test coverage with unit, integration, and E2E tests
- **🐳 Docker Ready**: Complete containerization for easy deployment
- **⚡ Performance Optimized**: Best practices for scalability and performance

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- User registration and login with JWT tokens
- Protected routes with role-based access control
- Ownership guards for resource protection
- Secure password hashing with bcrypt
- Profile management and user settings

### 📝 **Content Management**
- **Posts**: Full CRUD operations with rich text content
- **Comments**: Nested commenting system with real-time updates  
- **Media Upload**: Image upload integration with Cloudinary
- **Search & Filtering**: Advanced post filtering and search capabilities
- **Categories & Tags**: Organized content classification

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Theme switching with persistent preferences
- **Real-time Updates**: Live comment updates and notifications
- **Loading States**: Comprehensive loading and error handling
- **SEO Optimized**: Meta tags and structured data

### 🛡️ **Quality & Security**
- Input validation and sanitization
- XSS protection and security headers
- Rate limiting and DDoS protection
- Comprehensive error handling
- Audit logging and monitoring

---

## 🏗️ Architecture

### **Full Stack Architecture**
```
┌─────────────────────────────────────┐
│         React Frontend             │  ← Components, Pages, Redux
│      (Feature-Based Architecture)   │
├─────────────────────────────────────┤
│             REST API                │  ← HTTP/JSON Communication
├─────────────────────────────────────┤
│         NestJS Backend             │  ← Controllers, Services, Guards
│      (Clean Architecture + CQRS)    │
├─────────────────────────────────────┤
│        PostgreSQL Database          │  ← Data Persistence
└─────────────────────────────────────┘
```

### **Backend Architecture Layers**
- **Presentation**: Controllers, DTOs, Guards, Pipes
- **Application**: Commands, Queries, Handlers, Use Cases
- **Domain**: Entities, Repositories, Business Logic
- **Infrastructure**: Database, External Services, ORM

### **Frontend Architecture**
- **Feature-Based**: Organized by business domains (auth, posts, comments)
- **Redux Toolkit**: Centralized state management with RTK Query
- **Component Hierarchy**: Layout → Pages → Features → Common → UI

---

## 🛠️ Tech Stack

### **Backend (NestJS)**
| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | NestJS | Node.js framework with TypeScript |
| **Database** | PostgreSQL | Primary data storage |
| **ORM** | TypeORM | Database abstraction and migrations |
| **Authentication** | JWT + Passport | Secure token-based auth |
| **Validation** | class-validator | DTO validation and transformation |
| **Documentation** | Swagger/OpenAPI | Interactive API documentation |
| **File Upload** | Cloudinary | Image storage and optimization |
| **Testing** | Jest + Supertest | Unit and integration testing |

### **Frontend (React)**
| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 19 | User interface library |
| **Build Tool** | Vite | Fast development and building |
| **State Management** | Redux Toolkit | Global state management |
| **Routing** | React Router v7 | Client-side routing |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Forms** | React Hook Form + Zod | Form handling and validation |
| **HTTP Client** | Axios | API communication |
| **Testing** | Vitest + Testing Library | Component and unit testing |

### **DevOps & Tools**
- **Docker & Docker Compose**: Containerization
- **ESLint & Prettier**: Code quality and formatting
- **GitHub Actions**: CI/CD pipeline (ready for setup)
- **PostgreSQL**: Production database

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** ≥ 18.x
- **Docker** & **Docker Compose**
- **Git**

### **🐳 Option 1: Docker Setup (Recommended)**

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd Blog
```

2. **Backend Setup**
```bash
cd blog_backend

# Copy environment template
cp .env.example .env

# Start backend with database
docker-compose up --build -d

# Verify backend is running
curl http://localhost:3000/api/docs
```

3. **Frontend Setup**
```bash
cd ../blog_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

4. **Access the application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Database**: localhost:5433 (postgres/postgres)

### **⚡ Option 2: Manual Setup**

#### **Backend Setup**
```bash
cd blog_backend

# Install dependencies
npm install

# Setup PostgreSQL database
createdb blog

# Configure environment
cp .env.example .env
# Update .env with your database credentials

# Start development server
npm run start:dev

# Optional: Seed demo data
npm run seed:demo
```

#### **Frontend Setup**
```bash
cd blog_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **🎯 Quick Verification**

1. **✅ Backend Health**: Visit http://localhost:3000 
2. **✅ API Documentation**: Check http://localhost:3000/api/docs
3. **✅ Frontend**: Access http://localhost:5173
4. **✅ Database**: Connect to localhost:5433 with postgres/postgres
5. **✅ Create Account**: Register a new user via the frontend
6. **✅ Create Post**: Test the full workflow

---

## 📖 API Documentation

### **🌐 Interactive Documentation**
- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI Specification**: Complete API schema with examples
- **Authentication Testing**: Built-in JWT token management
- **Request/Response Examples**: Real data samples for every endpoint

### **📋 API Endpoints Overview**

#### **🔐 Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create new user account |
| `POST` | `/auth/login` | User authentication |
| `GET` | `/auth/profile` | Get current user profile |

#### **📝 Posts Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/posts` | List all posts with filtering |
| `GET` | `/posts/:id` | Get specific post with comments |
| `POST` | `/posts` | Create new blog post |
| `PUT` | `/posts/:id` | Update existing post |
| `DELETE` | `/posts/:id` | Delete post |

#### **💬 Comments System**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/comments/post/:postId` | Get all comments for a post |
| `POST` | `/comments` | Add comment to a post |
| `DELETE` | `/comments/:id` | Delete comment |

#### **👥 User Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/:id` | Get user profile by ID |
| `PUT` | `/users/:id` | Update user profile |

### **🔑 Authentication Usage**
```javascript
// 1. Register/Login to get JWT token
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { accessToken } = await response.json();

// 2. Use token for protected endpoints
const posts = await fetch('/posts', {
  headers: { 
    'Authorization': `Bearer ${accessToken}` 
  }
});
```

---

## 🧪 Testing

### **Backend Testing**
```bash
cd blog_backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Specific feature tests
npm run test:auth
npm run test:posts
npm run test:comments
```

### **Frontend Testing**
```bash
cd blog_frontend

# Unit and component tests
npm run test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch

# UI test runner
npm run test:ui
```

### **Test Architecture**

#### **Backend Test Strategy**
- **Unit Tests**: Service classes, utilities, and business logic
- **Integration Tests**: Repository layer and database interactions
- **E2E Tests**: Complete API workflows and authentication flows
- **Test Coverage**: >90% coverage target

#### **Frontend Test Strategy**
- **Component Tests**: Individual component behavior
- **Integration Tests**: Feature-level testing with Redux
- **Hook Tests**: Custom hooks and state management
- **User Interaction Tests**: Complete user workflows

---

## 🔒 Security

### **Backend Security**
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: class-validator for all DTOs
- **SQL Injection Prevention**: TypeORM parameterized queries
- **Rate Limiting**: Protection against DDoS attacks
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet Integration**: Security headers middleware

### **Frontend Security**
- **XSS Prevention**: Sanitized inputs and outputs
- **CSRF Protection**: Token-based request validation
- **Secure Storage**: JWT tokens in httpOnly cookies (recommended)
- **Input Validation**: Zod schemas for form validation
- **Route Protection**: Private routes with auth guards

### **General Security**
- **Environment Variables**: Sensitive data in .env files
- **HTTPS Ready**: SSL/TLS configuration support
- **Docker Security**: Non-root user containers
- **Database Security**: Parameterized queries and connection pooling

---

## 📁 Project Structure

```
Blog/
├── blog_backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── application/          # CQRS Commands & Queries
│   │   │   ├── auth/            # Authentication logic
│   │   │   ├── posts/           # Post management
│   │   │   └── comments/        # Comment system
│   │   ├── domain/              # Domain entities & interfaces
│   │   ├── infrastructure/      # Database & external services
│   │   ├── presentation/        # Controllers & DTOs
│   │   └── core/               # Shared utilities & base classes
│   ├── test/                    # E2E and integration tests
│   ├── docker-compose.yml       # Database & services
│   └── Dockerfile              # Backend container
│
├── blog_frontend/               # React Frontend App
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/         # Shared components
│   │   │   ├── features/       # Feature-specific components
│   │   │   └── layout/         # Layout components
│   │   ├── features/           # Business logic by domain
│   │   │   ├── auth/           # Authentication
│   │   │   ├── posts/          # Post management
│   │   │   └── comments/       # Comment system
│   │   ├── pages/              # Route components
│   │   ├── store/              # Redux store & slices
│   │   └── utils/              # Shared utilities
│   └── public/                 # Static assets
│
└── README.MD                   # This file
```

### **Backend Architecture Details**
- **Clean Architecture**: Separation of concerns with clear layer boundaries
- **CQRS Pattern**: Command and Query separation for scalability
- **Repository Pattern**: Data access abstraction
- **Domain-Driven Design**: Business logic in domain layer

### **Frontend Architecture Details**
- **Feature-Based**: Organized by business domains, not technical layers
- **Component Hierarchy**: From layout to UI components
- **Redux Toolkit**: Modern Redux with RTK Query
- **Atomic Design**: Components organized by complexity

---

## 📦 Deployment

### **🐳 Docker Deployment (Production)**

1. **Build production images**
```bash
# Backend
cd blog_backend
docker build -t blog-backend .

# Frontend (add Dockerfile to frontend)
cd blog_frontend
npm run build
```

2. **Production docker-compose**
```yaml
# Use production environment variables
# Configure reverse proxy (nginx)
# Set up SSL certificates
# Configure database backups
```

### **☁️ Cloud Deployment Options**

#### **Backend Deployment**
- **Heroku**: Easy deployment with PostgreSQL addon
- **AWS**: ECS/Fargate with RDS PostgreSQL
- **DigitalOcean**: App Platform with managed database
- **Railway**: Modern deployment platform

#### **Frontend Deployment**
- **Vercel**: Optimized for React applications
- **Netlify**: JAMstack deployment with CDN
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Firebase Hosting**: Google's hosting platform

### **🔧 Environment Configuration**

#### **Backend Environment Variables**
```env
NODE_ENV=production
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=blog
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### **Frontend Environment Variables**
```env
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
VITE_APP_NAME=Blog Platform
```

---

## 🤝 Contributing

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with proper tests
4. **Run test suite**: Ensure all tests pass
5. **Commit changes**: Follow conventional commit format
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**: Describe changes and testing

### **Code Standards**

#### **Backend**
- **TypeScript**: Strict typing, no `any` types
- **ESLint**: Follow NestJS conventions
- **Testing**: Maintain >90% coverage
- **Documentation**: Update Swagger docs for API changes

#### **Frontend**
- **TypeScript**: Proper typing for all components
- **Component Design**: Single responsibility principle
- **State Management**: Use Redux for global state only
- **Styling**: Follow Tailwind CSS conventions

### **Commit Convention**
```
feat: add user profile editing
fix: resolve authentication timeout issue
docs: update API documentation
test: add integration tests for posts
refactor: optimize database queries
```

### **Pull Request Template**
- **Description**: What changes were made and why
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes
- **Breaking Changes**: Any backward compatibility issues

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NestJS Team**: For the amazing framework and documentation
- **React Team**: For the powerful UI library
- **TypeScript Team**: For enhanced developer experience
- **Open Source Community**: For the incredible tools and libraries

---

## 📞 Support

For questions, issues, or contributions:

- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: your-email@example.com
- **Documentation**: Check the comprehensive docs in each project folder

---

**Happy Coding! 🚀**
