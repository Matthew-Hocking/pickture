export function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hourStr = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
  const minStr = mins > 0 ? `${mins} minute${mins !== 1 ? 's' : ''}` : '';

  if (hourStr && minStr) {
    return `${hourStr} ${minStr}`;
  }
  return hourStr || minStr || '0 minutes';
}