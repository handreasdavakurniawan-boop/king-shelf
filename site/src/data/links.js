// Store links are supplied by the site owner per book, in each content batch
// (decision 2026-11-24: manual, not auto-generated). They live in details.js.
//
// `searchLinks` rebuilds the exact Amazon / Google Play Books / Audible search
// URLs sent in batches 1 and 2, so they can be stored compactly. A link that
// does not follow this pattern should be listed explicitly in details.js.
// `author` is the name used in the search (the Bachman titles use his pen name).

const STORES = [
  { format: 'Hardcover', store: 'Amazon', url: (q) => `https://www.amazon.com/s?k=${q}&i=stripbooks` },
  { format: 'E-book', store: 'Google Play Books', url: (q) => `https://play.google.com/store/search?q=${q}&c=books` },
  { format: 'Audiobook', store: 'Audible', url: (q) => `https://www.audible.com/search?keywords=${q}` },
]

export function searchLinks(title, author = 'Stephen King') {
  const q = encodeURIComponent(`${title} ${author}`).replace(/%20/g, '+').replace(/'/g, '%27')
  return STORES.map(({ format, store, url }) => ({ format, store, href: url(q) }))
}
