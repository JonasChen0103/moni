/**
 * Compute APR from a TW credit-card installment using IRR via Newton-Raphson.
 *
 * Cash flows: period 0 receives +principal; periods 1..n pay -monthlyPayment.
 * Solves for monthly rate r where NPV = 0, then APR = r * 12.
 */
export function computeAPR(principal: number, monthlyPayment: number, periods: number): number {
  if (periods <= 0 || monthlyPayment <= 0 || principal <= 0) return 0
  if (monthlyPayment * periods <= principal) return 0

  let r = 0.01 // initial guess: 1% monthly

  for (let i = 0; i < 200; i++) {
    let npv = principal
    let dnpv = 0

    for (let t = 1; t <= periods; t++) {
      const disc = Math.pow(1 + r, t)
      npv -= monthlyPayment / disc
      dnpv += t * monthlyPayment / Math.pow(1 + r, t + 1)
    }

    if (Math.abs(npv) < 1e-10) break

    const rNew = r - npv / dnpv
    if (rNew <= -1) {
      r = r / 2
    } else {
      r = rNew
    }
  }

  return r * 12 * 100
}

export function generateSchedule(
  principal: number,
  monthlyPayment: number,
  periods: number,
  startDate: string
): { period: number; date: string; payment: number; remaining: number }[] {
  const schedule = []
  const start = new Date(startDate)
  let remaining = principal

  for (let t = 1; t <= periods; t++) {
    const date = new Date(start)
    date.setMonth(date.getMonth() + t)
    const principalPortion = principal / periods
    remaining -= principalPortion
    schedule.push({
      period: t,
      date: date.toISOString().split('T')[0],
      payment: monthlyPayment,
      remaining: Math.max(0, remaining),
    })
  }
  return schedule
}
