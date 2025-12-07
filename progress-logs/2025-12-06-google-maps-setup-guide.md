# Google Maps API Setup Guide

## Overview
Setup Google Maps Static API to enable location preview in teacher profiles.

## Steps to Get API Key

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create/Select Project
- Click "Select a project" at the top
- Create new project or select existing
- Name: "Liora Admin Panel" (or similar)

### 3. Enable Maps Static API
- Go to "APIs & Services" → "Library"
- Search for "Maps Static API"
- Click on it and press "Enable"

### 4. Create API Key
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "API Key"
- Copy the generated API key

### 5. Secure the API Key (Recommended)
- Click "Edit API key" (pencil icon)
- Under "API restrictions": Select "Restrict key"
- Choose "Maps Static API" from the dropdown
- Under "Website restrictions": Add your domain
  - For development: `localhost:3001`
  - For production: `yourdomain.com`
- Save

### 6. Add to Environment Variables
Create `.env.local` file in `e:\liora\website\`:

```bash
# Copy from .env.example
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=Liora
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Add your actual API key here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your_actual_key_here
```

### 7. Restart Dev Server
```bash
npm run dev
```

## Pricing
- **Free Tier**: 28,000 static map loads per month
- **After free tier**: $2 per 1000 requests
- **Recommendation**: Enable billing but set budget alerts

## Testing
1. Open create teacher form
2. Paste a Google Maps link (e.g., from "Share" in Google Maps app)
3. Map preview should appear automatically

## Troubleshooting

### Preview not showing?
- Check if API key is in `.env.local`
- Restart Next.js dev server
- Check browser console for errors
- Verify Maps Static API is enabled in Google Cloud Console

### Error: "This API project is not authorized to use this API"
- Go to Google Cloud Console
- Enable "Maps Static API"
- Wait a few minutes for propagation

### Error: "The provided API key is invalid"
- Double-check API key in `.env.local`
- Ensure no extra spaces
- Verify key restrictions settings

## Optional: Mapbox Alternative

If you prefer Mapbox over Google Maps:

1. Sign up: https://www.mapbox.com/
2. Get access token
3. Free tier: 50,000 requests/month
4. Update `mapPreview.ts` utility function

---

**Current Status**: Utility functions created, form updated, waiting for API key configuration.
