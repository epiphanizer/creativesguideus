import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";

const projectTypes = [
  "Brand / Web",
  "Music / Score",
  "Narrative / Writing",
  "Integrated (All Pillars)",
  "Consult / Advisory"
];

export function ContactSection() {
  return (
    <SectionShell id="contact" labelledBy="contact-title">
      <div className="cg-contact">
        <div className="cg-contact__intro">
          <SectionHeader
            id="contact-title"
            eyebrow="Contact"
            title="Start a composed launch"
            description="Two Q1 2026 openings — remote-friendly and deeply collaborative."
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M4 7h16v10H4z" />
                <path d="M4 9l8 5 8-5" />
              </svg>
            }
            iconLabel="Creative contact emblem"
            badge="Creative!!!"
          />
          <div className="cg-contact__meta">
            <p>
              Prefer a direct line? Email hello@creativesguide.us and include a calendar link if speed matters. We reply within two
              business days.
            </p>
          </div>
        </div>

        <form className="cg-contact__form" method="post" action="#" noValidate>
          <div className="cg-contact__field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required placeholder="Your name" />
          </div>

          <div className="cg-contact__field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="founder@studio.com"
            />
          </div>

          <div className="cg-contact__field">
            <label htmlFor="contact-project-type">Project Type</label>
            <select id="contact-project-type" name="projectType" defaultValue="" required>
              <option value="" disabled>
                Choose the focus
              </option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="cg-contact__field cg-contact__field--full">
            <label htmlFor="contact-notes">Project Notes</label>
            <textarea
              id="contact-notes"
              name="notes"
              rows={5}
              placeholder="Timeline, goals, collaborators, links..."
              required
            />
          </div>

          <div className="cg-contact__footer">
            <Button type="submit">Send project outline</Button>
            <span className="cg-contact__privacy">We never share details outside the project team.</span>
          </div>
        </form>
      </div>
    </SectionShell>
  );
}
