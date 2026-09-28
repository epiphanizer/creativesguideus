import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";

const aboutCards = [
  {
    title: "Record Production & Sonic Direction",
    body: "From tracking on analog tape to spatial audio mixing, original soundtrack composition, and release packaging. We direct records that feel lived-in, acoustic, and timeless."
  },
  {
    title: "Screenwriting & Narrative Strategy",
    body: "Feature treatments, character bibles, narrative packaging, and soundtrack integration for films, streaming series, and long-form storytelling."
  },
  {
    title: "Creative Engineering & Identity",
    body: "Bespoke typography, editorial web flagships, and high-performance interactive rooms built to outlast corporate design cycles."
  }
];

const generalConversationHref = buildContactHref({});
const systemsConversationHref = buildContactHref({
  overrides: {
    context: "campaign-operations",
    goal: "operations",
    surface: "release-operations",
    engagement: "agency-support"
  }
});

export function ContactLandingPage() {
  return (
    <main className="cg-page cg-contact-page" id="hero">
      <SectionShell id="contact-landing" labelledBy="contact-landing-title" innerClassName="cg-contact-landing">
        <section className="cg-contact-landing__hero" aria-labelledby="contact-landing-title">
          <div className="cg-contact-landing__copy">
            <p className="cg-contact-landing__eyebrow">CREATIVES GUIDE US · STUDIO INQUIRIES</p>
            <h1 id="contact-landing-title" className="cg-contact-landing__title">
              Studio Commissions, Soundtrack Licensing &amp; Creative Direction.
            </h1>
            <p className="cg-contact-landing__lede">
              Creatives Guide Us collaborates with independent artists, directors, and cultural brands on ambitious releases. Whether you are licensing a soundtrack cue, commissioning an editorial web platform, or packaging a feature screenplay, this is the direct line to our team.
            </p>
            <p>
              We accept a limited number of partner commissions each season to ensure uncompromising focus across sonic production, narrative framing, and technical execution.
            </p>
          </div>

          <div className="cg-contact-landing__actions">
            <ContactModalLink href={generalConversationHref} buttonVariant="primary">
              Start a Conversation →
            </ContactModalLink>
            <ContactModalLink href={systemsConversationHref} buttonVariant="ghost">
              Inquire About a Commission
            </ContactModalLink>
            <p className="cg-contact-landing__note">
              Direct studio inquiries: <a href="mailto:hello@creativesguide.us">hello@creativesguide.us</a>
            </p>
          </div>
        </section>

        <section className="cg-contact-landing__about" aria-labelledby="contact-about-title">
          <div className="cg-contact-landing__about-copy">
            <SectionHeader
              id="contact-about-title"
              headingLevel="h2"
              eyebrow="Studio Philosophy"
              title="A unified practice for sound, screen, and software."
              description="Creatives Guide Us operates across record production, screenplay development, and creative engineering. We direct complete release worlds where the music, the story, and the graphic object reinforce each other."
            />
            <p>
              We believe independent culture thrives when creative direction is not separated from technical execution. From analog tape tracking in the live room to bespoke typography and modern web engineering, we build artifacts that feel tactile, enduring, and unmistakable.
            </p>
          </div>

          <div className="cg-contact-landing__about-grid">
            {aboutCards.map((card) => (
              <article key={card.title} className="cg-contact-landing__card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>
      </SectionShell>
    </main>
  );
}

export default ContactLandingPage;