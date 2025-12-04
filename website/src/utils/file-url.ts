/**
 * Build full URL for uploaded files (Next.js version)
 * Removes /api suffix and appends file path
 * 
 * @param path - Relative path from backend (e.g., /uploads/avatars/xxx.jpg)
 * @returns Full URL (e.g., http://localhost:3000/uploads/avatars/xxx.jpg)
 */
export function buildFileUrl(path: string | null | undefined): string | null {
    if (!path) return null;

    const base = process.env.NEXT_PUBLIC_API_URL!.replace(/\/api$/, '');
    return `${base}${path}`;
}

/**
 * Usage examples:
 * 
 * Avatar in Next.js Image:
 * <Image 
 *   src={buildFileUrl(user.avatarUrl) || '/default-avatar.png'} 
 *   alt="Avatar" 
 *   width={100} 
 *   height={100} 
 * />
 * 
 * Material link:
 * <a href={buildFileUrl(material.fileUrl)} target="_blank">
 *   Download {material.title}
 * </a>
 */
