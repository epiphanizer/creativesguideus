import { Button } from "@/components/ui/Button";
import { CaseStudyTemplate } from "@/components/work/CaseStudyTemplate";

const heroActions = (
  <>
    <Button as="a" href="https://appreesh.org" target="_blank" rel="noreferrer">
      Explore Appreesh
    </Button>
    <Button as="a" href="/#contact" variant="ghost">
      Spin up a community pilot
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
          title: "Gratitude as a cooperative economy",
          description: "Web3 gifting platform where rituals, not speculation, keep the token alive.",
          body: [
            "Appreesh is a gratitude co-op backed by smart contracts, but guided by real human rituals. We co-founded the product, choreographed the brand, and built the launch kit so communities could circulate thank-yous without defaulting to extractive mechanics.",
            "Every surface—from onboarding to treasury dashboards—runs with deliberate contrast and clarity. Tokens move with purpose, founders steward the loop, and contributors see value beyond price swings."
          ],
          actions: heroActions
        }}
        quickFacts={[
          { label: "Partner", value: "Appreesh Cooperative" },
          { label: "Practices", value: "Product direction · Protocol design · Brand + score" },
          { label: "Platform", value: "Next.js front end · Solidity contracts · The Graph analytics" },
          { label: "Timeline", value: "18-week build and invite-only launch" },
          { label: "Release mode", value: "Tokenized gratitude rituals for creative communities" }
        ]}
        highlights={[
          {
            title: "Rituals over speculation",
            detail: "Token flows tied to gratitude prompts, peer nominations, and season-based unlocks keep the treasury human."
          },
          {
            title: "Wallet onboarding without fear",
            detail: "Guided onboarding walks newcomers through custodial or self-custody paths while translating crypto jargon into plain language."
          },
          {
            title: "Transparent treasury dashboards",
            detail: "Live dashboards show inflows, outflows, and participation metrics so the community sees exactly how value circulates."
          },
          {
            title: "Launch kits with music",
            detail: "A composed score, brand system, and storytelling scripts let stewards host gratitude ceremonies online or in-person."
          }
        ]}
        narrative={[
          {
            title: "Naming the economy",
            paragraphs: [
              "We started by workshopping why gratitude needs a protocol. Personas from artists, DAOs, and co-ops defined success as sustained appreciation—not yield.",
              "This shaped the manifesto, cooperative charter, and token policy so every future feature could ladder up to the same promise."
            ]
          },
          {
            title: "Designing the loop",
            paragraphs: [
              "Game designers, economists, and choir directors (yes, really) pressure-tested the ritual flow: request, nominate, celebrate, allocate.",
              "Smart contracts track issuance and burn while UX keeps the loop legible: steps, status, and gratitude stories stay side-by-side."
            ]
          },
          {
            title: "Shipping the cooperative",
            paragraphs: [
              "We developed the Next.js front end, Solidity contracts, subgraphs, and admin console, then ran dry-runs with 40 founding members.",
              "The launch kit—brand film, score EP, ceremonial scripts, and analytics board—gave stewards everything needed to run the first gratitude season."
            ]
          }
        ]}
        process={[
          {
            title: "Cooperative discovery",
            detail: "Workshops, policy drafting, and legal consultations to define membership and token flow."
          },
          {
            title: "Experience + protocol design",
            detail: "Service blueprints, UX flows, and smart contract architecture working in tandem."
          },
          {
            title: "Build + audit",
            detail: "Front-end, contract development, third-party audits, and data pipeline instrumentation."
          },
          {
            title: "Launch stewardship",
            detail: "Ritual facilitation, playbook training, and analytics tuning through the first season."
          }
        ]}
        deliverables={[
          {
            label: "Token protocol",
            detail: "Issuance + burn contracts, multi-sig treasury controls, and governance parameters."
          },
          {
            label: "Member experience",
            detail: "Wallet onboarding, gratitude feed, nomination flows, and ceremony scheduler."
          },
          {
            label: "Analytics + reporting",
            detail: "Subgraph-powered dashboards, cohort analysis, and alerting for stewards."
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
          note: "Let’s build your next cooperative so the community feels the ritual—not the risk.",
          actionLabel: "Build Your Cooperative Future",
          actionHref: "/#contact"
        }}
      />
    </main>
  );
}
