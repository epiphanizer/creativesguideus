import { Button } from "@/components/ui/Button";
import { CaseStudyTemplate } from "@/components/work/CaseStudyTemplate";

const heroActions = (
  <Button as="a" href="/#contact">
    Request a rehearsal audit
  </Button>
);

export default function LeadMeGuideMeCaseStudy() {
  return (
    <main className="cg-page">
      <CaseStudyTemplate
        id="lead-me-guide-me"
        hero={{
          eyebrow: "Case study",
          title: "Lead Me Guide Me",
          description: "iOS scripture companion for choir leaders",
          body: [
            "We partnered with the Lead Me Guide Me liturgy collective to craft a precision-built mobile companion that keeps choir directors in Scripture while organizing weekly rehearsals.",
            "The sprint braided UX, composition, and editorial voice so directors could move from verse to rehearsal cue without juggling separate tools."
          ],
          actions: heroActions
        }}
        quickFacts={[
          { label: "Partner", value: "Lead Me Guide Me liturgy collective" },
          { label: "Practices", value: "Product direction · UX · Original score" },
          { label: "Platform", value: "iOS native · SwiftUI" },
          { label: "Timeline", value: "12-week private beta" },
          { label: "Release mode", value: "Daily scripture companion for choir teams" }
        ]}
        highlights={[
          {
            title: "Scripture-led rehearsal flow",
            detail: "Daily meditations stack with choir-friendly prompts, giving directors an instant run of verse, teaching point, and cue."
          },
          {
            title: "Voice-matched scoring",
            detail: "Original scoring cues land in playable stems, letting choirs rehearse dynamics at the same pace as their readings."
          },
          {
            title: "Partner enablement",
            detail: "We delivered onboarding rituals and a narrative kit so ministry leads could frame the app without us in the room."
          }
        ]}
        narrative={[
          {
            title: "Listening before structure",
            paragraphs: [
              "We ran listening sessions with choir directors, music ministers, and choir mothers to map how scripture prep actually happens during the week.",
              "Insights pushed us to prioritize morning reflections, rehearsal prep, and Sunday service anchor points instead of building a generic reading plan."
            ]
          },
          {
            title: "Designing the rehearsal loop",
            paragraphs: [
              "Wireframes anchored around a single flow: verse of the day, commentary, rehearsal tasks, and playback.",
              "We composed thirty bespoke score cues matched to the calendar, each with dynamic markings and tempo notes so directors could rehearse quickly.",
              "Accessibility passes kept typography large and contrasty, letting leaders reference the app on dim stages."
            ]
          },
          {
            title: "Stewarding launch",
            paragraphs: [
              "We piloted with three choirs, running weekly office hours and monitoring analytics to tune the cadence.",
              "A launch kit—talking points, pastoral letter template, and one-minute walkthrough video—armed ministry leads to invite their teams with confidence.",
              "Post-launch, we stayed in the loop to refine notifications and extend the repertoire catalog."
            ]
          }
        ]}
        process={[
          {
            title: "Discovery choir rounds",
            detail: "Six interviews and two rehearsal audits surfaced friction points before we touched wireframes."
          },
          {
            title: "Experience blueprint",
            detail: "Journey map, content sequencing, and tonal guardrails aligned with pastoral leadership."
          },
          {
            title: "Build and compose sprint",
            detail: "SwiftUI build paired with score production, weekly proofs, and TestFlight drops."
          },
          {
            title: "Beta stewardship",
            detail: "Analytics review, cue tuning, and onboarding support across the first 30 days."
          }
        ]}
        deliverables={[
          {
            label: "iOS companion app",
            detail: "SwiftUI build with scripture flows, rehearsal tasks, and dynamic font scaling."
          },
          {
            label: "Score library",
            detail: "Thirty bespoke cues exported as stems and lead sheets inside the app."
          },
          {
            label: "Narrative kit",
            detail: "Copy deck, FAQ, and pastoral framing guide for ministry leaders."
          },
          {
            label: "Launch rituals",
            detail: "Weekly rehearsal template, notification cadence, and post-service reflection prompts."
          },
          {
            label: "Analytics dashboard",
            detail: "Lightweight Looker Studio board tracking engagement, cue plays, and prayer streaks."
          }
        ]}
        quote={{
          text: "This build felt like worship design in motion—our directors finally have a single space that honors Scripture and the work of rehearsal.",
          attribution: "Tasha Benton · Creative Director, Lead Me Guide Me"
        }}
        closing={{
          note: "Your next release can braid story, product, and score the same way. Let’s map the first four weeks together.",
          actionLabel: "Scale Your Release Momentum",
          actionHref: "/#contact"
        }}
      />
    </main>
  );
}
