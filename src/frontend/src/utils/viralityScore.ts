export function computeViralityScore(id: number): number {
  return ((id * 37 + 42) % 100) + 1;
}

export function getScoreColor(score: number): string {
  if (score < 40) return "text-amber-400";
  if (score <= 70) return "text-brand-blue";
  return "text-brand-green";
}

export function getScoreBg(score: number): string {
  if (score < 40) return "bg-amber-500/15 border-amber-500/20";
  if (score <= 70) return "bg-blue-500/15 border-blue-500/20";
  return "bg-emerald-500/15 border-emerald-500/20";
}
