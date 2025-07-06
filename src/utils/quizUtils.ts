
export function getProgress(current: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round(((current + 1) / total) * 100)}%`;
}

