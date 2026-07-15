import { describe, it, expect } from 'vitest'
import { computeAPR, generateSchedule } from './irr'

describe('computeAPR', () => {
  it('computes ~10.98% APR for 36k/12mo/3180 TW installment', () => {
    const apr = computeAPR(36000, 3180, 12)
    expect(apr).toBeCloseTo(10.98, 0)
    expect(apr).toBeGreaterThan(10.5)
    expect(apr).toBeLessThan(11.5)
  })

  it('returns 0 for zero-cost installment', () => {
    expect(computeAPR(36000, 3000, 12)).toBe(0)
  })

  it('returns 0 for invalid inputs', () => {
    expect(computeAPR(0, 100, 12)).toBe(0)
    expect(computeAPR(100, 0, 12)).toBe(0)
    expect(computeAPR(100, 100, 0)).toBe(0)
  })

  it('computes APR for 6-month installment', () => {
    const apr = computeAPR(60000, 10500, 6)
    expect(apr).toBeGreaterThan(0)
    expect(apr).toBeLessThan(30)
  })

  it('computes APR for 24-month installment', () => {
    const apr = computeAPR(100000, 4600, 24)
    expect(apr).toBeGreaterThan(0)
    expect(apr).toBeLessThan(20)
  })
})

describe('generateSchedule', () => {
  it('generates correct number of periods', () => {
    const schedule = generateSchedule(36000, 3180, 12, '2026-01-15')
    expect(schedule).toHaveLength(12)
    expect(schedule[0].period).toBe(1)
    expect(schedule[11].period).toBe(12)
  })

  it('has correct payment amount', () => {
    const schedule = generateSchedule(36000, 3180, 12, '2026-01-15')
    for (const s of schedule) {
      expect(s.payment).toBe(3180)
    }
  })

  it('last period remaining is 0', () => {
    const schedule = generateSchedule(36000, 3180, 12, '2026-01-15')
    expect(schedule[11].remaining).toBe(0)
  })
})
