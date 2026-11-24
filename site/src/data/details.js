// Per-book content, filled in batches by the site owner. Keyed by book slug.
// Missing books / fields are fine: the detail panel shows a "coming soon" state.
//
// synopsis: English text shown on the site (translated from the owner's Indonesian notes)
// rating:   public rating with its source: { value, source, count }, or null if none found
// links:    store links sent by the owner: [{ format, store, href }]

import { searchLinks } from './links.js'

export const details = {
  // ---------- batch 1 (received 2026-11-24) ----------
  'salem-s-lot': {
    synopsis:
      'Novelist Ben Mears returns to the small Maine town where he grew up to write about the notorious Marsten House, only to find the town slowly falling to a vampire who arrived alongside a mysterious antiques dealer.',
    rating: { value: 4.1, source: 'Goodreads', count: 658000 },
    links: searchLinks("'Salem's Lot"),
  },
  '11-22-63': {
    synopsis:
      'English teacher Jake Epping discovers a passage back to 1958 and is asked to stop the assassination of JFK. Living for years in that era, he falls in love, and must first make certain that Oswald really acted alone.',
    rating: { value: 4.4, source: 'Apple Books', count: 8900 },
    links: searchLinks('11/22/63'),
  },
  '1922': {
    synopsis:
      'A novella from Full Dark, No Stars. Farmer Wilfred James confesses to murdering his wife to keep their land, and to drawing his son into the crime. Guilt, and a plague of rats, follow them both.',
    rating: { value: 4.5, source: 'Apple Books', count: 142 },
    links: searchLinks('1922'),
  },
  'a-face-in-the-crowd': {
    synopsis:
      'A short story by King and Stewart O’Nan. Dean Evers, an elderly widower watching baseball on TV, starts spotting people from his past, people who should be dead, sitting in the stadium crowd.',
    rating: { value: 3.8, source: 'Apple Books', count: 171 },
    links: searchLinks('A Face in the Crowd'),
  },
  'a-good-marriage': {
    synopsis:
      'A novella from Full Dark, No Stars. After some twenty-seven years of marriage, Darcy Anderson stumbles on her husband Bob’s horrifying secret and must decide what to do about it.',
    rating: { value: 4.0, source: 'Apple Books', count: 634 },
    links: searchLinks('A Good Marriage'),
  },
  'bag-of-bones': {
    synopsis:
      'Four years after his wife’s death, novelist Mike Noonan retreats to their lake house in Maine, where he is haunted by spirits and pulled into a custody battle between a young widow and a local billionaire.',
    rating: null,
    links: searchLinks('Bag of Bones'),
  },
  'big-driver': {
    synopsis:
      'A novella from Full Dark, No Stars. Mystery writer Tess is attacked and left for dead on a shortcut home from a book-club event, then turns her sleuthing skills toward revenge.',
    rating: { value: 4.0, source: 'Apple Books', count: 75 },
    links: searchLinks('Big Driver'),
  },
  'black-house': {
    synopsis:
      'The sequel to The Talisman, written with Peter Straub. Retired Los Angeles detective Jack Sawyer is drawn into the hunt for a Wisconsin child-killer called the Fisherman, a case tied to a parallel world and the Dark Tower.',
    rating: { value: 4.5, source: 'Apple Books', count: 336 },
    links: searchLinks('Black House'),
  },
  'blockade-billy': {
    synopsis:
      'A novella told as an old baseball coach’s confession. In 1957 young catcher William “Blockade Billy” Blakely joins the New Jersey Titans: brilliant on the field, but hiding a dark secret that erased his name from the record books.',
    rating: null,
    links: searchLinks('Blockade Billy'),
  },
  carrie: {
    synopsis:
      'Carrie White, a shy, bullied teenager raised by a fanatically religious mother, discovers she has telekinetic powers. A cruel prank on prom night unleashes a revenge that devastates her town.',
    rating: { value: 4.5, source: 'Apple Books', count: 1600 },
    links: searchLinks('Carrie'),
  },
}
