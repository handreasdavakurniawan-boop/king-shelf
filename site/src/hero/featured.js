// Which books stand face-out on the hero's display ledge.
// The hero shows exactly COUNT covers; the middle slot is the largest and sits in front,
// so the book returned at index 2 is the one a visitor sees first.

export const COUNT = 5

// Chosen by hand: ratings come from two sources on different scales, so ranking
// them would not be a fair comparison. The cloth colours also differ enough to
// tell the covers apart. Left to right; the third stands in front.
const PICKS = ['carrie', '11-22-63', 'the-shining', 'it', 'salem-s-lot']

// books:   the whole shelf, A to Z (each { slug, title, year, type, number, credit })
// returns: an array of COUNT books, in left-to-right display order
export function pickFeatured(books) {
  const picked = PICKS.map((slug) => books.find((b) => b.slug === slug)).filter(Boolean)
  // A renamed or removed slug must not leave a gap on the ledge: top up from the shelf.
  const spares = books.filter((b) => !picked.includes(b))
  return [...picked, ...spares].slice(0, COUNT)
}
