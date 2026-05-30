export function validatePhone(phone: string): boolean {
  // Strip spaces, dashes, dots — mobile keyboards often auto-format
  const stripped = phone.replace(/[\s\-().+]/g, '')
  // Handle country code: +213 or 00213 → strip to local format
  const local = stripped.startsWith('213') && stripped.length === 12
    ? '0' + stripped.slice(3)
    : stripped
  return /^(05|06|07)\d{8}$/.test(local)
}

export function sanitizePhone(phone: string): string {
  const stripped = phone.replace(/[\s\-().+]/g, '')
  const local = stripped.startsWith('213') && stripped.length === 12
    ? '0' + stripped.slice(3)
    : stripped
  return local
}

export function validateName(name: string): boolean {
  return name.trim().length > 0
}
