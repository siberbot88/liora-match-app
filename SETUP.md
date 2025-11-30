# Setup Guide Lengkap - Liora Project

Panduan step-by-step untuk setup development environment Liora dari awal.

## 📋 Table of Contents

1. [Install Prerequisites](#1-install-prerequisites)
2. [Setup Backend](#2-setup-backend)
3. [Setup Database](#3-setup-database)
4. [Setup Mobile App](#4-setup-mobile-app)
5. [Setup Website](#5-setup-website)
6. [Verification](#6-verification)

---

## 1. Install Prerequisites

### 1.1 Install Node.js

Download dan install Node.js LTS dari: https://nodejs.org/

Verify installation:
```bash
node --version  # v18.x.x atau lebih tinggi
npm --version
```

### 1.2 Install pnpm (Recommended)

```bash
npm install -g pnpm
pnpm --version
```

### 1.3 Install Git

Download dari: https://git-scm.com/

```bash
git --version
```

### 1.4 Install MySQL

**Option A: XAMPP (Recommended untuk Windows)**
- Download: https://www.apachefriends.org/
- Install dan start Apache + MySQL dari control panel

**Option B: MySQL Server**
- Download: https://dev.mysql.com/downloads/mysql/
- Install dengan password root

**Verify MySQL running:**
```bash
mysql --version
# Atau akses http://localhost/phpmyadmin (jika menggunakan XAMPP)
```

### 1.5 Install Redis

**Windows (menggunakan Chocolatey):**
```bash
choco install redis-64
redis-server --version
```

**Manual Windows:**
- Download: https://github.com/microsoftarchive/redis/releases
- Extract dan jalankan `redis-server.exe`

**Verify Redis running:**
```bash
redis-cli ping
# Response: PONG
```

### 1.6 Setup Firebase Project

1. Buka https://console.firebase.google.com/
2. Create new project atau pilih existing
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download JSON file (simpan untuk nanti)

---

## 2. Setup Backend

### 2.1 Clone/Create Project

```bash
mkdir liora
cd liora
git init
```

### 2.2 Install Backend Dependencies

```bash
cd backend/api
pnpm install
```

### 2.3 Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database (OS Service - bukan docker)
DATABASE_URL="mysql://root:passwordmysqlmu@localhost:3306/liora"

# Redis (OS Service - bukan docker)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET="ganti_dengan_string_random"
JWT_EXPIRES_IN="7d"

# Firebase
FIREBASE_PROJECT_ID=liora-xxxx
FIREBASE_CLIENT_EMAIL=your-adminsdk@liora-xxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_KEY_Firebase\n-----END PRIVATE KEY-----\n"
```

### 2.4 Copy Firebase Service Account

Copy file JSON yang di-download tadi ke:
```bash
backend/api/firebase-service-account.json
```

---

## 3. Setup Database

### 3.1 Create Database

**Via phpMyAdmin (XAMPP):**
1. Buka http://localhost/phpmyadmin
2. Klik "New" di sidebar
3. Database name: `liora`
4. Collation: `utf8mb4_unicode_ci`
5. Create

**Via MySQL CLI:**
```bash
mysql -u root -p
# Masukkan password

CREATE DATABASE liora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

> **PENTING**: Pastikan MySQL dan Redis running sebagai **OS service** (BUKAN docker)

### 3.2 Run Prisma Migrations

```bash
cd backend/api

# Generate Prisma Client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate dev --name init
```

### 3.3 (Optional) Seed Data

```bash
npx prisma db seed
```

### 3.4 Verify Database

```bash
# Open Prisma Studio
npx prisma studio
```

Browser akan terbuka di http://localhost:5555 - cek tabel sudah dibuat

---

## 4. Setup Mobile App

### 4.1 Install Dependencies

```bash
cd mobile
npm install
```

### 4.2 Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PENTING: Gunakan IP address lokal, BUKAN localhost!
# Cek IP dengan: ipconfig (Windows) atau ifconfig (Mac/Linux)
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api

# Firebase Config (dari Firebase Console → Project Settings → General)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXxx...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123:android:abc123
```

**Cara mendapatkan Firebase config:**
1. Firebase Console → Project Settings
2. Scroll ke "Your apps"
3. Pilih atau add Android/iOS app
4. Copy config values

---

## 5. Setup Website

### 5.1 Install Dependencies

```bash
cd website
npm install
```

### 5.2 Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=Liora
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

---

## 6. Verification

### 6.1 Start All Services

**Terminal 1 - Backend:**
```bash
cd backend/api
pnpm run start:dev
```

Wait sampai muncul:
```
✅ Connected to MySQL database
✅ Connected to Redis
✅ Firebase Admin SDK initialized
🚀 Liora Backend API running on: http://localhost:3000/api
```

**Terminal 2 - Mobile:**
```bash
cd mobile
npm start
```

Scan QR code dengan Expo Go app di HP

**Terminal 3 - Website:**
```bash
cd website
npm run dev
```

Buka browser: http://localhost:3000

### 6.2 Test Backend

```bash
curl http://localhost:3000/api/health
```

Response harus:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "Liora Backend API",
  "version": "0.0.1"
}
```

### 6.3 Test Mobile

- App harus terbuka di Expo Go
- Lihat "🎉 Liora Mobile App"
- Check console tidak ada error

### 6.4 Test Website

- Browser buka http://localhost:3000
- Lihat "🚀 Liora"
- Pages load dengan styling TailwindCSS

---

## 🎉 Selesai!

Jika semua verification berhasil, maka setup sudah complete!

### Next Steps:

1. **Backend**: Buat module/controller untuk business logic
2. **Mobile**: Setup navigation dan screens
3. **Website**: Design dan implement landing page

### Useful Commands:

**Backend:**
```bash
pnpm run start:dev      # Development mode
npx prisma studio       # Database GUI
npx prisma migrate dev  # Create migration
```

**Mobile:**
```bash
npm start              # Start Expo
npm run android        # Android emulator
npm run ios            # iOS simulator (Mac only)
```

**Website:**
```bash
npm run dev           # Development mode
npm run build         # Production build
```

---

## 🆘 Common Issues

### "ECONNREFUSED" saat connect MySQL
- MySQL belum running → start dari XAMPP control panel
- Port salah → cek MySQL port (default 3306)
- Password salah → cek di .env

### "ECONNREFUSED" saat connect Redis
- Redis belum running → `redis-server` di terminal
- Port salah → default 6379

### Mobile tidak bisa connect ke backend
- Gunakan IP address lokal (192.168.x.x)
- HP dan komputer harus 1 network
- Check firewall tidak block port 3000

### Firebase initialization failed
- Check file path firebase-service-account.json
- Atau gunakan environment variables

---

**Butuh bantuan? Check dokumentasi atau tanya team! 🚀**
