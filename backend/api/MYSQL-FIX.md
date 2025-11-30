# 🔧 Cara Mudah: Manual Fix MySQL Password

## Masalahnya:
Password MySQL di `.env` file tidak benar.

## Solusi Cepat:

### 1. Buka file .env
```powershell
notepad .env
```

### 2. Cari baris DATABASE_URL dan ganti:

**Jika pakai XAMPP (paling umum):**
```env
# Ganti dari:
DATABASE_URL="mysql://root:passwordmysqlmu@localhost:3306/liora"

# Menjadi (tanpa password):
DATABASE_URL="mysql://root:@localhost:3306/liora"
```

**Jika MySQL standalone dengan password:**
```env
# Ganti passwordmysqlmu dengan password MySQL Anda
DATABASE_URL="mysql://root:PASSWORD_ANDA@localhost:3306/liora"
```

### 3. Save file .env

### 4. Coba lagi:
```powershell
npx prisma migrate dev --name init
```

---

## Cara Cek Password MySQL:

1. **Via XAMPP:**
   - Buka XAMPP Control Panel
   - Start MySQL (jika belum)
   - Klik "Admin" → Buka phpMyAdmin
   - Jika bisa login tanpa password → berarti password kosong

2. **Via MySQL Workbench:**
   - Password yang Anda pakai di Workbench = password yang benar
   - Salin password tersebut ke .env

---

## Quick Test:

Setelah edit .env, test dengan:
```powershell
npx prisma db push
```

Jika berhasil tanpa error P1000 → password sudah benar! ✅
