// Utilities for generating slugs and tokens for sharing numerology maps

export function generateSlug(name: string, birthDate: Date): string {
  // Remove accents and special characters
  const normalizedName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Format date as YYYY-MM-DD
  const dateStr = birthDate.toISOString().split('T')[0];
  
  return `${normalizedName}-${dateStr}`;
}

export function generateShareToken(): string {
  // Generate a secure 32-character random token
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatShareUrl(slug: string, token?: string): string {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/mapa/${slug}`;
  return token ? `${url}?token=${token}` : url;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}