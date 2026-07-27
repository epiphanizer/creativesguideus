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
    audioFileName: "1 -Joint Queen.wav",
    phase: "Album week",
    hook: "Mythic command and smoke-crowned swagger.",
    caption: "Joint Queen opens the room like a coronation with sparks in every corner.",
    storySummary:
      "Terry frames Joint Queen as the moment the project stopped sounding like two separate catalogs and finally sounded like Us. Its groove is the joy thesis of Volume 1 and the first real door into the record's identity.",
    visualThread: "Crown, throne energy, and smoke plumes bending toward center lightning.",
    journalSlug: "joint-queen",
    makingNote: "Built from a live bass pass first, then the brass hooks were written as call-and-response to match the character power dynamic.",
    technicalNote: "Layer stack: fuzz bass + dry DI blend, short spring reverb on brass, parallel drum crush bus for poster-like punch.",
    bongTourCueId: "score-joint-queen",
    bongTourContext: "Featured in Bong Tour's Comedy Store takeover montage."
  },
  {
    trackNumber: 2,
    title: "Stash Daddy",
    duration: "3:35",
    audioFileName: "2- Stash Daddy.wav",
    phase: "Album week",
    hook: "Backroom confidence with analog danger.",
    caption: "Stash Daddy runs on low-end pressure and late-night authority.",
    storySummary:
      "Born from a kitchen-table joke and a loose studio loop, Stash Daddy became Terry's first proof that recording could be relaxed, direct, and alive in real time. Its swagger comes from creation without rehearsal or ritualized fear.",
    visualThread: "Stacks, records, and wired speaker geometry with hard red shadows.",
    journalSlug: "stash-daddy",
    makingNote: "Started as a one-bar loop from a modular jam and expanded around dialogue pacing from the screenplay sequences.",
    technicalNote: "Primary pulse from mono synth + sub octave, tabla accents side-chained to kick for movement without mud.",
    bongTourCueId: "score-stash-daddy",
    bongTourContext: "Featured in Bong Tour's Sunset backroom plotting scenes."
  },
  {
    trackNumber: 3,
    title: "Space Cruiser",
    duration: "3:12",
    audioFileName: "3 - Space Cruiser.wav",
    phase: "Album week",
    hook: "Cosmic drift with ritual propulsion.",
    caption: "Space Cruiser lifts the grid into orbit before dropping back into grit.",
    storySummary:
      "John wrote the first sketch after a brutal live show, then returned to it when Bong Tour needed a cosmic third door. The finished version became a collage of delays, Indian vocal color, and one last bong-rip blessing.",
    visualThread: "Celestial beam language tied to the center seal and border corners.",
    journalSlug: "space-cruiser",
    makingNote: "Wrote the ambient bed to mirror the river-return sequence, then reintroduced pulse late to keep narrative momentum.",
    technicalNote: "Processed tanpura texture + vocal pad layers, 5/4 time grid with delayed downbeat to sustain lift.",
    bongTourCueId: "score-space-cruiser",
    bongTourContext: "Featured in Bong Tour's Ganges finale and myth closure."
  },
  {
    trackNumber: 4,
    title: "Conviction",
    duration: "TBA",
    phase: "September 1 chapter",
    hook: "A pressure line held in reserve until the record opens.",
    caption: "Conviction is the sealed fourth chapter: a hard-edged promise of what still has not been heard.",
    storySummary:
      "Conviction holds the fourth chapter in place until Volume 1 opens on September 1, turning the title into a statement of nerve, discipline, and forward motion.",
    visualThread: "Red-thread geometry, steel diagonals, and sealed typography that reads like a vow under pressure.",
    journalSlug: "conviction",
    makingNote: "Conviction keeps the fourth chapter visible until the full track arrives on September 1.",
    technicalNote: "No audio yet. Full credits and platform links arrive with the September 1 release.",
    isPlaceholder: true
  },
  {
    trackNumber: 5,
    title: "Decay",
    duration: "2:43",
    audioFileName: "5 - Decay.wav",
    phase: "Album week",
    hook: "Beautiful ruin with stubborn pulse.",
    caption: "Decay is where vines, amps, and memory collapse into one final sermon.",
    storySummary:
      "Terry heard John's invitation to treat Decay as the metal song and finally trusted his own instincts at full volume. The result turns collapse into testimony, with screaming guitars and spoken-word fragments carrying death-expressed-as-life energy.",
    visualThread: "Overgrowth motifs, cracked objects, and high-contrast rot textures.",
    journalSlug: "decay",
    makingNote: "Composed from fragments of earlier sessions to reflect collapse and reconstruction in the song arc.",
    technicalNote: "Resampled guitar harmonics through granular chain, then filtered for decayed top-end texture."
  },
  {
    trackNumber: 6,
    title: "Resolve",
    duration: "3:15",
    audioFileName: "6 - Resolve.wav",
    phase: "Lead single · June 28",
    hook: "The ignition track that lights the campaign fuse.",
    caption: "Resolve lands first and sets the terms for everything that follows.",
    storySummary:
      "Resolve is the campaign spark: a song about choosing the self that survives the crucible. The story underneath it is discipline becoming instinct and self-contract turning into action.",
    visualThread: "Fist-forward iconography, hard lightning diagonals, and pressure lines.",
    journalSlug: "resolve",
    makingNote: "Written as the campaign spark with a deliberate, immediate chorus entry for first-listen impact.",
    technicalNote: "Fast transient shaping on drums, dual guitar buses, and a narrow vocal slap for forward focus."
  },
  {
    trackNumber: 7,
    title: "Poetry",
    duration: "4:31",
    audioFileName: "7 - Poetry.wav",
    phase: "Album focus",
    hook: "Writerly nerve and scarred tenderness.",
    caption: "Poetry is the heart chamber of Volume 1 and a strong album-focus pitch.",
    storySummary:
      "John started Poetry in breakup fallout and chased the genuine thing beneath performance, vanity, and heartbreak. Terry's additions widened it from private confession into a shared statement about humanity and self-authorship.",
    visualThread: "Notebook relics, pen marks, and inward smoke forms from the Walls side.",
    journalSlug: "poetry",
    makingNote: "Core lyric was cut from notebook scans and rebuilt into the final arrangement line by line.",
    technicalNote: "Midrange-forward mix, restrained low-end, and close vocal room reflections to keep language intimate."
  },
  {
    trackNumber: 8,
    title: "Gratitude",
    duration: "3:30",
    audioFileName: "8 - Gratitude.wav",
    phase: "Post-release sustain",
    hook: "Open-hearted lift after the storm.",
    caption: "Gratitude holds the final glow and keeps the record emotionally open.",
    storySummary:
      "The closer deepened for Terry once it locked into the final slot on the album. Gratitude carries the sound of real arrival: peace, brotherhood, and devotion to something larger than the self.",
    visualThread: "Sunrise motifs, floral arcs, and soft radiance under engraved borders.",
    journalSlug: "gratitude",
    makingNote: "Finished last to function as the emotional exhale after the record's denser chapters.",
    technicalNote: "Wide harmony stack with soft bus compression and high shelf lift for final-scene brightness."
  }
];
