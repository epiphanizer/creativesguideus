import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";

const aboutCards = [
  {
    title: "Release worlds and creative direction",
    body: "We shape music worlds, launch systems, story framing, and the visual direction that lets a release feel lived in instead of merely announced."
  },
  {
    title: "Partnerships and narrative systems",
    body: "We help collaborations take the right form, from film and soundtrack conversations to collector paths, narrative infrastructure, and cross-surface campaigns."
  },
  {
    title: "Web, product, and operational backbone",
    body: "We design and build the quieter systems underneath the public layer: sites, product surfaces, admin tooling, workflow logic, and the operational structure that keeps the work coherent."
  }
];

const generalConversationHref = buildContactHref({});
const systemsConversationHref = buildContactHref({
  overrides: {
    context: "systems-build",
    goal: "systems",
    surface: "internal-platform",
    engagement: "systems-layer"
  }
});

export function ContactLandingPage() {
  return (
    <main className="cg-page cg-contact-page" id="hero">
      <SectionShell id="contact-landing" labelledBy="contact-landing-title" innerClassName="cg-contact-landing">
        <section className="cg-contact-landing__hero" aria-labelledby="contact-landing-title">
          <div className="cg-contact-landing__copy">
            <p className="cg-contact-landing__eyebrow">Creatives Guide Us</p>
            <h1 id="contact-landing-title" className="cg-contact-landing__title">
              Active project worlds first. The studio lane sits below.
            </h1>
            <p className="cg-contact-landing__lede">
              Walls/Devine and Bong Tour stay out front as the live public worlds. This page is the calmer studio layer underneath them: the place to reach the backbone behind the work, start a real conversation, and route the next move without losing context.
            </p>
            <p>
              Use it for direct contact, broader CGU framing, and the connective tissue behind release planning, partnerships, systems builds, and the evolving Appreesh layer.
            </p>
          </div>

          <div className="cg-contact-landing__actions">
            <ContactModalLink href={generalConversationHref} buttonVariant="primary">
              Start a Conversation
            </ContactModalLink>
            <ContactModalLink href={systemsConversationHref} buttonVariant="ghost">
              Tell Us What You&apos;re Building
            </ContactModalLink>
            <p className="cg-contact-landing__note">
              Prefer direct email? <a href="mailto:hello@creativesguide.us">hello@creativesguide.us</a>
            </p>
          </div>
        </section>

        <section className="cg-contact-landing__about" aria-labelledby="contact-about-title">
          <div className="cg-contact-landing__about-copy">
            <SectionHeader
              id="contact-about-title"
              headingLevel="h2"
              eyebrow="About us"
              title="A studio for sound, story, signal, and systems."
              description="Creatives Guide Us supports active project worlds like Walls/Devine, Bong Tour, and Appreesh, then carries the framing, build, and operating structure underneath them."
            />
            <p>
              The work can look like a release world, a film partnership, a narrative system, a product surface, or the operational infrastructure that keeps the whole thing from drifting apart. The point is not to separate those lanes too early. The point is to make the right one legible, then build from there.
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