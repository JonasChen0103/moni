import { describe, it, expect } from 'vitest'
import { convertCurrency, formatCurrency } from './fx'

describe('convertCurrency', () => {
  const rates: Record<string, number> = {
    TWD: 1,
    USD: 0.031,
    JPY: 4.6,
    EUR: 0.029,
  }

  it('returns same amount for same currency', () => {
    expect(convertCurrency(1000, 'TWD', 'TWD', rates, 'TWD')).toBe(1000)
  })

  it('converts TWD to USD', () => {
    const result = convertCurrency(1000, 'TWD', 'USD', rates, 'TWD')
    expect(result).toBeCloseTo(31, 0)
  })

  it('converts USD to TWD', () => {
    const result = convertCurrency(100, 'USD', 'TWD', rates, 'TWD')
    expect(result).toBeCloseTo(3226, -1)
  })

  it('converts JPY to USD (cross rate)', () => {
    const result = convertCurrency(1000, 'JPY', 'USD', rates, 'TWD')
    expect(result).toBeGreaterThan(0)
  })
})

describe('formatCurrency', () => {
  it('formats TWD without decimals', () => {
    const s = formatCurrency(12345, 'TWD')
    expect(s).toContain('12,345')
    expect(s).not.toContain('.')
  })

  it('formats USD with 2 decimals', () => {
    const s = formatCurrency(99.5, 'USD')
    expect(s).toContain('99.50')
  })

  it('formats JPY without decimals', () => {
    const s = formatCurrency(5000, 'JPY')
    expect(s).toContain('5,000')
    expect(s).not.toContain('.')
  })
})
