/**
 * @param {string} query
 * @param {string[]} parts
 */
export function matchesSearch(query, parts) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return parts.some((p) => String(p).toLowerCase().includes(q));
}
