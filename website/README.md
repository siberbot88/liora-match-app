# Liora Landing Website

Landing page untuk aplikasi Liora menggunakan Next.js 14.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Font**: Inter (Google Fonts)

## 📋 Prerequisites

Pastikan sudah terinstall:
- Node.js LTS (v18+)
- npm atau pnpm

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd website
npm install
# atau
pnpm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` sesuai kebutuhan:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=Liora
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## 🏃 Running the App

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm run start
```

Website akan berjalan di: `http://localhost:3000`

## 📁 Project Structure

```
website/
├── app/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                # React components
├── public/                    # Static assets
├── .env.example               # Environment template
├── tailwind.config.js         # TailwindCSS config
├── next.config.js             # Next.js config
└── package.json
```

## 🎨 Development Notes

- Gunakan App Router (bukan Pages Router)
- Components ada di folder `components/`
- Halaman baru buat di folder `app/`
- Styling menggunakan TailwindCSS utility classes
- Font default: Inter dari Google Fonts

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## 📦 Building for Production

```bash
npm run build
npm run start
```

Atau deploy ke Vercel:
```bash
vercel deploy
```

## 📝 Notes

- Belum ada desain final - ini hanya struktur awal
- TailwindCSS sudah dikonfigurasi dengan custom color palette
- SEO metadata sudah di-setup di `layout.tsx`
- Responsive by default dengan Tailwind
