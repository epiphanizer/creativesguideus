export type SongPostCard = {
  title: string;
  phase: string;
  hook: string;
  caption: string;
  visualThread: string;
  journalSlug: string;
  makingNote: string;
  technicalNote: string;
  bongTourCueId?: string;
  bongTourContext?: string;
};

export type RoadmapStep = {
  date: string;
  milestone: string;
  detail: string;
};

export const releaseIdentity = {
  spotifyTitle: "Volume 1",
  spotifyArtistLine: "by Walls & Devine",
  marketingLine: "Walls & Devine: Volume 1",
  marketingDate: "Out 06/04/26"
};

export const cadenceGuidance =
  "Spotify does not enforce a strict every-30-days rule, but each release creates a new discovery moment. Keep Resolve as ignition, Volume 1 as launch, and instrumentals as the second wave roughly four to five weeks later.";

export const roadmapSteps: RoadmapStep[] = [
  {
    date: "May 24, 2026",
    milestone: "Resolve single",
    detail: "Lead with Resolve as a pre-album ignition and preserve metadata for album carryover."
  },
  {
    date: "June 4, 2026",
    milestone: "Volume 1 album",
    detail: "Use Volume 1 by Walls & Devine as the clean platform title and run the full campaign phrase in captions."
  },
  {
    date: "July 10, 2026",
    milestone: "Volume 1: Instrumentals",
    detail: "Launch as a separate release with new ISRCs for instrumental recordings and a fresh post cycle."
  }
];

export const sharedCaptionStarter =
  "Walls & Devine: Volume 1. Out 06/04/26. Eight chapters, one lightning seam.";

export const songPostCards: SongPostCard[] = [
  {
    title: "Joint Queen",
    phase: "Album week",
    hook: "Mythic command and smoke-crowned swagger.",
    caption: "Joint Queen opens the room like a coronation with sparks in every corner.",
    visualThread: "Crown, throne energy, and smoke plumes bending toward center lightning.",
    journalSlug: "joint-queen",
    makingNote: "Built from a live bass pass first, then the brass hooks were written as call-and-response to match the character power dynamic.",
    technicalNote: "Layer stack: fuzz bass + dry DI blend, short spring reverb on brass, parallel drum crush bus for poster-like punch.",
    bongTourCueId: "score-joint-queen",
    bongTourContext: "Featured in Bong Tour's Comedy Store takeover montage."
  },
  {
    title: "Stash Daddy",
    phase: "Album week",
    hook: "Backroom confidence with analog danger.",
    caption: "Stash Daddy runs on low-end pressure and late-night authority.",
    visualThread: "Stacks, records, and wired speaker geometry with hard red shadows.",
    journalSlug: "stash-daddy",
    makingNote: "Started as a one-bar loop from a modular jam and expanded around dialogue pacing from the screenplay sequences.",
    technicalNote: "Primary pulse from mono synth + sub octave, tabla accents side-chained to kick for movement without mud.",
    bongTourCueId: "score-stash-daddy",
    bongTourContext: "Featured in Bong Tour's Sunset backroom plotting scenes."
  },
  {
    title: "Space Cruiser",
    phase: "Album week",
    hook: "Cosmic drift with ritual propulsion.",
    caption: "Space Cruiser lifts the grid into orbit before dropping back into grit.",
    visualThread: "Celestial beam language tied to the center seal and border corners.",
    journalSlug: "space-cruiser",
    makingNote: "Wrote the ambient bed to mirror the river-return sequence, then reintroduced pulse late to keep narrative momentum.",
    technicalNote: "Processed tanpura texture + vocal pad layers, 5/4 time grid with delayed downbeat to sustain lift.",
    bongTourCueId: "score-space-cruiser",
    bongTourContext: "Featured in Bong Tour's Ganges finale and myth closure."
  },
  {
    title: "Home",
    phase: "Album week",
    hook: "Grounded warmth in the middle of electric weather.",
    caption: "Home turns the loud world inward and makes the myth personal.",
    visualThread: "Pathways, porch glow, and note trails that echo writing-side symbols.",
    journalSlug: "home",
    makingNote: "Tracked as a quieter session break and kept the first vocal take for emotional honesty.",
    technicalNote: "Minimal chain: acoustic layers, low-noise room mic, and gentle tape saturation for warmth."
  },
  {
    title: "Decay",
    phase: "Album week",
    hook: "Beautiful ruin with stubborn pulse.",
    caption: "Decay is where vines, amps, and memory collapse into one final sermon.",
    visualThread: "Overgrowth motifs, cracked objects, and high-contrast rot textures.",
    journalSlug: "decay",
    makingNote: "Composed from fragments of earlier sessions to reflect collapse and reconstruction in the song arc.",
    technicalNote: "Resampled guitar harmonics through granular chain, then filtered for decayed top-end texture."
  },
  {
    title: "Resolve",
    phase: "Lead single · May 24",
    hook: "The ignition track that lights the campaign fuse.",
    caption: "Resolve lands first and sets the terms for everything that follows.",
    visualThread: "Fist-forward iconography, hard lightning diagonals, and pressure lines.",
    journalSlug: "resolve",
    makingNote: "Written as the campaign spark with a deliberate, immediate chorus entry for first-listen impact.",
    technicalNote: "Fast transient shaping on drums, dual guitar buses, and a narrow vocal slap for forward focus."
  },
  {
    title: "Poetry",
    phase: "Album focus",
    hook: "Writerly nerve and scarred tenderness.",
    caption: "Poetry is the heart chamber of Volume 1 and a strong album-focus pitch.",
    visualThread: "Notebook relics, pen marks, and inward smoke forms from the Walls side.",
    journalSlug: "poetry",
    makingNote: "Core lyric was cut from notebook scans and rebuilt into the final arrangement line by line.",
    technicalNote: "Midrange-forward mix, restrained low-end, and close vocal room reflections to keep language intimate."
  },
  {
    title: "Gratitude",
    phase: "Post-release sustain",
    hook: "Open-hearted lift after the storm.",
    caption: "Gratitude holds the final glow and keeps the record emotionally open.",
    visualThread: "Sunrise motifs, floral arcs, and soft radiance under engraved borders.",
    journalSlug: "gratitude",
    makingNote: "Finished last to function as the emotional exhale after the record's denser chapters.",
    technicalNote: "Wide harmony stack with soft bus compression and high shelf lift for final-scene brightness."
  }
];