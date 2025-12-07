# Liora Match Platform

A comprehensive online learning platform connecting educators and students for personalized education experiences with flexible pricing models.

## Overview

Liora Match is a full-stack educational technology platform built with modern web and mobile technologies. The platform facilitates connections between teachers and students, offering various teaching types including online courses, private tutoring, and group lessons with sophisticated pricing models.

### Key Features

- **Multi-role System**: Separate dashboards for Students, Teachers, and Superadmins
- **Dual Pricing Models**: 
  - One-time purchase for Online Courses (lifetime access)
  - Per-session pricing for tutoring and lessons (per 60 minutes)
- **Teaching Types**:
  - 📚 Online Courses (structured curriculum with sections & lessons)
  - 🎯 Online Private (1-on-1 tutoring)
  - 👥 Public Lessons (group classes)
  - 📝 Take Home (assignments)
- **Admin Panel**: Comprehensive management dashboard with Ant Design + Refine
- **Real-time Features**: Built-in messaging and notifications
- **Payment Integration**: Midtrans payment gateway support
- **Progress Tracking**: Student progress, certificates, and achievements

## Technology Stack

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: NestJS (TypeScript)
- **Database**: MySQL 8.0 with Prisma ORM
- **Cache Layer**: Redis 7
- **Authentication**: Firebase Admin SDK + JWT
- **Real-time**: Socket.io for WebSocket connections
- **Payments**: Midtrans integration
- **File Storage**: Multer + Cloud storage
- **Testing**: Jest + Supertest

### Admin Panel (Web)
- **Framework**: Next.js 14 (App Router with Turbopack)
- **UI Framework**: Ant Design 5.x
- **Admin Framework**: Refine.dev 4.x
- **State Management**: React Hook Form + TanStack Query
- **Styling**: CSS-in-JS + Ant Design tokens
- **Language**: TypeScript
- **Deployment**: Vercel-ready

### Mobile Application
- **Framework**: React Native 0.73
- **Platform**: Expo SDK 50
- **State Management**: TanStack Query + Zustand
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios with interceptors
- **Maps**: React Native Maps + Expo Location
- **Payments**: Midtrans Mobile SDK

### Landing Website
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├───────────────────┬──────────────────────┬──────────────────────┤
│   Mobile App      │   Admin Panel        │   Landing Website    │
│   (React Native)  │   (Next.js+Refine)   │   (Next.js)          │
└───────────────────┴──────────────────────┴──────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
│                        (NestJS)                                  │
│   - RESTful APIs                                                 │
│   - WebSocket (Socket.io)                                        │
│   - JWT Authentication                                           │
│   - Rate Limiting                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┬──────────────┐
              ▼               ▼               ▼              ▼
      ┌──────────────┐ ┌──────────┐ ┌────────────────┐ ┌─────────┐
      │   MySQL      │ │  Redis   │ │   Firebase     │ │ Midtrans│
      │   Database   │ │  Cache   │ │   Auth         │ │ Payment │
      └──────────────┘ └──────────┘ └────────────────┘ └─────────┘
```

## Database Schema

The platform utilizes 15+ models to manage the full educational ecosystem:

**User Management**
- User (base authentication)
- StudentProfile
- TeacherProfile
- Admin

**Academic Content**
- Subject
- TeacherSubject (junction table)
- Class (with dual pricing: price + priceModel fields)
- ClassSection (for online courses)
- ClassLesson
- ClassResource
- ClassEnrollment

**Scheduling & Bookings**
- AvailabilitySlot
- Booking
- Session

**Transactions**
- Transaction
- Payment (Midtrans integration)

**Communication**
- Message
- Notification

**System**
- ActivityLog (for monitoring)
- Device (push notifications)

### Recent Schema Changes

**Dual Pricing Model (Dec 2025)**:
```prisma
enum PriceModel {
  LIFETIME_ACCESS  // One-time purchase (ONLINE_COURSE)
  PER_SESSION      // Price per 60 minutes (others)
}

model Class {
  // ... existing fields
  price         Float      @default(0)
  priceModel    PriceModel @default(PER_SESSION)
  teachingType  TeachingType
  // ...
}
```

## Prerequisites

Before setting up the development environment, ensure you have:

- Node.js >= 18.0.0
- MySQL 8.0 (local or remote)
- Redis 7.0 (local or cloud)
- Git
- Firebase project with Admin SDK credentials
- Midtrans account (for payments)

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
# Edit .env with your credentials

# Place Firebase service account JSON
# Filename: firebase-service-account.json

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

Backend API: `http://localhost:3333/api`  
Swagger Docs: `http://localhost:3333/api/docs`

### 3. Admin Panel Setup

```bash
cd website

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3333/api

# Start development server with Turbopack
npm run dev -- --turbo
```

Admin Panel: `http://localhost:3000/admin`

### 4. Mobile Application Setup

```bash
cd mobile

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# IMPORTANT: Use local IP (not localhost) for physical devices
# Example: EXPO_PUBLIC_API_URL=http://192.168.1.100:3333/api

# Start Expo development server
npm start
```

Scan QR code with Expo Go to run on device.

### 5. Landing Website Setup

```bash
cd website

# Same setup as admin panel
npm run dev
```

Landing: `http://localhost:3000`

## Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/liora"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Auth
JWT_SECRET=your_secure_random_string_min_32_chars
JWT_EXPIRES_IN=7d

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Midtrans
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false

# Server
PORT=3333
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DESTINATION=./uploads
```

### Admin Panel Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3333/api

# Site
NEXT_PUBLIC_SITE_NAME=Liora Admin Panel
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Mobile Environment Variables

```env
# API (use local IP for physical devices!)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3333/api

# Firebase Client
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Midtrans
EXPO_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
```

## Development

### Running Tests

**Backend**:
```bash
cd backend/api

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov

# Watch mode
npm run test:watch
```

**Mobile**:
```bash
cd mobile
npm test
```

### Code Quality

```bash
# Linting
npm run lint

# Format
npm run format

# Type check
npx tsc --noEmit
```

### Database Management

```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database
npx prisma studio
```

## API Documentation

### Core Endpoints

**Authentication**:
```
POST   /api/auth/register         Register new user
POST   /api/auth/login            User login
POST   /api/auth/firebase         Firebase authentication
GET    /api/auth/me               Get current user
POST   /api/auth/refresh          Refresh token
```

**Teachers**:
```
GET    /api/teachers              List teachers (filters: subject, jenjang)
GET    /api/teachers/:id          Teacher profile
POST   /api/teachers              Create profile (auth required)
PUT    /api/teachers/:id          Update profile
GET    /api/teachers/:id/classes  Teacher's classes
```

**Classes** (with Dual Pricing):
```
GET    /api/classes               List classes (filters: teachingType, jenjang, subject)
GET    /api/classes/:id           Class details (includes price & priceModel)
POST   /api/classes               Create class (auto-determines priceModel)
PUT    /api/classes/:id           Update class
DELETE /api/classes/:id           Delete class
POST   /api/classes/:id/enroll    Enroll student
GET    /api/classes/featured      Featured classes
GET    /api/classes/popular       Popular classes
```

**Bookings**:
```
GET    /api/bookings              User's bookings
GET    /api/bookings/:id          Booking details
POST   /api/bookings              Create booking
PUT    /api/bookings/:id/confirm  Confirm booking
PUT    /api/bookings/:id/cancel   Cancel booking
```

**Payments**:
```
POST   /api/payments/booking/:id  Initiate payment
POST   /api/payments/webhook      Midtrans webhook
GET    /api/payments/transaction/:id  Transaction status
```

**Admin** (Superadmin only):
```
GET    /api/admin/dashboard/stats     System statistics
GET    /api/admin/users               User management
GET    /api/admin/reports/revenue     Financial reports
GET    /api/admin/activity-logs       Activity monitoring
```

Full API documentation available at: `http://localhost:3333/api/docs` (Swagger UI)

## Admin Panel Features

### Dashboard
- System overview with key metrics
- User growth charts
- Revenue statistics
- Recent activity feed

### User Management
- Students list with filters
- Teachers list with verification status
- User details & moderation
- Ban/suspend accounts

### Class Management
- Create/edit classes with multi-step form
- **Pricing configuration** (dual model support)
- Curriculum builder (for online courses)
- Resources uploader
- Publish/unpublish classes

### Reports
- User activity reports with export
- Financial reports & analytics
- Transaction history
- Performance metrics

## Project Structure

```
liora-match-app/
├── backend/api/
│   ├── prisma/
│   │   ├── schema.prisma           Database schema
│   │   └── migrations/             Migration history
│   ├── src/
│   │   ├── auth/                   Authentication
│   │   ├── users/                  User mgmt
│   │   ├── teachers/               Teacher profiles
│   │   ├── students/               Student profiles
│   │   ├── classes/                Class mgmt (with pricing logic)
│   │   ├── class-sections/         Curriculum
│   │   ├── bookings/               Booking system
│   │   ├── payments/               Midtrans integration
│   │   ├── messages/               Real-time chat
│   │   ├── notifications/          Push notifications
│   │   ├── admin/                  Admin APIs
│   │   ├── reports/                Reporting engine
│   │   ├── prisma/                 DB service
│   │   ├── redis/                  Cache service
│   │   └── firebase/               Firebase SDK
│   └── test/                       Test suites
├── website/                        Admin Panel + Landing
│   ├── app/
│   │   ├── admin/
│   │   │   ├── (authenticated)/    Protected pages
│   │   │   │   ├── dashboard/      Dashboard
│   │   │   │   ├── classes/        Class mgmt
│   │   │   │   ├── teachers/       Teacher mgmt
│   │   │   │   ├── students/       Student mgmt
│   │   │   │   └── reports/        Reports
│   │   │   └── login/              Auth pages
│   │   └── (landing)/              Public website
│   ├── components/                 React components
│   └── providers/                  Refine providers
├── mobile/
│   ├── src/
│   │   ├── api/                    API client
│   │   ├── navigation/             Navigation config
│   │   ├── screens/
│   │   │   ├── student/            Student screens
│   │   │   ├── teacher/            Teacher screens
│   │   │   └── auth/               Authentication
│   │   ├── components/             UI components
│   │   ├── store/                  State management
│   │   └── hooks/                  Custom hooks
│   └── App.tsx                     App entry
└── .github/
    └── workflows/                  CI/CD pipelines
```

## Continuous Integration

GitHub Actions workflows for:
- Backend: Unit tests, E2E tests, Prisma migrations
- Frontend/Mobile: TypeScript checks, linting, tests
- Automated code quality checks

## Contributing

### Branch Naming
```
feature/short-description     New features
bugfix/issue-description      Bug fixes
hotfix/critical-fix           Critical fixes
docs/update-readme            Documentation
refactor/improve-code         Refactoring
```

### Commit Format
```
type(scope): description

Examples:
feat(pricing): implement dual pricing model
fix(booking): resolve double booking issue
docs(readme): update installation guide
refactor(classes): optimize query performance
test(auth): add JWT validation tests
```

### Pull Request Process
1. Fork repo → create feature branch from `develop`
2. Make changes with tests
3. Ensure all tests pass (`npm test`)
4. PR to `develop` branch
5. Code review & merge

## Security

### Best Practices
- Environment variables for sensitive data
- JWT token-based auth with refresh tokens
- Firebase Admin SDK for user management
- Rate limiting on all endpoints
- Input validation (class-validator)
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration
- HTTPS in production

### Reporting Issues
Email: security@liora.com  
Do not disclose publicly until patched.

## Deployment

### Backend (Production)
```bash
# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Start server
npm run start:prod
```

### Admin Panel (Vercel)
```bash
# Deploy to Vercel
vercel --prod

# Environment variables on Vercel dashboard
```

### Mobile (Expo EAS)
```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit
```

## Support

- **Email**: support@liora.com
- **Documentation**: [Wiki](https://github.com/siberbot88/liora-match-app/wiki)
- **Issues**: [GitHub Issues](https://github.com/siberbot88/liora-match-app/issues)

## Changelog

### Version 1.2.0 (December 2025)
- ✅ Implemented dual pricing model (LIFETIME_ACCESS vs PER_SESSION)
- ✅ Added comprehensive admin panel with Refine
- ✅ Integrated Midtrans payment gateway
- ✅ Added curriculum builder for online courses
- ✅ Real-time messaging system
- ✅ Activity logging & monitoring

### Version 1.1.0 (November 2025)
- ✅ Multi-step class creation wizard
- ✅ Teacher verification system
- ✅ Student profile management
- ✅ Booking system enhancements

### Version 1.0.0 (October 2025)
- ✅ Initial platform launch
- ✅ Basic authentication system
- ✅ Teacher & student profiles
- ✅ Class listing & browsing

## License

This project is proprietary and confidential.  
Unauthorized copying, distribution, or use is strictly prohibited.

## Team

**Development Team**:
- Backend Engineering (NestJS, Prisma, MySQL)
- Frontend Engineering (Next.js, React, Refine)
- Mobile Development (React Native, Expo)
- DevOps & Infrastructure (AWS, Vercel, CI/CD)
- Quality Assurance & Testing

---

**Version**: 1.2.0  
**Last Updated**: December 2025  
**Repository**: https://github.com/siberbot88/liora-match-app  
**Built with** ❤️ **by the Liora Team**
