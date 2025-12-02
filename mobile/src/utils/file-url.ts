/**
 * Build full URL for uploaded files
 * Removes /api suffix and appends file path
 * 
 * @param path - Relative path from backend (e.g., /uploads/avatars/xxx.jpg)
 * @returns Full URL (e.g., http://192.168.1.100:3000/uploads/avatars/xxx.jpg)
 */
export function buildFileUrl(path: string | null | undefined): string | null {
    if (!path) return null;

    const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/api$/, '');
    return `${base}${path}`;
}

/**
 * Usage examples:
 * 
 * Avatar:
 * <Image source={{ uri: buildFileUrl(user.avatarUrl) }} />
 * 
 * Material:
 * <Image source={{ uri: buildFileUrl(material.fileUrl) }} />
 * 
 * Or open PDF in WebView:
 * <WebView source={{ uri: buildFileUrl(material.fileUrl) }} />
 */
