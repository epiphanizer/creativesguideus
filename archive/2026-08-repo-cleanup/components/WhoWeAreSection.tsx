import Image from "next/image";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

export function WhoWeAreSection() {
  return (
    <SectionShell id="who" labelledBy="who-title">
      <div className="cg-who">
        <SectionHeader
          id="who-title"
          eyebrow="Crew Notes"
          title="Who we are (today, and soon)"
          description="One part cosmic Terry, one part legendary-to-be John. We build futures with a wink and a playlist."
        />

        <div className="cg-who__grid">
          <article className="cg-who__card" aria-labelledby="terry-devine">
            <div className="cg-who__media">
              <Image src="/images/terry.jpg" alt="Terry Devine laughing under studio lights" fill sizes="(max-width: 768px) 100vw, 480px" priority />
            </div>
            <div className="cg-who__body">
              <h3 id="terry-devine" className="cg-who__name">
                Terry Devine
              </h3>
              <p className="cg-who__role">Experience Conductor</p>
              <p className="cg-who__prompt">Writes the playbook and the punchline.</p>
              <ul className="cg-who__quirks">
                <li>Codes with one ear tuned for leitmotifs.</li>
                <li>Takes product roadmaps on snack runs.</li>
                <li>Insists launch decks sparkle and sing.</li>
              </ul>
            </div>
          </article>

          <article className="cg-who__card cg-who__card--placeholder" aria-labelledby="john-walls">
            <div className="cg-who__media cg-who__media--placeholder" aria-hidden="true">
              <span className="cg-who__avatar-initials">JW?</span>
            </div>
            <div className="cg-who__body">
              <h3 id="john-walls" className="cg-who__name">
                John Walls
              </h3>
              <p className="cg-who__role">Placeholder Adventurer</p>
              <p className="cg-who__prompt">Auditioning legends welcome.</p>
              <ul className="cg-who__quirks">
                <li>Open seat for the next co-conspirator.</li>
                <li>Bring your favorite debugging superstition.</li>
                <li>Let’s storyboard your origin together.</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </SectionShell>
  );
}

export default WhoWeAreSection;
