// The reading collection. Year = first publication (trade edition).
// `credit` replaces the author line on the cover when the book is not King's alone.
// Synopsis and store links are added in stage 8.

export const AUTHOR = 'Stephen King'

const NOVEL = 'Novel'
const NOVELLA = 'Novella'
const STORY = 'Short Story'
const STORIES = 'Story Collection'
const NOVELLAS = 'Novella Collection'

const ENTRIES = [
  { title: "'Salem's Lot", year: 1975, type: NOVEL },
  { title: '11/22/63', year: 2011, type: NOVEL },
  { title: '1922', year: 2010, type: NOVELLA },
  { title: 'A Face in the Crowd', year: 2012, type: STORY, credit: 'Stephen King & Stewart O’Nan' },
  { title: 'A Good Marriage', year: 2010, type: NOVELLA },
  { title: 'Bag of Bones', year: 1998, type: NOVEL },
  { title: 'Big Driver', year: 2010, type: NOVELLA },
  { title: 'Black House', year: 2001, type: NOVEL, credit: 'Stephen King & Peter Straub' },
  { title: 'Blockade Billy', year: 2010, type: NOVELLA },
  { title: 'Carrie', year: 1974, type: NOVEL },
  { title: 'Cell', year: 2006, type: NOVEL },
  { title: 'Children of the Corn', year: 1977, type: STORY },
  { title: 'Creepshow', year: 1982, type: 'Comic Book' },
  { title: 'Cujo', year: 1981, type: NOVEL },
  { title: 'Desperation', year: 1996, type: NOVEL },
  { title: 'Different Seasons', year: 1982, type: NOVELLAS },
  { title: 'Doctor Sleep', year: 2013, type: NOVEL },
  { title: 'Dolores Claiborne', year: 1992, type: NOVEL },
  { title: 'Dreamcatcher', year: 2001, type: NOVEL },
  { title: 'Duma Key', year: 2008, type: NOVEL },
  { title: 'End of Watch', year: 2016, type: NOVEL },
  { title: "Everything's Eventual", year: 2002, type: STORIES },
  { title: 'Finders Keepers', year: 2015, type: NOVEL },
  { title: 'Firestarter', year: 1980, type: NOVEL },
  { title: 'Four Past Midnight', year: 1990, type: NOVELLAS },
  { title: 'From a Buick 8', year: 2002, type: NOVEL },
  { title: 'Full Dark, No Stars', year: 2010, type: NOVELLAS },
  { title: "Gerald's Game", year: 1992, type: NOVEL },
  { title: "Gwendy's Button Box", year: 2017, type: NOVELLA, credit: 'Stephen King & Richard Chizmar' },
  { title: 'Hearts in Atlantis', year: 1999, type: STORIES },
  { title: 'In the Tall Grass', year: 2012, type: NOVELLA, credit: 'Stephen King & Joe Hill' },
  { title: 'Insomnia', year: 1994, type: NOVEL },
  { title: 'It', year: 1986, type: NOVEL },
  { title: 'Joyland', year: 2013, type: NOVEL },
  { title: 'Just After Sunset', year: 2008, type: STORIES },
  { title: "Lisey's Story", year: 2006, type: NOVEL },
  { title: 'Mile 81', year: 2011, type: NOVELLA },
  { title: 'Misery', year: 1987, type: NOVEL },
  { title: 'Mr. Mercedes', year: 2014, type: NOVEL },
  { title: 'Needful Things', year: 1991, type: NOVEL },
  { title: 'Night Shift', year: 1978, type: STORIES },
  { title: 'Nightmares & Dreamscapes', year: 1993, type: STORIES },
  { title: 'Revival', year: 2014, type: NOVEL },
  { title: 'Riding the Bullet', year: 2000, type: NOVELLA },
  { title: 'Roadwork', year: 1981, type: NOVEL, credit: 'Richard Bachman' },
  { title: 'Rose Madder', year: 1995, type: NOVEL },
  { title: 'Six Scary Stories', year: 2015, type: 'Anthology', credit: 'Selected by Stephen King' },
  { title: 'Sleeping Beauties', year: 2017, type: NOVEL, credit: 'Stephen King & Owen King' },
  { title: 'The Bazaar of Bad Dreams', year: 2015, type: STORIES },
  { title: 'The Colorado Kid', year: 2005, type: NOVEL },
  { title: 'The Dark Half', year: 1989, type: NOVEL },
  { title: 'The Dead Zone', year: 1979, type: NOVEL },
  { title: 'The Eyes of the Dragon', year: 1987, type: NOVEL },
  { title: 'The Girl Who Loved Tom Gordon', year: 1999, type: NOVEL },
  { title: 'The Long Walk', year: 1979, type: NOVEL, credit: 'Richard Bachman' },
  { title: 'The Regulators', year: 1996, type: NOVEL, credit: 'Richard Bachman' },
  { title: 'The Running Man', year: 1982, type: NOVEL, credit: 'Richard Bachman' },
  { title: 'The Shining', year: 1977, type: NOVEL },
  { title: 'The Stand', year: 1978, type: NOVEL },
  { title: 'The Talisman', year: 1984, type: NOVEL, credit: 'Stephen King & Peter Straub' },
  { title: 'The Tommyknockers', year: 1987, type: NOVEL },
  { title: 'Thinner', year: 1984, type: NOVEL, credit: 'Richard Bachman' },
  { title: 'Under the Dome', year: 2009, type: NOVEL },
]

// Turns a title into the string used for alphabetical ordering on the shelf.
// Library-catalogue style: a leading "The", "A" or "An" is ignored.
export function sortKey(title) {
  return title.replace(/^(The|A|An) /, '')
}

const slugify = (t) =>
  t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const books = ENTRIES.map((e) => ({ ...e, credit: e.credit ?? AUTHOR, slug: slugify(e.title) }))
  .sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title), 'en', { numeric: true }))
  .map((book, i) => ({ ...book, number: i + 1 }))
