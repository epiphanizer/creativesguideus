"use client";

import { seanhallsWorkHref } from "@/lib/studio-links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cg-footer">
      <div className="cg-footer__inner">
        <p className="cg-footer__manifesto">Release the signal. Keep the channel alive.</p>
        <div className="cg-footer__links" aria-label="Footer links">
          <a className="cg-footer__link" href="/links">
            Links
          </a>
          <a className="cg-footer__link" href={seanhallsWorkHref} target="_blank" rel="noreferrer">
            Selected work
          </a>
          <a className="cg-footer__link" href="mailto:hello@creativesguide.us">
            hello@creativesguide.us
          </a>
        </div>
        <small className="cg-footer__copyright">© {currentYear} Creatives Guide Us, LLC.</small>
      </div>
    </footer>
  );
}
