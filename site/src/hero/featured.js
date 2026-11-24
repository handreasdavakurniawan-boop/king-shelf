// Which books stand face-out on the hero's display ledge.
// The hero shows exactly COUNT covers; the middle slot is the largest and sits in front,
// so the book returned at index 2 is the one a visitor sees first.

export const COUNT = 5

// books:   the whole shelf, A to Z (each { slug, title, year, type, number, credit })
// details: per-slug content ({ synopsis, rating: { value, source, count }, links }), may be missing
// returns: an array of COUNT books, in left-to-right display order
export function pickFeatured(books, details) {
  // TODO(human): choose the five face-out books.
  return books.slice(0, COUNT)
}
