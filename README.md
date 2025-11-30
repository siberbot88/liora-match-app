# Liora Match Platform

A comprehensive online and offline learning platform connecting educators and students for personalized education experiences.

## Overview

Liora Match is a full-stack educational technology platform built with modern web and mobile technologies. The platform facilitates connections between teachers and students, offering flexible learning options including online, offline, and hybrid class modes.

### Key Features

- **Multi-role Authentication**: Separate profiles and functionalities for students, teachers, and administrators
- **Advanced Matching System**: Algorithm-based teacher-student matching based on subjects, location, and availability
- **Flexible Class Modes**: Support for online, offline, and hybrid learning environments
- **Real-time Messaging**: Built-in messaging system for seamless communication
- **Booking Management**: Complete booking lifecycle from request to completion
- **Rating & Review System**: Transparent feedback mechanism for quality assurance

## Technology Stack

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: NestJS (TypeScript)
- **Database**: MySQL 8.0 with Prisma ORM
- **Cache Layer**: Redis 7
- **Authentication**: Firebase Admin SDK + JWT
- **Real-time**: Socket.io for WebSocket connections
- **Testing**: Jest + Supertest

### Mobile Application
- **Framework**: React Native 0.73
- **Platform**: Expo SDK 50
- **State Management**: TanStack Query + Zustand
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios with interceptors
- **Maps**: React Native Maps + Expo Location

### Landing Website
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
├──────────────────────┬──────────────────────────────────┤
│   Mobile App         │   Landing Website                │
│   (React Native)     │   (Next.js)                      │
└──────────────────────┴──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                           │
│                    (NestJS)                              │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────┐ ┌────────────────┐
    │   MySQL      │ │  Redis   │ │   Firebase     │
    │   Database   │ │  Cache   │ │   Auth         │
    └──────────────┘ └──────────┘ └────────────────┘
```

## Database Schema

The platform utilizes 11 primary models to manage the full educational ecosystem:

**User Management**
- User (base authentication)
- StudentProfile
- TeacherProfile

**Academic**
- Subject
- TeacherSubject (junction table)

**Scheduling**
- AvailabilitySlot
- Class
- ClassSession

**Transactions**
- ClassEnrollment
- Booking

**Communication**
- Message

## Prerequisites

Before setting up the development environment, ensure you have:

- Node.js >= 18.0.0
- MySQL 8.0 (local installation)
- Redis 7.0 (local installation)
- Git
- Firebase project with Admin SDK credentials

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/siberbot88/liora-match-app.git
cd liora-match-app
```

### 2. Backend Setup

```bash
cd backend/api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Place Firebase service account JSON file
# File should be named: firebase-service-account.json

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

The backend API will be available at `http://localhost:3000/api`

### 3. Mobile Application Setup

```bash
cd mobile

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Important: Use your machine's local IP address, not localhost

# Start Expo development server
npm start
```

Scan the QR code with Expo Go mobile application to run on device.

### 4. Website Setup

```bash
cd website

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

The website will be available at `http://localhost:3001`

## Configuration

### Backend Environment Variables

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/liora"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your_secure_random_string
JWT_EXPIRES_IN=7d

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Server
PORT=3000
NODE_ENV=development
```

### Mobile Environment Variables

```env
# API Endpoint (use local IP address for physical devices)
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api

# Firebase Client Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Website Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=Liora Match
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## Development

### Running Tests

**Backend**
```bash
cd backend/api

# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

**Mobile**
```bash
cd mobile

# Run tests
npm test

# Watch mode
npm test -- --watch
```

### Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format

# Type checking
npx tsc --noEmit
```

### Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# View database in browser
npx prisma studio
```

## API Documentation

### Authentication Endpoints

```
POST   /api/auth/register       Register new user
POST   /api/auth/login          User login
POST   /api/auth/firebase       Firebase authentication
GET    /api/auth/me             Get current user
POST   /api/auth/refresh        Refresh access token
```

### Teacher Endpoints

```
GET    /api/teachers            List all teachers (with filters)
GET    /api/teachers/:id        Get teacher profile
POST   /api/teachers            Create teacher profile
PUT    /api/teachers/:id        Update teacher profile
GET    /api/teachers/:id/classes    Get teacher's classes
```

### Class Endpoints

```
GET    /api/classes             List classes
GET    /api/classes/:id         Get class details
POST   /api/classes             Create new class
PUT    /api/classes/:id         Update class
DELETE /api/classes/:id         Delete class
POST   /api/classes/:id/enroll  Enroll in class
```

### Booking Endpoints

```
GET    /api/bookings            List user's bookings
GET    /api/bookings/:id        Get booking details
POST   /api/bookings            Create booking
PUT    /api/bookings/:id/confirm    Confirm booking
PUT    /api/bookings/:id/cancel     Cancel booking
```

## Continuous Integration

The project uses GitHub Actions for automated testing and quality assurance.

### Backend CI Pipeline

- Automated testing on push/pull requests
- MySQL and Redis service containers
- Prisma migrations verification
- Unit and E2E test execution

### Mobile CI Pipeline

- TypeScript compilation check
- Test suite execution
- Code quality verification

## Project Structure

```
liora-match-app/
├── backend/api/
│   ├── prisma/              Database schema and migrations
│   ├── src/
│   │   ├── auth/            Authentication module
│   │   ├── users/           User management
│   │   ├── teachers/        Teacher profiles
│   │   ├── students/        Student profiles
│   │   ├── classes/         Class management
│   │   ├── bookings/        Booking system
│   │   ├── messages/        Real-time messaging
│   │   ├── prisma/          Database service
│   │   ├── redis/           Cache service
│   │   └── firebase/        Firebase Admin SDK
│   └── test/                Test suites
├── mobile/
│   ├── src/
│   │   ├── api/             API client configuration
│   │   ├── navigation/      App navigation
│   │   ├── screens/         UI screens
│   │   ├── store/           State management
│   │   └── hooks/           Custom React hooks
│   └── App.tsx              Application entry point
├── website/
│   ├── app/                 Next.js app directory
│   ├── components/          Reusable components
│   └── public/              Static assets
└── .github/
    └── workflows/           CI/CD configurations
```

## Contributing

We welcome contributions from the community. Please follow these guidelines:

### Branch Naming Convention

```
feature/feature-name     New features
bugfix/bug-description   Bug fixes
hotfix/critical-fix      Critical production fixes
docs/documentation       Documentation updates
refactor/code-improvement Code refactoring
```

### Commit Message Format

```
type(scope): subject

feat(auth): implement JWT refresh token
fix(booking): resolve double booking issue
docs(readme): update installation guide
refactor(api): optimize database queries
test(teachers): add unit tests for profile service
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes with appropriate tests
4. Ensure all tests pass locally
5. Submit a pull request to `develop` branch
6. Wait for code review and address feedback

## Security

### Reporting Security Issues

Please report security vulnerabilities to: security@liora.com

Do not disclose security issues publicly until they have been addressed.

### Security Measures

- Environment variables for sensitive data
- JWT token-based authentication
- Firebase Admin SDK for user management
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- CORS configuration

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Support

For technical support or questions:
- Email: support@liora.com
- Documentation: [Project Wiki](https://github.com/siberbot88/liora-match-app/wiki)
- Issues: [GitHub Issues](https://github.com/siberbot88/liora-match-app/issues)

## Team

**Development Team**
- Backend Engineering
- Mobile Development
- Frontend Development
- DevOps & Infrastructure
- Quality Assurance

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Repository**: https://github.com/siberbot88/liora-match-app
