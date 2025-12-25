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
            eyebrow="UPLINK"
            title="Engineered for Momentum"
            description="Drop the signal when you’re ready to architect, score, and ship in the same sprint cadence."
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
              <p>We hold two seats for Q1 2026. Reserved for partners ready to move at the speed of their vision.</p>
            </div>
            <p>
              Prefer a direct uplink? Email hello@creativesguide.us with your calendar signal and mission intel—we respond inside two studio days.
            </p>
          </div>
        </div>

        <form className="cg-contact__form" method="post" action="#" noValidate>
          <div className="cg-contact__field">
            <label htmlFor="contact-name">Identify yourself</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Call sign, alias, or full name"
            />
          </div>

          <div className="cg-contact__field">
            <label htmlFor="contact-email">Contact uplink</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="founder@studio.com"
            />
          </div>

          <div className="cg-contact__field cg-contact__field--full">
            <label htmlFor="contact-project-type">Select the focus</label>
            <select id="contact-project-type" name="projectType" defaultValue="" required>
              <option value="" disabled>
                Choose the channel
              </option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="cg-contact__field cg-contact__field--full">
            <label htmlFor="contact-notes">Timeline, goals, and the playlist you're building to...</label>
            <textarea
              id="contact-notes"
              name="notes"
              rows={5}
              placeholder="Drop milestones, collaborators, and links we should spin up alongside you."
              required
            />
          </div>

          <div className="cg-contact__footer">
            <Button type="submit" className="cg-contact__submit">
              INITIATE BUILD
            </Button>
            <span className="cg-contact__privacy">Your intelligence stays within the core studio—always.</span>
          </div>
        </form>
      </div>
    </SectionShell>
  );
}
