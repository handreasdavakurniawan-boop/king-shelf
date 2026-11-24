// Per-book content, filled in batches by the site owner. Keyed by book slug.
// Missing books / fields are fine: the detail panel shows a "coming soon" state.
//
// synopsis: English text shown on the site (translated from the owner's Indonesian notes)
// rating:   public rating with its source: { value, source, count, digits? }, or null if none found
// links:    store links sent by the owner: [{ format, store, href }]

import { searchLinks } from './links.js'

// `digits` = decimals the figure was sent with (default 1), so 3.90 is not shortened to 3.9.
const goodreads = (value, count) => ({ value, source: 'Goodreads', count, digits: 2 })
const BACHMAN = 'Richard Bachman'

export const details = {
  // ---------- batch 1 (received 2026-11-24) ----------
  'salem-s-lot': {
    synopsis:
      'Novelist Ben Mears returns to the small Maine town where he grew up to write about the notorious Marsten House, only to find the town slowly falling to a vampire who arrived alongside a mysterious antiques dealer.',
    rating: { value: 4.1, source: 'Goodreads', count: 658000 },    links: searchLinks("'Salem's Lot"),
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

  // ---------- batch 2 (received 2026-11-25) ----------
  cell: {
    synopsis:
      'A signal broadcast through cell phones, “the Pulse”, turns users into raving, violent creatures. Cartoonist Clay Riddell heads north through New England to find his son as the infected begin to change.',
    rating: goodreads(3.65, 242905),
    links: searchLinks('Cell'),
  },
  'children-of-the-corn': {
    synopsis:
      'A bickering couple driving through Nebraska hit a boy on the road and find the nearby town of Gatlin ruled by children who worship a malevolent entity in the cornfields and have killed all the adults.',
    rating: goodreads(3.9, 15338),
    links: searchLinks('Children of the Corn'),
  },
  creepshow: {
    synopsis:
      'A comic-book style horror anthology based on the 1982 film, with five short tales told in the manner of old EC horror comics.',
    rating: goodreads(4.07, 39708),
    links: searchLinks('Creepshow'),
  },
  cujo: {
    synopsis:
      'A friendly St. Bernard is bitten by a rabid bat and turns into a killer. A mother and her young son are trapped in a broken-down car in the summer heat.',
    rating: goodreads(3.81, 335377),
    links: searchLinks('Cujo'),
  },
  desperation: {
    synopsis:
      'Travelers on a Nevada highway are arrested by a murderous cop and taken to the mining town of Desperation, where an ancient evil called Tak takes over people one by one.',
    rating: goodreads(3.86, 158474),
    links: searchLinks('Desperation'),
  },
  'different-seasons': {
    synopsis:
      'Four novellas: “Rita Hayworth and Shawshank Redemption”, “Apt Pupil”, “The Body” and “The Breathing Method”, mostly with little or no supernatural content.',
    rating: goodreads(4.36, 227629),
    links: searchLinks('Different Seasons'),
  },
  'doctor-sleep': {
    synopsis:
      'Sequel to The Shining. Danny Torrance, now an adult in recovery and working in a hospice, protects a girl with the shining from the True Knot, a group that feeds on gifted children.',
    rating: goodreads(4.13, 312074),
    links: searchLinks('Doctor Sleep'),
  },
  'dolores-claiborne': {
    synopsis:
      'Told as a statement to the police, a Maine housekeeper explains the death of her wealthy employer Vera Donovan, and the earlier death of her own husband.',
    rating: goodreads(3.95, 178742),
    links: searchLinks('Dolores Claiborne'),
  },
  dreamcatcher: {
    synopsis:
      'Four childhood friends on their annual hunting trip in Maine run into an alien invasion, a parasitic infection and a military officer determined to contain it.',
    rating: goodreads(3.66, 190592),
    links: searchLinks('Dreamcatcher'),
  },
  'duma-key': {
    synopsis:
      'After a construction accident, contractor Edgar Freemantle moves to a Florida island and begins painting. His art turns out to have uncanny powers tied to something old on the island.',
    rating: goodreads(3.99, 142566),
    links: searchLinks('Duma Key'),
  },
  'end-of-watch': {
    synopsis:
      'Final book of the Bill Hodges trilogy. A retired, ailing Hodges discovers that the brain-damaged Brady Hartsfield has developed dark abilities and is pushing victims toward suicide.',
    rating: goodreads(4.1, 166282),
    links: searchLinks('End of Watch'),
  },
  'everything-s-eventual': {
    synopsis:
      'A collection of dark tales, including “1408”, about a hotel room no one survives, and the title story about a young man who kills for a mysterious employer.',
    rating: goodreads(3.97, 112005),
    links: searchLinks("Everything's Eventual"),
  },
  'finders-keepers': {
    synopsis:
      'Obsessed fan Morris Bellamy murders reclusive author John Rothstein and steals his notebooks. Decades later a boy finds the buried loot, and Bill Hodges and his team get involved.',
    rating: goodreads(4.07, 200093),
    links: searchLinks('Finders Keepers'),
  },
  firestarter: {
    synopsis:
      'Young Charlie McGee can start fires with her mind. She and her father, who has his own mind-control ability, run from a secretive government agency known as the Shop.',
    rating: goodreads(3.92, 255105),
    links: searchLinks('Firestarter'),
  },
  'four-past-midnight': {
    synopsis:
      'Four novellas: “The Langoliers”, “Secret Window, Secret Garden”, “The Library Policeman” and “The Sun Dog”.',
    rating: goodreads(3.95, 117514),
    links: searchLinks('Four Past Midnight'),
  },
  'from-a-buick-8': {
    synopsis:
      'Pennsylvania state troopers keep a strange car in a shed behind their barracks, and it turns out to be a doorway to somewhere else. After a trooper dies, his son hears the full story.',
    rating: goodreads(3.49, 77259),
    links: searchLinks('From a Buick 8'),
  },
  'full-dark-no-stars': {
    synopsis:
      'Four novellas about the darkest sides of human nature: “1922”, “Big Driver”, “Fair Extension” and “A Good Marriage”.',
    rating: goodreads(4.09, 121187),
    links: searchLinks('Full Dark, No Stars'),
  },
  'gerald-s-game': {
    synopsis:
      'Jessie Burlingame is handcuffed to a bed in a remote lake house after her husband dies of a heart attack. She must survive hallucinations, memories and a menacing visitor.',
    rating: goodreads(3.59, 185511),
    links: searchLinks("Gerald's Game"),
  },
  'gwendy-s-button-box': {
    synopsis:
      'In Castle Rock, twelve-year-old Gwendy Peterson is given a box of colored buttons by a stranger in black. It grants gifts, but it can also destroy. Written with Richard Chizmar.',
    rating: goodreads(3.91, 83881),
    links: searchLinks("Gwendy's Button Box"),
  },
  'hearts-in-atlantis': {
    synopsis:
      'Linked stories set in Vietnam-era America, beginning with a boy named Bobby Garfield and the mysterious lodger who moves in upstairs, and following the generation shaped by that decade.',
    rating: goodreads(3.87, 105951),
    links: searchLinks('Hearts in Atlantis'),
  },
  'in-the-tall-grass': {
    synopsis:
      'Written with Joe Hill. Siblings hear a boy crying for help from a Kansas field and walk into the tall grass, where they become lost and something is waiting for them.',
    rating: goodreads(3.62, 32836),
    links: searchLinks('In the Tall Grass'),
  },
  insomnia: {
    synopsis:
      'Elderly widower Ralph Roberts in Derry, Maine, sleeps less and less and starts seeing auras around people, pulling him into a larger struggle between cosmic forces.',
    rating: goodreads(3.83, 173679),
    links: searchLinks('Insomnia'),
  },
  it: {
    synopsis:
      'Seven friends in Derry, Maine, fight a shape-shifting evil that often appears as Pennywise the clown. Twenty-seven years later they return as adults to finish it.',
    rating: goodreads(4.23, 1336860),
    links: searchLinks('It'),
  },
  joyland: {
    synopsis:
      'In 1973, college student Devin Jones takes a summer job at a North Carolina amusement park and starts investigating a murder that is said to haunt the Horror House ride.',
    rating: goodreads(3.92, 189759),
    links: searchLinks('Joyland'),
  },
  'just-after-sunset': {
    synopsis:
      'A collection of thirteen stories, including “N.”, “Willa”, “The Gingerbread Girl” and “Stationary Bike”.',
    rating: goodreads(3.88, 62457),
    links: searchLinks('Just After Sunset'),
  },
  'lisey-s-story': {
    synopsis:
      'Two years after the death of her novelist husband Scott, Lisey Landon is pursued by a dangerous stalker and revisits her memories of Scott and the dreamlike world he visited.',
    rating: goodreads(3.7, 97616),
    links: searchLinks("Lisey's Story"),
  },
  'mile-81': {
    synopsis:
      'A novella about an abandoned rest stop on the Maine Turnpike, where a dirty station wagon preys on anyone who stops.',
    rating: goodreads(3.69, 31018),
    links: searchLinks('Mile 81'),
  },
  misery: {
    synopsis:
      'Novelist Paul Sheldon is rescued from a car crash by his self-described number one fan, Annie Wilkes, who holds him captive and forces him to write the story she wants.',
    rating: goodreads(4.22, 875875),
    links: searchLinks('Misery'),
  },
  'mr-mercedes': {
    synopsis:
      'Retired detective Bill Hodges is taunted by the killer who plowed a stolen Mercedes into a job-fair crowd, and sets out to stop him before he strikes again.',
    rating: goodreads(4.04, 396266),
    links: searchLinks('Mr. Mercedes'),
  },
  'needful-things': {
    synopsis:
      'A new shop opens in Castle Rock. Its owner, Leland Gaunt, sells each customer the thing they most want at a price that includes a small prank, and the town turns on itself.',
    rating: goodreads(3.99, 290388),
    links: searchLinks('Needful Things'),
  },
  'night-shift': {
    synopsis:
      'King’s first short story collection, including “Jerusalem’s Lot”, “The Boogeyman”, “Trucks” and “Children of the Corn”.',
    rating: goodreads(4.04, 205727),
    links: searchLinks('Night Shift'),
  },
  'nightmares-and-dreamscapes': {
    synopsis:
      'A large collection of stories and one teleplay, including “Dolan’s Cadillac”, “Crouch End” and “The Moving Finger”.',
    rating: goodreads(3.95, 89926),
    links: searchLinks('Nightmares & Dreamscapes'),
  },
  revival: {
    synopsis:
      'Across decades, Jamie Morton’s life keeps crossing paths with Charles Jacobs, a minister obsessed with the secret powers of electricity.',
    rating: goodreads(3.81, 147629),
    links: searchLinks('Revival'),
  },
  'riding-the-bullet': {
    synopsis:
      'A college student hitchhikes to see his mother in the hospital and accepts a ride from a driver who is not what he seems.',
    rating: goodreads(3.67, 21051),
    links: searchLinks('Riding the Bullet'),
  },
  roadwork: {
    synopsis:
      'Published as Richard Bachman. Grieving his son’s death, Bart Dawes refuses to leave his home and workplace when a highway extension condemns them.',
    rating: null,
    links: searchLinks('Roadwork', BACHMAN),
  },
  'rose-madder': {
    synopsis:
      'Rosie Daniels runs from her violent husband, a police officer, and buys a painting that becomes a doorway to another world.',
    rating: goodreads(3.76, 128351),
    links: searchLinks('Rose Madder'),
  },
  'six-scary-stories': {
    synopsis: 'An anthology of six stories selected by King, introduced by him.',
    rating: goodreads(3.66, 5961),
    links: searchLinks('Six Scary Stories'),
  },
  'sleeping-beauties': {
    synopsis:
      'Written with Owen King. A sleeping sickness wraps women in cocoons, leaving the men of a West Virginia town on their own, except for one mysterious woman who does not fall asleep.',
    rating: goodreads(3.73, 99104),
    links: searchLinks('Sleeping Beauties'),
  },
  'the-bazaar-of-bad-dreams': {
    synopsis:
      'A collection of stories and poems with notes from King, including “Mile 81”, “Premium Harmony” and “Afterlife”.',
    rating: goodreads(3.91, 70497),
    links: searchLinks('The Bazaar of Bad Dreams'),
  },
  'the-colorado-kid': {
    synopsis:
      'Two old Maine newspapermen tell a young intern about an unsolved case: a man found dead on a beach, with no way to identify him.',
    rating: goodreads(3.38, 63482),
    links: searchLinks('The Colorado Kid'),
  },
  'the-dark-half': {
    synopsis:
      'Writer Thad Beaumont publicly retires his pen name, George Stark. Stark comes to life and starts killing the people connected to Thad.',
    rating: goodreads(3.81, 156922),
    links: searchLinks('The Dark Half'),
  },
  'the-dead-zone': {
    synopsis:
      'After waking from a five-year coma, Johnny Smith can see the past and future of anyone he touches, and glimpses a rising politician who could doom the world.',
    rating: goodreads(3.97, 256927),
    links: searchLinks('The Dead Zone'),
  },
  'the-eyes-of-the-dragon': {
    synopsis:
      'A fantasy tale. Prince Peter is framed for his father’s murder by the wizard Flagg and imprisoned, while his weaker brother takes the throne.',
    rating: goodreads(3.94, 150999),
    links: searchLinks('The Eyes of the Dragon'),
  },
  'the-girl-who-loved-tom-gordon': {
    synopsis:
      'Nine-year-old Trisha McFarland wanders off a trail in the Maine woods and survives with a radio tuned to Red Sox pitcher Tom Gordon, while something follows her.',
    rating: goodreads(3.64, 186157),
    links: searchLinks('The Girl Who Loved Tom Gordon'),
  },
  'the-long-walk': {
    synopsis:
      'Published as Richard Bachman. One hundred teenage boys enter an annual walking contest in a dystopian America. Fall below the required pace and you are shot. The last walker wins.',
    rating: null,
    links: searchLinks('The Long Walk', BACHMAN),
  },
  'the-regulators': {
    synopsis:
      'Published as Richard Bachman, a companion to Desperation. A quiet Ohio street is attacked by unseen forces that make a boy’s TV fantasies real.',
    rating: null,
    links: searchLinks('The Regulators', BACHMAN),
  },
  'the-running-man': {
    synopsis:
      'Published as Richard Bachman. Desperate to pay for his sick daughter’s medicine, Ben Richards joins a deadly TV game show in which he is hunted across the country.',
    rating: null,
    links: searchLinks('The Running Man', BACHMAN),
  },
  'the-shining': {
    synopsis:
      'Recovering alcoholic Jack Torrance becomes the winter caretaker of the Overlook Hotel with his wife and son Danny, a boy with psychic gifts. The hotel starts working on Jack.',
    rating: goodreads(4.28, 1791286),
    links: searchLinks('The Shining'),
  },
  'the-stand': {
    synopsis:
      'A superflu wipes out most of humanity. Survivors gather around two opposing figures, Mother Abagail and Randall Flagg, in a confrontation between good and evil.',
    rating: goodreads(4.35, 870974),
    links: searchLinks('The Stand'),
  },
  'the-talisman': {
    synopsis:
      'Written with Peter Straub. Twelve-year-old Jack Sawyer crosses America and a parallel world called the Territories in search of a talisman that can save his dying mother.',
    rating: goodreads(4.1, 151459),
    links: searchLinks('The Talisman'),
  },
  'the-tommyknockers': {
    synopsis:
      'In Haven, Maine, writer Bobbi Anderson finds a buried object of alien origin, and its influence slowly changes everyone in town.',
    rating: goodreads(3.61, 170506),
    links: searchLinks('The Tommyknockers'),
  },
  thinner: {
    synopsis:
      'Published as Richard Bachman. Obese lawyer Billy Halleck is cursed by an elderly Romani man after a fatal accident, and begins losing weight uncontrollably.',
    rating: null,
    links: searchLinks('Thinner', BACHMAN),
  },
  'under-the-dome': {
    synopsis:
      'A transparent barrier suddenly seals off the town of Chester’s Mill, Maine. Veteran Dale Barbara clashes with the town’s power-hungry leader, Big Jim Rennie.',
    rating: goodreads(3.93, 333994),
    links: searchLinks('Under the Dome'),
  },
}
