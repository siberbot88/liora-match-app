# Liora Mobile App

Aplikasi mobile Liora menggunakan React Native + Expo.

## 🚀 Tech Stack

- **Framework**: React Native
- **Platform**: Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **State Management**: (To be added)

## 📋 Prerequisites

Pastikan sudah terinstall:
- Node.js LTS (v18+)
- npm atau pnpm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app di smartphone (untuk testing)

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd mobile
npm install
# atau
pnpm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.x:3000/api  # Ganti dengan IP lokal
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... dan seterusnya
```

> **Note**: Untuk testing di perangkat fisik, gunakan IP address komputer Anda, bukan localhost!

## 🏃 Running the App

```bash
# Start Expo development server
npm start

# Atau langsung ke platform tertentu
npm run android    # Android emulator/device
npm run ios        # iOS simulator (Mac only)
npm run web        # Web browser
```

Scan QR code dengan:
- **Android**: Expo Go app
- **iOS**: Camera app (akan membuka Expo Go)

## 📁 Project Structure

```
mobile/
├── App.tsx                    # Entry point
├── app.json                   # Expo configuration
├── assets/                    # Images, fonts, etc
├── src/
│   ├── components/            # Reusable components
│   ├── screens/               # Screen components
│   ├── navigation/            # Navigation setup
│   ├── services/              # API services
│   ├── utils/                 # Utilities
│   └── types/                 # TypeScript types
├── .env.example               # Environment template
└── package.json
```

## 🔧 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## 📱 Testing

### Development Build
```bash
expo start --dev-client
```

### Production Build
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 📝 Notes

- Gunakan IP address lokal (bukan localhost) untuk koneksi ke backend API
- Pastikan backend API sudah running sebelum menjalankan mobile app
- Untuk production build, gunakan EAS Build dari Expo
