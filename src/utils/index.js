/**
 * Turn an ISO date string into a relative, human-friendly label,
 * e.g. "baru saja", "5 menit lalu", "3 hari lalu", or a plain date
 * once it's older than a week.
 * @param {string} dateString - ISO date string.
 * @return {string} Human readable relative time.
 */
export function postedAt(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (Number.isNaN(seconds)) return '';
  if (seconds < 60) return 'baru saja';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Derive the initials used as a fallback avatar (e.g. "John Doe" -> "JD").
 * @param {string} name - Full name.
 * @return {string} Up to two uppercase initials.
 */
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/**
 * Deterministically pick one of a small palette of accent colors from a
 * string, so the same user/category always gets the same color.
 * @param {string} seed - Any string, e.g. a user id or category name.
 * @return {string} A CSS color value.
 */
export function colorFromString(seed = '') {
  const palette = ['#2F6FED', '#F97362', '#2FBF71', '#F4B740', '#8B5CF6', '#0EA5B7'];
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
}
