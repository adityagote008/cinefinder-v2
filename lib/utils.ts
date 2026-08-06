export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function totalFilterCount(counts: number[]): number {
  return counts.reduce((sum, n) => sum + n, 0);
}
