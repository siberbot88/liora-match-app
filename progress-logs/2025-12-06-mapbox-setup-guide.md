# Mapbox Setup Guide (No Credit Card Needed!)

## Why Mapbox?
- ✅ **No credit card required** for free tier
- ✅ **50,000 free requests/month** (vs Google's 28k)
- ✅ Instant setup - no billing verification
- ✅ Beautiful map styles

## Quick Setup (2 minutes)

### Step 1: Sign Up
1. Go to: https://account.mapbox.com/auth/signup/
2. Sign up dengan email (atau Google/GitHub)
3. **No credit card asked!** ✨

### Step 2: Get Access Token
1. Setelah sign up, langsung redirect ke dashboard
2. Atau go to: https://account.mapbox.com/access-tokens/
3. Copy **Default public token** (starts with `pk.`)
4. Token already created for you!

### Step 3: Add to Project
Create file `.env.local` in `e:\liora\website\`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=Liora
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Mapbox Access Token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cl91c2VybmFtZSIsImEiOiJja...
```

### Step 4: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Done! 🎉

Test the form:
1. Go to Create Teacher page
2. Scroll to "Google Maps Link" field
3. Paste any Google Maps share link
4. Map preview akan muncul otomatis!

## Example Google Maps Link
```
https://www.google.com/maps/@-6.2088,106.8456,15z
```

## Map Styles Available

Default: `streets-v12` (clean street map)

Other styles you can use (edit in `mapPreview.ts`):
- `streets-v12` - Clean streets
- `outdoors-v12` - Outdoor/terrain
- `light-v11` - Light minimalist
- `dark-v11` - Dark mode
- `satellite-v9` - Satellite imagery
- `satellite-streets-v12` - Satellite + streets

## Pricing
- ✅ **Free**: 50,000 map loads/month
- After: $0.50 per 1,000 requests
- Dashboard shows usage stats

## Troubleshooting

### No preview showing?
1. Check token is in `.env.local`
2. Restart `npm run dev`
3. Check browser console for errors

### Invalid token error?
- Token harus starts with `pk.`
- Copy ulang dari Mapbox dashboard
- Pastikan no extra spaces

### Want custom marker color?
Edit `mapPreview.ts`:
```typescript
const marker = `pin-s+00ADB5(${lng},${lat})`; // Turquoise pin!
```

---

**Status**: ✅ Code updated to use Mapbox
**Next**: Get token → add to .env.local → restart server → test!
