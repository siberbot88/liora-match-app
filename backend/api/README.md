# Liora Backend API

Backend API untuk aplikasi Liora menggunakan NestJS + Prisma + MySQL + Redis + Firebase Admin SDK.

## 🚀 Tech Stack

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: MySQL (Local)
- **Cache**: Redis (Local)
- **Auth**: Firebase Admin SDK + JWT
- **WebSocket**: Socket.io
- **Queue**: BullMQ

## 📋 Prerequisites

Pastikan sudah terinstall:
- Node.js LTS (v18+)
- pnpm (`npm install -g pnpm`)
- MySQL Server (XAMPP/MAMP/WAMP atau MySQL Server resmi)
- Redis Server (via brew/scoop/chocolatey)
- Firebase Project dengan Service Account

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend/api
pnpm install
```

### 2. Setup Environment Variables

```bash
# Copy template .env
cp .env.example .env
```

Edit `.env` dan sesuaikan:

```env
# Database MySQL lokal (OS Service)
DATABASE_URL="mysql://root:passwordmysqlmu@localhost:3306/liora"

# Redis Local (OS Service)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET="ganti_dengan_string_random"
JWT_EXPIRES_IN="7d"

# Firebase (pilih salah satu)
# Option 1: Environment Variables (Recommended)
FIREBASE_PROJECT_ID=liora-xxxx
FIREBASE_CLIENT_EMAIL=your-adminsdk@liora-xxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_KEY_Firebase\n-----END PRIVATE KEY-----\n"

# Option 2: Service Account File
# FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

> **PENTING**: MySQL dan Redis harus running sebagai OS service (bukan docker)

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

### 4. Firebase Setup

Unduh Service Account JSON dari Firebase Console:
1. Buka Firebase Console → Project Settings
2. Service Accounts → Generate New Private Key
3. Simpan file sebagai `firebase-service-account.json` di root folder `api/`

Atau copy credentials ke file `.env` (lihat contoh di atas).

## 🏃 Running the App

```bash
# Development mode (hot reload)
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

API akan berjalan di: `http://localhost:3000/api`

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📁 Project Structure

```
api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                # Entry point
│   ├── prisma/                # Prisma service
│   ├── redis/                 # Redis service
│   └── firebase/              # Firebase service
├── .env.example               # Environment template
└── package.json
```

## 🔧 Available Scripts

- `pnpm run start:dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run prisma:generate` - Generate Prisma Client
- `pnpm run prisma:migrate` - Run database migrations
- `pnpm run prisma:studio` - Open Prisma Studio

## 🌐 Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-30T12:00:00.000Z",
  "service": "Liora Backend API",
  "version": "0.0.1"
}
```

## 📝 Notes

- Pastikan MySQL dan Redis sudah running sebelum start aplikasi
- Gunakan `.env` file untuk konfigurasi lokal, jangan commit file `.env` ke git
- Firebase Service Account JSON file juga jangan di-commit
