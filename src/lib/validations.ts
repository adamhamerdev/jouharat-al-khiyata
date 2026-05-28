export function validatePhone(phone: string): boolean {
  return /^(05|06|07)\d{8}$/.test(phone)
}

export function validateName(name: string): boolean {
  return name.trim().length > 0
}
