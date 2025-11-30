# Liora Platform

Platform pembelajaran yang menghubungkan Guru dan Murid untuk kelas online/offline.

## 🏗️ Architecture

```
liora/
├── backend/api/        # NestJS + Prisma + MySQL + Redis + Firebase
├── mobile/             # React Native + Expo
└── website/            # Next.js 14 Landing Page
```

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: MySQL (Prisma ORM)
- **Cache**: Redis
- **Auth**: Firebase Admin SDK + JWT
- **WebSocket**: Socket.io

### Mobile
- **Framework**: React Native + Expo SDK 50
- **State**: TanStack Query + Zustand
- **Navigation**: React Navigation
- **Real-time**: Socket.io Client

### Website
- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Language**: TypeScript

## 📦 Prerequisites

- Node.js >= 18.x
- MySQL (local service)
- Redis (local service)
- Git
- Firebase Project with Service Account

## 🛠️ Setup

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

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup Firebase
# Place firebase-service-account.json in backend/api/

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start server
npm run start:dev
```

Backend will run at `http://localhost:3000/api`

### 3. Mobile Setup

```bash
cd mobile

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API URL (use local IP, not localhost!)

# Start Expo
npm start
```

Scan QR code with Expo Go app.

### 4. Website Setup

```bash
cd website

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start dev server
npm run dev
```

Website will run at `http://localhost:3001`

## 🗄️ Database Schema

Platform menggunakan 11 models:
- User (base authentication)
- StudentProfile
- TeacherProfile
- Subject
- TeacherSubject
- AvailabilitySlot
- Class
- ClassSession
- ClassEnrollment
- Booking
- Message

## 📚 Documentation

- [Setup Guide](./SETUP.md)
- [Prisma Schema Docs](./backend/api/prisma/schema.prisma)
- [Backend README](./backend/api/README.md)
- [Mobile README](./mobile/README.md)
- [Website README](./website/README.md)

## 🧪 Testing

```bash
# Backend tests
cd backend/api
npm run test
npm run test:e2e

# Mobile tests
cd mobile
npm test
```

## 🔒 Security

- All sensitive files (.env, Firebase credentials) are gitignored
- JWT authentication for API
- Firebase Admin SDK for user management
- Role-based access control (RBAC)

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/liora"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET="your-secret-key"
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### Website (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=Liora
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

- Backend: NestJS development
- Mobile: React Native development
- Frontend: Next.js development

---

**Made with ❤️ for Education**
