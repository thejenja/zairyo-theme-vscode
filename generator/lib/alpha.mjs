export function alpha(hex, percent) {
  const a = Math.round(Math.max(0, Math.min(1, percent)) * 255)
    .toString(16).padStart(2, '0');
  return hex + a;
}
