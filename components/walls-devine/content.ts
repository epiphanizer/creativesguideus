export type SongPlatformLinks = Partial<{
  spotify: string;
  appleMusic: string;
  youtubeMusic: string;
  tidal: string;
  amazonMusic: string;
  soundcloud: string;
  bandcamp: string;
}>;

export type SongPostCard = {
  trackNumber: number;
  title: string;
  duration: string;
  audioFileName?: string;
  phase: string;
  hook: string;
  caption: string;
  storySummary: string;
  visualThread: string;
  journalSlug: string;
  makingNote: string;
  technicalNote: string;
  isPlaceholder?: boolean;
  platformLinks?: SongPlatformLinks;
  bongTourCueId?: string;
  bongTourContext?: string;
};

export const songPostCards: SongPostCard[] = [
  {
    trackNumber: 1,
    title: "Joint Queen",
    duration: "2:07",
    audioFileName: "1. Joint Queen.wav",
    phase: "Released September 1, 2026",
    hook: "Funk bass, living room joy, and pure groove.",
    caption: "The open sonic landscape where the record began.",
    storySummary:
      "Inspired by the joy Peace Feather brought into John and Terry's lives. John tracked that funky Mint-Green P-Bass groove, and Terry knew right then that music was joy again. 'The little guitar scratches at the beginning of the song are the sounds of my life making sense for the first time.'",
    visualThread: "Crown motifs, gold warmth, and smoke plumes.",
    journalSlug: "joint-queen",
    makingNote: "Built around John's Mint-Green P-Bass groove, layered with Terry's live guitar scratches and studio collage elements.",
    technicalNote: "Fender P-Bass through tube drive, layered with live electric guitar scratches and room collage textures.",
    bongTourCueId: "score-joint-queen",
    bongTourContext: "Featured in Bong Tour's Comedy Store takeover montage."
  },
  {
    trackNumber: 2,
    title: "Stash Daddy",
    duration: "3:35",
    audioFileName: "2. Stash Daddy.wav",
    phase: "Released September 1, 2026",
    hook: "Unrehearsed guitar, late-night pulse, and kitchen-table laughs.",
    caption: "Low-end pressure, loop jams, and zero rehearsal.",
    storySummary:
      "Born at the kitchen table with a joke logo taped to the mirror. John looped the track, walked out of the room, and left Terry alone with the headphones to play with no rehearsal or filters: 'Stash Daddy is the sound of my heart being set free.'",
    visualThread: "Stack geometry, wiring, and deep red shadows.",
    journalSlug: "stash-daddy",
    makingNote: "Started from an unrehearsed loop jam, letting the guitar respond naturally to the pulse.",
    technicalNote: "Loop groove bed with direct live electric guitar tracking, captured in unrehearsed room sessions.",
    bongTourCueId: "score-stash-daddy",
    bongTourContext: "Featured in Bong Tour's Sunset backroom plotting scenes."
  },
  {
    trackNumber: 3,
    title: "Space Cruiser",
    duration: "3:12",
    audioFileName: "3. Space Cruiser.wav",
    phase: "Released September 1, 2026",
    hook: "Cosmic delays, Indian classical vocals, and late-night studio atmosphere.",
    caption: "Written the morning after a brutal gig, built into a cosmic collage.",
    storySummary:
      "John wrote the sketch the morning after a brutal live show in September 2025 just to clear the taste out of his mouth. It grew into a collage of delays, Indian sargam vocals by Ishan Thakur, and one historically significant bong rip on the live studio mic.",
    visualThread: "Deep celestial beams, cosmic orbit seals, and warm amber light.",
    journalSlug: "space-cruiser",
    makingNote: "Collaged together from delayed takes, ambient beds, and Ishan Thakur's sargam vocal parts.",
    technicalNote: "Harmonium bed with collage delay editing, Indian sargam vocals by Ishan Thakur, and live studio atmospheric sampling.",
    bongTourCueId: "score-space-cruiser",
    bongTourContext: "Featured in Bong Tour's Ganges finale and myth closure."
  },
  {
    trackNumber: 4,
    title: "Conviction",
    duration: "4:20",
    audioFileName: "4. Conviction.wav",
    phase: "Released September 1, 2026",
    hook: "A steady line held under pressure.",
    caption: "Discipline, heavy tone, and forward motion.",
    storySummary:
      "A statement of nerve and focus at the midpoint of Volume 1, turning the record from cosmic lift into its raw, heavy second half.",
    visualThread: "Clean steel lines, deep red borders, and grounded typography.",
    journalSlug: "conviction",
    makingNote: "Sequenced as the record's midpoint pivot, moving from cosmic space into heavy live guitars.",
    technicalNote: "Tracked with tube saturation and forward bass presence."
  },
  {
    trackNumber: 5,
    title: "Decay",
    duration: "2:43",
    audioFileName: "5. Decay.wav",
    phase: "Released September 1, 2026",
    hook: "Screaming guitars, full-volume wails, and death expressed as life.",
    caption: "Our metal song: wild guitars and spoken-word testimony.",
    storySummary:
      "John smiled and told Terry: 'This is gonna be our metal song.' Terry plugged in and trusted his instincts at full volume, layering hours of screaming guitars over John's spoken line: 'Death was contained in me / Expressed as life.'",
    visualThread: "Weathered textures, high-contrast dark tones, and raw grain.",
    journalSlug: "decay",
    makingNote: "Hours of screaming guitar takes tracked straight through cranked amps, edited into a single coherent wail.",
    technicalNote: "Overdriven electric guitars through cranked tube amps, balanced with spoken-word vocal takes."
  },
  {
    trackNumber: 6,
    title: "Resolve",
    duration: "3:15",
    audioFileName: "6. Resolve.wav",
    phase: "Released September 1, 2026",
    hook: "Rising above the noise with integrity and commitment.",
    caption: "Mind and body in congruence: practice becoming resolve.",
    storySummary:
      "Written about the moments where you have a simple choice: rise above or drown. 'Some selves are meant to burn. Not to be erased, but to be refined and released so the truer thing can rise.'",
    visualThread: "Sharp angular lines, bold red marks, and forward momentum.",
    journalSlug: "resolve",
    makingNote: "Fast-driving tempo with an immediate vocal entry and driving rhythm section.",
    technicalNote: "Dual guitar buses for wide stereo separation, punchy drum transients, and tight slap vocal delay."
  },
  {
    trackNumber: 7,
    title: "Poetry",
    duration: "4:31",
    audioFileName: "7. Poetry.wav",
    phase: "Released September 1, 2026",
    hook: "Finding the genuine thing underneath the performance.",
    caption: "Heartbreak turned into shared humanity: language first, raw guitar second.",
    storySummary:
      "Started by John during a breakup, borrowing Marianne Moore's line: 'I too, dislike it... but, there is in it after all, a place for the genuine.' When Terry stepped in, he added the cry: 'You are poetry. You are fiercity. Write your life. Share your humanity!'",
    visualThread: "Notebook scans, handwritten margins, and spilled ink textures.",
    journalSlug: "poetry",
    makingNote: "Arranged around spoken word phrasing, notebook lyric fragments, and Terry's vocal additions.",
    technicalNote: "Midrange-focused vocal presence, gentle acoustic and guitar beds, leaving room for the lyric to breathe."
  },
  {
    trackNumber: 8,
    title: "Gratitude",
    duration: "3:30",
    audioFileName: "8. Gratitude.wav",
    phase: "Released September 1, 2026",
    hook: "Closing the record with peace, brotherhood, and a full heart.",
    caption: "The emotional closing note: gratitude for the music, the friendship, and the journey.",
    storySummary:
      "Terry wept listening to John's arrangement, recognizing the anchor he had sought over decades: 'Being a part of this record has changed my life. Thank you John Walls for hearing the music in me and bringing me along. I love you brother.'",
    visualThread: "Warm sunrise glow, soft golden arcs, and open borders.",
    journalSlug: "gratitude",
    makingNote: "Written and recorded to serve as the exhale at the end of the journey.",
    technicalNote: "Warm vocal harmony stacks, gentle bus compression, and high-end air for a peaceful fade."
  },
  {
    trackNumber: 9,
    title: "The Genuine Thing",
    duration: "3:23",
    audioFileName: "9. The Genuine Thing.wav",
    phase: "Volume 1 Extended Master",
    hook: "From my journal to your headphones: meeting the listener inside the genuine thing.",
    caption: "Living-room funk, screaming tube guitars, and spoken vulnerability.",
    storySummary:
      "Written as the direct bridge from the studio to the listener's heart. Channeling Marianne Moore's reminder that underneath the performance of life there is a place for the genuine. John's Mint-Green P-Bass drives the groove while Terry's screaming guitars and spoken testimony dismantle the distance between artist and audience: 'You are poetry. You are fiercity. Write your life. Share your humanity!'",
    visualThread: "Golden amber orbits, handwritten journal margins, and raw tape grain.",
    journalSlug: "the-genuine-thing",
    makingNote: "Constructed as the definitive Listening Room communion piece, transitioning from intimate pick scratches and funk bass into roaring dual-guitar catharsis and a warm gratitude exhale.",
    technicalNote: "Tracked with Mint-Green P-Bass through analog tube drive, dual Vox AC30 and Mesa Mark guitar busses, cosmic harmonium stereo delays, and mastered with TransparentSoftLimiter at -0.3 dBFS."
  }
];
