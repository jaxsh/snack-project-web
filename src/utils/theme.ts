export function getSystemNavTheme(): 'light' | 'realDark' {
  if (typeof window !== 'undefined') {
    const isSystemDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    return isSystemDark ? 'realDark' : 'light';
  }
  return 'light';
}
