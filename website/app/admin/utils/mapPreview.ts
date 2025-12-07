/**
 * Extract coordinates from Google Maps URL and generate static map preview using Mapbox
 * @param mapUrl Google Maps share link
 * @returns Mapbox Static Image URL or null if invalid
 */
export const generateMapPreview = (mapUrl: string): string | null => {
    if (!mapUrl) return null;

    try {
        // Extract coordinates from various Google Maps URL formats:
        // https://maps.google.com/?q=-6.200000,106.816666
        // https://www.google.com/maps/@-6.200000,106.816666,15z
        // https://goo.gl/maps/xxx

        const coordRegex = /@?(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = mapUrl.match(coordRegex);

        if (!match) {
            console.warn('Could not extract coordinates from URL:', mapUrl);
            return null;
        }

        const [, lat, lng] = match;
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (!accessToken) {
            console.warn('Mapbox access token not configured');
            return null;
        }

        // Generate Mapbox Static Images API URL
        // Docs: https://docs.mapbox.com/api/maps/static-images/
        // Format: /styles/v1/{username}/{style_id}/static/{overlay}/{lon},{lat},{zoom},{bearing},{pitch}/{width}x{height}{@2x}

        const username = 'mapbox';
        const styleId = 'streets-v12'; // Clean street map style
        const zoom = 15;
        const width = 600;
        const height = 300;

        // Add red marker pin overlay
        const marker = `pin-s+ff0000(${lng},${lat})`;

        const staticImageUrl = `https://api.mapbox.com/styles/v1/${username}/${styleId}/static/${marker}/${lng},${lat},${zoom},0,0/${width}x${height}@2x?access_token=${accessToken}`;

        return staticImageUrl;
    } catch (error) {
        console.error('Error generating map preview:', error);
        return null;
    }
};

/**
 * Validate if URL is a valid Google Maps link
 */
export const isValidGoogleMapsUrl = (url: string): boolean => {
    const patterns = [
        /^https?:\/\/(www\.)?google\.[a-z]+\/maps/i,
        /^https?:\/\/maps\.google\.[a-z]+/i,
        /^https?:\/\/goo\.gl\/maps/i,
    ];

    return patterns.some(pattern => pattern.test(url));
};
