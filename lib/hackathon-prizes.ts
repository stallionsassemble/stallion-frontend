export interface PrizeSlot {
  position: number
  amount: number
  track?: string
  label?: string
}

const ordinal = (n: number) => {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

/** Human label for a prize slot, e.g. "1st place" or "DeFi: 2nd place". */
export function describePrizeSlot(slot: PrizeSlot, pool: PrizeSlot[]): string {
  if (!slot.track) return `${ordinal(slot.position)} place`
  const rank = pool.filter((p) => p.track === slot.track && p.position <= slot.position).length
  return `${slot.track}: ${ordinal(rank)} place`
}

/**
 * The prize slots a given submission can win. Shared pools allow every slot; per-track prizes
 * only allow the slots of the submission's own track.
 */
export function slotsForSubmission(pool: PrizeSlot[], submissionTrack?: string | null): PrizeSlot[] {
  const sorted = [...pool].sort((a, b) => a.position - b.position)
  if (!sorted.some((p) => p.track)) return sorted
  return sorted.filter((p) => p.track === submissionTrack)
}
