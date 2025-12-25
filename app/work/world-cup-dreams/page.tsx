import { Button } from "@/components/ui/Button";
import { CaseStudyTemplate } from "@/components/work/CaseStudyTemplate";

const heroActions = (
  <>
    <Button as="a" href="https://www.worldcupdreams.org/donate" target="_blank" rel="noreferrer">
      Donate
    </Button>
    <Button as="a" href="https://www.worldcupdreams.org/ways-to-give" target="_blank" rel="noreferrer" variant="ghost">
      Ways to give
    </Button>
  </>
);

export default function WorldCupDreamsCaseStudy() {
  return (
    <main className="cg-page">
      <CaseStudyTemplate
        id="world-cup-dreams"
        hero={{
          eyebrow: "Case study",
          title: "By the athlete. For the athlete.",
          description: "Funding and resources for the next generation of elite snow-sports athletes—from junior dreams to U.S. Ski Team podium pursuits.",
          body: [
            "Elite snowsport careers are built in thin air where talent is real and costs are relentless. World Cup Dreams Foundation turns fundraising into forward motion—a site that explains the pipeline, invites donors into impact, and guides athletes toward the right door without confusion.",
            "We delivered an athlete-led WordPress system so staff can update programs in seconds, surface fresh metrics, and keep every campaign in sync while athletes gain a high-resonance hub for season planning."
          ],
          actions: heroActions
        }}
        quickFacts={[
          { label: "Partner", value: "World Cup Dreams Foundation" },
          { label: "Practices", value: "Product strategy · UX · Editorial architecture" },
          { label: "Platform", value: "Custom WordPress build" },
          { label: "Timeline", value: "14-week redesign and rollout" },
          { label: "Release mode", value: "Athlete grants, fundraising campaigns, donor education" },
          { label: "Impact", value: "$7,000,000+ granted to athletes" },
          { label: "Metrics", value: "$10,000,000 raised · 265 athletes supported" }
        ]}
        highlights={[
          {
            title: "Story and mission pages",
            detail: "Editorial storytelling frames the World Cup Dream, clarifies why funding matters, and anchors donors in athlete voices tailored to each audience."
          },
          {
            title: "Clear pathways for athletes",
              detail: "Eligibility guides and application hubs cover ARCO (U16), On the Rise (16–21), World Cup (USST + invitees), and Team Support programs in one intuitive view."
          },
          {
            title: "Donor pathways",
            detail: "Giving options map to donor intent with compliance-ready copy, recurring gifts, and an athlete-led fundraising platform."
          },
          {
            title: "Program visibility",
            detail: "Team support spotlights cross-country training groups and connects them to funding drives without staff bottlenecks, using reusable blocks the staff can update in minutes."
          }
        ]}
        narrative={[
          {
            title: "Listening to athletes and donors",
            paragraphs: [
              "Stakeholder interviews surfaced two urgent needs: athletes craved clarity and dignity, while donors wanted transparency and proof. We rebuilt the architecture so both audiences meet the mission before choosing their path.",
              "Copy, imagery, and motion follow a disciplined hierarchy—athlete testimony, mission framing, fiscal transparency—to reinforce trust."
            ]
          },
          {
            title: "Grant pipeline without guesswork",
            paragraphs: [
              "We mapped every program—ARCO (U16), On the Rise (16–21), World Cup (USST + invitees), and Team Support—to a modular grid that translates policy into plain language.",
              "Eligibility checklists, timelines, and prep packs keep athletes moving, even when they are downloading forms from a lodge or bus, all managed through custom fields inside WordPress."
            ]
          },
          {
            title: "Fueling donor momentum",
            paragraphs: [
              "Donor pathways pair instant donations with ways-to-give guidance, sponsorship options, and athlete-led fundraising templates configured as reusable WordPress components.",
              "WCDF and T2 Foundation leadership alignment feeds one stewardship dashboard, so internal teams can launch campaigns and report impact in the same breath."
            ]
          }
        ]}
        process={[
          {
            title: "Discovery + immersion",
            detail: "Landscape analysis across elite snowsport nonprofits plus interviews with athletes, donors, and staff."
          },
          {
            title: "Narrative + experience architecture",
            detail: "Information architecture, message map, and tonal system that centers athlete voices."
          },
          {
            title: "Build + content sprint",
            detail: "Custom WordPress theme development, modular content modeling, component library, and collaborative copywriting weeks."
          },
          {
            title: "Launch + stewardship",
            detail: "Campaign toolkit, analytics setup, and donor journey testing to keep momentum post-launch."
          }
        ]}
        deliverables={[
          {
            label: "Responsive site",
            detail: "Custom WordPress theme with modular sections, accessibility audit, and performance tuning."
          },
          {
            label: "Grant navigator",
            detail: "Eligibility wizard, application timeline, and downloadable prep packs for every pathway."
          },
          {
            label: "Fundraising platform",
            detail: "Athlete campaign templates, compliance language, and donor confirmation flows managed inside WordPress reusable blocks."
          },
          {
            label: "Narrative kit",
            detail: "Mission framing, impact stats, and story library for press and partner outreach."
          },
          {
            label: "Reporting dashboard",
            detail: "Looker Studio views tracking donations, grant submissions, and campaign conversion."
          }
        ]}
        quote={{
          text: "The site finally sounds like our athletes. Donors know exactly where dollars go, and our staff has a decisive system to match need with support.",
          attribution: "Jessi Oglesby · Executive Director, World Cup Dreams Foundation"
        }}
        closing={{
          note: "If your nonprofit needs a clear grant pipeline and donor journey, we can map it in weeks—not quarters.",
          actionLabel: "Scale Your Nonprofit Impact",
          actionHref: "/#contact"
        }}
      />
    </main>
  );
}
