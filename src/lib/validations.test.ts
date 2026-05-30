import { describe, it, expect } from 'vitest'
import { validatePhone, validateName } from './validations'

describe('validatePhone', () => {
  it('accepts valid Algerian mobile starting with 05', () => {
    expect(validatePhone('0550123456')).toBe(true)
  })
  it('accepts valid Algerian mobile starting with 06', () => {
    expect(validatePhone('0661234567')).toBe(true)
  })
  it('accepts valid Algerian mobile starting with 07', () => {
    expect(validatePhone('0771234567')).toBe(true)
  })
  it('rejects number not starting with 05/06/07', () => {
    expect(validatePhone('0412345678')).toBe(false)
  })
  it('rejects number with wrong length', () => {
    expect(validatePhone('055012345')).toBe(false)
  })
  it('rejects empty string', () => {
    expect(validatePhone('')).toBe(false)
  })
})

describe('validateName', () => {
  it('accepts non-empty name', () => {
    expect(validateName('فاطمة')).toBe(true)
  })
  it('rejects empty string', () => {
    expect(validateName('')).toBe(false)
  })
  it('rejects whitespace-only string', () => {
    expect(validateName('   ')).toBe(false)
  })
})
