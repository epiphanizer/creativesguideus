import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";

const projectTypes = [
  "Walls & Devine",
  "Bong Tour",
  "Integrated Release System",
  "Score / Story Collaboration",
  "Something Else"
];

export function ContactSection() {
  return (
    <SectionShell id="contact" labelledBy="contact-title" innerClassName="cg-contact__shell">
      <div className="cg-contact">
        <div className="cg-contact__intro">
          <SectionHeader
            id="contact-title"
            eyebrow="UPLINK"
            title="Choose The Right Signal"
            description="Lead with the world that fits: album rollout, screenplay development, or a release system that needs score, story, and rollout aligned."
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
              <p>Two focused collaboration slots are open for partners ready to move with a defined creative world.</p>
            </div>
            <p>
              Prefer a direct uplink? Email <a href="mailto:hello@creativesguide.us">hello@creativesguide.us</a> with a calendar pin and
              release intel and the clearest next step you need. We reply within two studio days.
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
                Choose the signal
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
              INITIATE DIALOGUE
            </Button>
            <span className="cg-contact__privacy">Your intelligence stays within the core studio—always.</span>
          </div>
        </form>
      </div>
    </SectionShell>
  );
}
