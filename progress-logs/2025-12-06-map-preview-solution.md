# Map Preview Solutions for Teacher Location

## Chosen Solution: Google Maps Static API

### Why Google Maps Static API?
1. **Most users share Google Maps links** - Easy to extract coordinates
2. **Free tier available** - 28,000 static map loads per month
3. **No watermark** on free tier (unlike some alternatives)
4. **Reliable and fast**
5. **Easy integration** - Simple URL parameters

###implementation Example

```typescript
// utils/mapPreview.ts
export const generateMapPreview = (mapUrl: string): string | null => {
  try {
    // Extract coordinates from Google Maps URL
    // Format: https://maps.google.com/?q=-6.200000,106.816666
    // or: https://www.google.com/maps/@-6.200000,106.816666,15z
    
    const coordRegex = /@?(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = mapUrl.match(coordRegex);
    
    if (!match) return null;
    
    const [, lat, lng] = match;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    // Generate static map URL
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x400&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
    
    return staticMapUrl;
  } catch (error) {
    console.error('Failed to generate map preview:', error);
    return null;
  }
};
```

### Setup Steps:
1. Get Google Maps API Key from Google Cloud Console
2. Enable "Maps Static API"
3. Add key to `.env`: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here`
4. Use in form component

### Alternative: Mapbox Static Images API
- Free tier: 50,000 requests/month
- Cleaner styling
- URL: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lng},${lat})/${lng},${lat},15,0/600x400@2x?access_token=${token}`

### UI Component Usage:
```tsx
<div>
  <Input 
    placeholder="Paste Google Maps link"
    onChange={(e) => {
      const preview = generateMapPreview(e.target.value);
      setMapPreview(preview);
    }}
  />
  {mapPreview && (
    <img src={mapPreview} alt="Location preview" />
  )}
</div>
```

## Recommendation
**Start with Google Maps Static API** for simplicity and familiarity with users.
