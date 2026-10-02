import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";

const aboutCards = [
  {
    title: "Sound & Records",
    body: "Live studio tracking, tube preamps pushed into the red, spatial mixing, and vinyl mastering. We make records with sweat and grit, not sterile digital presets."
  },
  {
    title: "Screenwriting & Story",
    body: "Feature screenplays, road comedies, and sharp dialogue written in the exact same room where the guitar amps are plugged in."
  },
  {
    title: "Print & Graphic Direction",
    body: "Hand-pulled woodcut prints, custom letterforms, heavy vinyl sleeves, and limited book editions designed to survive your next three moves."
  }
];

const generalConversationHref = buildContactHref({});
const commissionsHref = buildContactHref({
  overrides: {
    context: "studio-commissions",
    goal: "creative-direction",
    surface: "release-packaging",
    engagement: "studio-collaboration"
  }
});

export function ContactLandingPage() {
  return (
    <main className="cg-page cg-contact-page" id="hero">
      <SectionShell id="contact-landing" labelledBy="contact-landing-title" innerClassName="cg-contact-landing">
        <section className="cg-contact-landing__hero" aria-labelledby="contact-landing-title">
          <div className="cg-contact-landing__copy">
            <p className="cg-contact-landing__eyebrow">CREATIVES GUIDE US · DIRECT TO THE STUDIO</p>
            <h1 id="contact-landing-title" className="cg-contact-landing__title">
              Let&apos;s make something loud, tactile, or slightly unhinged.
            </h1>
            <p className="cg-contact-landing__lede">
              Creatives Guide Us collaborates with independent directors, musicians, and publishers who care about physical craft. Whether you need an original score tracked with real instruments, a road comedy script that doesn&apos;t read like an algorithm spat it out, or a hand-printed vinyl sleeve, this is the direct line to our desk.
            </p>
            <p>
              No account executives, no automated email drip sequences, and no 14-page questionnaires. Just two guys drinking black coffee in a room full of guitar amplifiers.
            </p>
          </div>

          <div className="cg-contact-landing__actions">
            <ContactModalLink href={generalConversationHref} buttonVariant="primary">
              Write to the Studio →
            </ContactModalLink>
            <ContactModalLink href={commissionsHref} buttonVariant="ghost">
              Propose a Commission
            </ContactModalLink>
            <p className="cg-contact-landing__note">
              Direct studio email (checked obsessively): <a href="mailto:hello@creativesguide.us">hello@creativesguide.us</a>
            </p>
          </div>
        </section>

        <section className="cg-contact-landing__about" aria-labelledby="contact-about-title">
          <div className="cg-contact-landing__about-copy">
            <SectionHeader
              id="contact-about-title"
              headingLevel="h2"
              eyebrow="The Way We Work"
              title="Sound, screen, and print—under one noisy roof."
              description="We don't believe in separating the music from the movie, or the cover art from the record sleeve. If you make something cool, the whole package should feel alive in your hands."
            />
            <p>
              From late-night tracking sessions in the live room to handset type and custom film scores, we focus exclusively on things you can touch, hear, and keep on your shelf.
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