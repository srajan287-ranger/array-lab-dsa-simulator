export function parseArrayInput(input: string): number[] | null {
  if (!input || !input.trim()) return null;
  const parts = input.split(/[,\s]+/).filter((p) => p.trim() !== '');
  if (parts.length === 0) return null;
  const result: number[] = [];
  for (const p of parts) {
    const num = Number(p);
    if (Number.isNaN(num)) return null;
    result.push(num);
  }
  return result;
}

export function formatArray(arr: number[]): string {
  return arr.join(', ');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
