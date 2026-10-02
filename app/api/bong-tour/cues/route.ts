import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type BongTourCue = {
  id: string;
  trackNumber: number;
  title: string;
  scenePlacement: string;
  act: string;
  durationLabel: string;
  audioSrc: string;
  logline: string;
  albumTitle: string;
  albumHref: string;
};

const bongTourCues: BongTourCue[] = [
  {
    id: "joint-queen",
    trackNumber: 1,
    title: "Joint Queen",
    scenePlacement: "The Comedy Store Entrance & Bacchanal",
    act: "Act I / Act II",
    durationLabel: "3:42",
    audioSrc: "/walls-devine/releases/volume1/1. Joint Queen.wav",
    logline: "An entrance cue with authority and swagger. The trio crosses the threshold from street desperation into Hollywood underworld madness.",
    albumTitle: "Walls/Devine Volume 1",
    albumHref: "/walls-devine"
  },
  {
    id: "space-cruiser",
    trackNumber: 3,
    title: "Space Cruiser",
    scenePlacement: "Sunset Boulevard Van Ride",
    act: "Act I",
    durationLabel: "4:15",
    audioSrc: "/walls-devine/releases/volume1/3. Space Cruiser.wav",
    logline: "Cosmic stoner propulsion through neon gridlock traffic as Vishal spirals and Drew clutches the mysterious relic.",
    albumTitle: "Walls/Devine Volume 1",
    albumHref: "/walls-devine"
  },
  {
    id: "stash-daddy",
    trackNumber: 2,
    title: "Stash Daddy",
    scenePlacement: "The C-Lister's Penthouse & Shaman DMT Council",
    act: "Act II",
    durationLabel: "3:58",
    audioSrc: "/walls-devine/releases/volume1/2. Stash Daddy.wav",
    logline: "Nocturnal groove setting the trap. The A-Lister refuses a pitch and demands the sacred DMT test: 'Does the little person have to die?'",
    albumTitle: "Walls/Devine Volume 1",
    albumHref: "/walls-devine"
  },
  {
    id: "poetry",
    trackNumber: 7,
    title: "Poetry",
    scenePlacement: "The Ganges, West Bengal & Montu's Sacrifice",
    act: "Act III",
    durationLabel: "4:06",
    audioSrc: "/walls-devine/releases/volume1/7. Poetry.wav",
    logline: "The inward spiritual core. Language first, ornament second. Baba Gandalfi's law echoes: 'The Bong can only preserve life. It cannot extend it.'",
    albumTitle: "Walls/Devine Volume 1",
    albumHref: "/walls-devine"
  }
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    scoreSource: "Walls/Devine Volume 1 · Creatives Guide Us Sound Lab",
    albumHref: "/walls-devine",
    count: bongTourCues.length,
    cues: bongTourCues
  });
}
