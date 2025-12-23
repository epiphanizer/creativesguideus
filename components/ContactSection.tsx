import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";

const projectTypes = [
  "Software / Platforms",
  "Music / Sonic",
  "Story / Narrative",
  "Unified Engine",
  "Advisory / Labs"
];

export function ContactSection() {
  return (
    <SectionShell id="contact" labelledBy="contact-title">
      <div className="cg-contact">
        <div className="cg-contact__intro">
          <SectionHeader
            id="contact-title"
            eyebrow="Engage"
            title="Activate your bespoke engine"
            description="Two Q1 2026 residencies remain for future-ready partners—remote-friendly, intensely embedded."
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M4 7h16v10H4z" />
                <path d="M4 9l8 5 8-5" />
              </svg>
            }
            iconLabel="Creative contact emblem"
          />
          <div className="cg-contact__meta">
            <div className="cg-contact__slots" aria-label="Residency availability">
              <span>Residencies</span>
              <p>We hold just two Q1 2026 start dates. Secure your slot by sharing the impact you’re ready to scale.</p>
            </div>
            <p>
              Prefer a direct line? Email hello@creativesguide.us with a calendar link and the assets you want us to amplify—we respond within two studio days.
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
                Select the focus
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
            <Button type="submit" className="cg-contact__submit">
              Build Your Future Plan
            </Button>
            <span className="cg-contact__privacy">Your intelligence stays within the core studio—always.</span>
          </div>
        </form>
      </div>
    </SectionShell>
  );
}
