import { Button } from "@/components/ui/Button";
import { CaseStudyTemplate } from "@/components/work/CaseStudyTemplate";

const heroActions = (
  <>
    <Button as="a" href="/#contact">Start a project</Button>
    <Button as="a" href="https://appreesh.org" target="_blank" rel="noreferrer" variant="ghost">
      View live site
    </Button>
  </>
);

export default function AppreeshCaseStudy() {
  return (
    <main className="cg-page">
      <CaseStudyTemplate
        id="appreesh"
        hero={{
          eyebrow: "Case study",
          title: "Gratitude as a ritual-first protocol",
          description: "Public gratitude portal and Solana/Anchor prototype where tribute and recognition matter more than market theater.",
          body: [
            "Appreesh is best understood today as a ritual-first gratitude system: a live public-facing brand and web surface paired with a Solana/Anchor workspace that is still maturing toward deeper tribute and collector utility. We helped frame the product, choreograph the language, and build the launch kit so communities could circulate appreciation without defaulting to extractive mechanics.",
            "The strongest public promise is not a finished token economy. It is a gratitude layer that makes tribute, recognition, and future collector utility legible while the underlying protocol continues to mature."
          ],
          actions: heroActions
        }}
        quickFacts={[
          { label: "Partner", value: "Appreesh Cooperative" },
          { label: "Practices", value: "Product direction · Protocol design · Brand + score" },
          { label: "Platform", value: "Next.js public web layer · Solana/Anchor workspace" },
          { label: "Timeline", value: "18-week build" },
          { label: "Release mode", value: "Pilot gratitude protocol with ritual-first launch framing" }
        ]}
        proof={[
          { label: "Timeline", value: "18-week build" },
          { label: "Platform", value: "Next.js + Solana/Anchor" },
          { label: "Release mode", value: "Pilot-grade runtime" }
        ]}
        highlights={[
          {
            title: "Rituals over speculation",
            detail: "The product thesis favors tribute, recognition, and seasonal unlock logic over forced market language."
          },
          {
            title: "Wallet-ready without overclaiming",
            detail: "The system can already speak to tribute, vault, and collector utility paths without pretending the full distribution layer is live end to end."
          },
          {
            title: "Launch language with protocol gravity",
            detail: "Editorial UX, ritual copy, and product framing make the gratitude logic legible before the deeper on-chain layer takes center stage."
          },
          {
            title: "Launch kits with music",
            detail: "A composed score, brand system, and storytelling scripts let stewards host gratitude ceremonies online or in-person."
          }
        ]}
        narrative={[
          {
            title: "Discovery",
            paragraphs: [
              "We workshopped why gratitude needs a protocol at all. Personas across artists, co-ops, and culture builders defined success as sustained appreciation and visible recognition, not yield.",
              "Those insights shaped the manifesto, cooperative framing, and tribute logic so every future feature could ladder back to the same social promise."
            ]
          },
          {
            title: "Design",
            paragraphs: [
              "Game designers, economists, and choir directors (yes, really) pressure-tested the ritual flow: request, nominate, celebrate, and route gratitude with intention.",
              "The interaction model and the Solana/Anchor protocol concepts were designed side-by-side so the product could stay legible while the underlying runtime matures."
            ]
          },
          {
            title: "Build + Launch",
            paragraphs: [
              "We developed the public web layer, ritual framing, and launch-system surfaces while the Anchor workspace defined tribute, hook, and vault mechanics for the next stage.",
              "The result is a real public-facing product surface and a pilot-grade protocol core, not a finished public token economy pretending to be further along than it is."
            ]
          }
        ]}
        process={[
          {
            title: "Cooperative discovery",
            detail: "Workshops, policy drafting, and legal consultations to define membership and token flow."
          },
          {
            title: "Experience + protocol framing",
            detail: "Service blueprints, UX flows, and Solana/Anchor tribute mechanics shaped in tandem."
          },
          {
            title: "Build + validation",
            detail: "Front-end implementation, Anchor workspace development, pilot testing, and launch instrumentation."
          },
          {
            title: "Launch stewardship",
            detail: "Ritual facilitation, playbook training, and analytics tuning through the first season."
          }
        ]}
        deliverables={[
          {
            label: "Protocol prototype",
            detail: "Anchor workspace for tribute, hook, and vault mechanics plus the framing for future governance paths."
          },
          {
            label: "Public product surface",
            detail: "Web experience, ritual messaging, and entry points that explain tribute without forcing crypto-native fluency."
          },
          {
            label: "Launch instrumentation",
            detail: "Operational reporting, cohort review, and launch signal tracking for the first gratitude season."
          },
          {
            label: "Brand + score",
            detail: "Visual system, typography, sonic palette, and launch EP for gratitude gatherings."
          },
          {
            label: "Steward playbook",
            detail: "Ceremony scripts, content kits, and post-season review templates."
          }
        ]}
        quote={{
          text: "We didn’t need another hype token—we needed a ritual. This build made the gratitude economy feel tangible from day one.",
          attribution: "Rae Ibarra · Co-founder, Appreesh"
        }}
        closing={{
          note: "Let’s build your cooperative so gratitude feels tangible from day one.",
          actionLabel: "Start a project",
          actionHref: "/#contact"
        }}
        related={[
          {
            title: "Lead Me Guide Me",
            description: "SwiftUI scripture companion proving how product, ritual, and score release together.",
            href: "/work/lead-me-guide-me"
          },
          {
            title: "World Cup Dreams",
            description: "Athlete-led WordPress system that pairs narrative clarity with measurable donor momentum.",
            href: "/work/world-cup-dreams"
          }
        ]}
      />
    </main>
  );
}
