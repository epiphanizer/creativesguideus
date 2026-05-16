import Image from "next/image";
import type { StaticImageData } from "next/image";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { songPostCards } from "@/components/walls-devine/content";
import { WallsDevineCollectorAccess } from "@/components/walls-devine/WallsDevineCollectorAccess";
import { type CollectorGridTile, WallsDevineCollectorGrid } from "@/components/walls-devine/WallsDevineCollectorGrid";
import decayImage from "@/app/walls-devine/assets/instagram/5.decay.png";
import gratitudeImage from "@/app/walls-devine/assets/instagram/8.gratitude.png";
import homeImage from "@/app/walls-devine/assets/instagram/4.home.png";
import jointQueenImage from "@/app/walls-devine/assets/instagram/1.joint-queen.png";
import poetryImage from "@/app/walls-devine/assets/instagram/7.poetry.png";
import resolveImage from "@/app/walls-devine/assets/instagram/6.resolve.png";
import spaceCruiserImage from "@/app/walls-devine/assets/instagram/3.space-cruiser.png";
import stashDaddyImage from "@/app/walls-devine/assets/instagram/2.stash-daddy.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

type GridTile = {
  slug: string;
  title: string;
  role: string;
  image: StaticImageData;
  playerTarget?: string;
  center?: boolean;
  teaser: string;
  challengeLabel: string;
  challengePrompt: string;
  easterEggTitle: string;
  easterEggBody: string;
  interest: string;
  gameMode: CollectorGridTile["gameMode"];
  tokenLabel: string;
  storySummary: string;
  visualThread: string;
  makingNote: string;
};

const songStoryMap = new Map(songPostCards.map((card) => [card.title, card]));

function withSongStory(tile: Omit<GridTile, "storySummary" | "visualThread" | "makingNote">): GridTile {
  const story = songStoryMap.get(tile.title);

  return {
    ...tile,
    storySummary: story?.storySummary ?? "A collector-side chapter from the larger Walls/Devine world.",
    visualThread: story?.visualThread ?? "Artifact geometry, bold type, and red-thread iconography.",
    makingNote: story?.makingNote ?? "Built to extend the physical world of the rollout beyond the listening room."
  } satisfies GridTile;
}

const instagramGrid: GridTile[] = [
  withSongStory({
    slug: "joint-queen",
    title: "Joint Queen",
    role: "Song 01",
    image: jointQueenImage,
    playerTarget: "joint-queen",
    teaser: "Smoke-crowned swagger and the first true door into the record.",
    challengeLabel: "Crown run",
    challengePrompt: "Grab five ember crowns before the smoke drops.",
    easterEggTitle: "The first crown",
    easterEggBody: "Joint Queen marks the moment the project stopped feeling split and finally sounded unified. That sense of arrival is the hidden engine behind the whole rollout.",
    interest: "Joint Queen collector list",
    gameMode: "crown-chase",
    tokenLabel: "crown"
  }),
  withSongStory({
    slug: "stash-daddy",
    title: "Stash Daddy",
    role: "Song 02",
    image: stashDaddyImage,
    playerTarget: "stash-daddy",
    teaser: "Backroom pressure, analog swagger, and low-end authority.",
    challengeLabel: "Vault pulse",
    challengePrompt: "Memorize the four-digit stash code before the shutters drop.",
    easterEggTitle: "Kitchen-table origin",
    easterEggBody: "Stash Daddy carries the sound of creation without rehearsal panic. The hidden note is that its attitude comes from spontaneity, not calculation.",
    interest: "Stash Daddy collector list",
    gameMode: "vault-code",
    tokenLabel: "vault"
  }),
  withSongStory({
    slug: "space-cruiser",
    title: "Space Cruiser",
    role: "Song 03",
    image: spaceCruiserImage,
    playerTarget: "space-cruiser",
    teaser: "Cosmic lift, ritual propulsion, and the third portal out of the room.",
    challengeLabel: "Orbital lock",
    challengePrompt: "Hit three perfect orbit locks before the cruiser drifts.",
    easterEggTitle: "Third door opened",
    easterEggBody: "Space Cruiser became the cosmic third door for both the record and Bong Tour, turning a brutal live-show comedown into mythic lift.",
    interest: "Space Cruiser collector list",
    gameMode: "orbit-lock",
    tokenLabel: "orbit"
  }),
  withSongStory({
    slug: "home",
    title: "Home",
    role: "Song 04",
    image: homeImage,
    playerTarget: "home",
    teaser: "The quiet middle chapter where the myth comes back to earth.",
    challengeLabel: "Porch pattern",
    challengePrompt: "Replay the porch lights before the house goes dark.",
    easterEggTitle: "Landing signal",
    easterEggBody: "Home holds the nervous-system reset of finally landing somewhere honest. The hidden note is that its power comes from keeping the first truthful take intact.",
    interest: "Home collector list",
    gameMode: "porch-lights",
    tokenLabel: "glow"
  }),
  {
    slug: "volume-1",
    title: "Walls/Devine Volume 1",
    role: "Collector's item",
    image: volOneImage,
    center: true,
    teaser: "The central object: one release world for music, film, score, and private access.",
    challengeLabel: "Seal sequence",
    challengePrompt: "Align the three seal rings before the object slips closed.",
    easterEggTitle: "Volume 1 is the artifact",
    easterEggBody: "The center tile is not a poster. It is the invitation layer: album object, score world, and private collector channel bundled into one deliberate experience.",
    interest: "Walls Devine Volume 1 collector list",
    gameMode: "seal-alignment",
    tokenLabel: "seal",
    storySummary: "The centerpiece holds the brand logic of the entire experience: make the album feel collectible, cinematic, and alive before anyone hears a note in sequence.",
    visualThread: "Central seal geometry, engraved borders, and the nine-tile wall as a single artifact instead of nine isolated posts.",
    makingNote: "Built as the campaign anchor so every surrounding chapter can ladder back into one premium collector experience."
  },
  withSongStory({
    slug: "decay",
    title: "Decay",
    role: "Song 05",
    image: decayImage,
    playerTarget: "decay",
    teaser: "Beautiful ruin, stubborn pulse, and collapse turned into testimony.",
    challengeLabel: "Rust line",
    challengePrompt: "Patch six breaks before the room fully decays.",
    easterEggTitle: "Collapse as design",
    easterEggBody: "Decay works because it treats collapse as style and witness at the same time. The hidden note is that its heaviness was a permission slip, not a detour.",
    interest: "Decay collector list",
    gameMode: "decay-patch",
    tokenLabel: "rust"
  }),
  withSongStory({
    slug: "resolve",
    title: "Resolve",
    role: "Song 06",
    image: resolveImage,
    playerTarget: "resolve",
    teaser: "The ignition track that sets campaign pressure and forward motion.",
    challengeLabel: "Spark run",
    challengePrompt: "Climb the fuse in order before the spark snaps.",
    easterEggTitle: "Campaign fuse",
    easterEggBody: "Resolve exists to move first. The hidden note is that its chorus lands early on purpose, because hesitation would undercut the whole campaign thesis.",
    interest: "Resolve collector list",
    gameMode: "spark-ladder",
    tokenLabel: "spark"
  }),
  withSongStory({
    slug: "poetry",
    title: "Poetry",
    role: "Song 07",
    image: poetryImage,
    playerTarget: "poetry",
    teaser: "Writerly nerve, heartbreak residue, and the record's heart chamber.",
    challengeLabel: "Notebook memory",
    challengePrompt: "Choose the right word each round to finish the line.",
    easterEggTitle: "Notebook reconstruction",
    easterEggBody: "Poetry widened from private confession into a shared statement. The hidden note is that its language was rebuilt line by line from notebook fragments.",
    interest: "Poetry collector list",
    gameMode: "line-break",
    tokenLabel: "line"
  }),
  withSongStory({
    slug: "gratitude",
    title: "Gratitude",
    role: "Song 08",
    image: gratitudeImage,
    playerTarget: "gratitude",
    teaser: "The closing lift: peace, glow, and open-ended arrival.",
    challengeLabel: "Bloom run",
    challengePrompt: "Open every bud, then trigger the final bloom.",
    easterEggTitle: "Final-scene glow",
    easterEggBody: "Gratitude was finished last so it could feel like emotional release, not simple closure. The hidden note is that its calm was engineered as the final image.",
    interest: "Gratitude collector list",
    gameMode: "bloom-garden",
    tokenLabel: "bloom"
  })
];

export function WallsDevineLanding() {
  return (
    <>
      <SectionShell id="hero" labelledBy="walls-devine-title" variant="hero" className="wd-hero-shell" innerClassName="wd-hero">
        <div className="wd-hero__marquee" aria-label="Experience mode">
          <span>Boutique unveiling</span>
          <span>Album object</span>
          <span>Companion score world</span>
        </div>

        <div className="wd-hero__layout">
          <div className="wd-hero__copy">
            <SectionHeader
              id="walls-devine-title"
              eyebrow="Collector experience"
              title="Walls/Devine Volume 1"
              description="Join the private collector email for first-listen links, studio-journal fragments, artifact drop notes, and release-night signals as each room opens across Volume 1."
              headingLevel="h1"
            />
          </div>

          <figure className="wd-hero__cover">
            <div className="wd-hero__cover-frame">
              <Image src={volOneImage} alt="Walls/Devine Volume 1 cover artwork" priority sizes="(max-width: 900px) 86vw, 38vw" />
            </div>
          </figure>
        </div>
      </SectionShell>

      <SectionShell id="walls-devine-grid" labelledBy="walls-devine-grid-title" className="wd-grid-shell" innerClassName="wd-grid-section">
        <header className="wd-grid-section__header">
          <h2 id="walls-devine-grid-title">The collector grid</h2>
          <p>
            Each tile now opens its own takeover room with a microgame, a hidden note, and a collector-circle capture designed to keep the rollout feeling premium rather than promotional.
          </p>
        </header>

        <WallsDevineCollectorGrid tiles={instagramGrid} />

        <div className="wd-grid-section__collector-access">
          <WallsDevineCollectorAccess
            source="walls-devine-grid"
            interest="Walls Devine collector signal list"
            cardEyebrow="Collector access"
            cardTitle="Keep the next room out of the feed and in your inbox"
            cardDescription="Skip the recap cycle. Get the shortest path to first-listen links, studio-journal fragments, hidden-room passwords, and artifact-drop signals as Volume 1 keeps opening."
            benefits={["First-listen links", "Studio-journal fragments", "Artifact and password drops"]}
            triggerLabel="Enter The Signal Room"
            modalTitle="Enter The Signal Room"
            modalDescription="Drop your email for the cleanest route to the next room opening, hidden-listen signal, and collector-only update."
            submitLabel="Get collector access"
            successMessage="You are in. Watch your inbox for the next room opening, journal fragment, and collector signal."
            note="High-signal only. Used for first listens, hidden-room access, and artifact drops."
            className="wd-grid-section__collector-access-card"
            variant="feature"
          />
        </div>
      </SectionShell>

      <div id="walls-devine-listening-room" className="wd-player-anchor" aria-hidden="true" />
    </>
  );
}

export default WallsDevineLanding;