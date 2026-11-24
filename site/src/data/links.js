// Store links are supplied by the site owner per book, in each content batch
// (decision 2026-11-24: manual, not auto-generated). They live in details.js.
//
// `searchLinks` rebuilds the exact Amazon / Google Play Books / Audible search
// URLs used in batch 1, so that batch can be stored compactly. Books in later
// batches list their own links explicitly.

const STORES = [
  { format: 'Hardcover', store: 'Amazon', url: (q) => `https://www.amazon.com/s?k=${q}&i=stripbooks` },
  { format: 'E-book', store: 'Google Play Books', url: (q) => `https://play.google.com/store/search?q=${q}&c=books` },
  { format: 'Audiobook', store: 'Audible', url: (q) => `https://www.audible.com/search?keywords=${q}` },
]

export function searchLinks(title) {
  const q = encodeURIComponent(`${title} Stephen King`).replace(/%20/g, '+').replace(/'/g, '%27')
  return STORES.map(({ format, store, url }) => ({ format, store, href: url(q) }))
}
