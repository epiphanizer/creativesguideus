"use client";

import { seanhallsWorkHref } from "@/lib/studio-links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cg-footer">
      <div className="cg-footer__inner">
        <div className="cg-footer__links" aria-label="Footer links">
          <a className="cg-footer__link" href={seanhallsWorkHref} target="_blank" rel="noreferrer">
            Selected work
          </a>
          <span className="cg-footer__divider" aria-hidden="true">
            ·
          </span>
          <a className="cg-footer__link" href="mailto:hello@creativesguide.us">
            hello@creativesguide.us
          </a>
          <span className="cg-footer__divider" aria-hidden="true">
            ·
          </span>
          <small className="cg-footer__copyright">© {currentYear} Creatives Guide Us, LLC.</small>
          <span className="cg-footer__divider" aria-hidden="true">
            ·
          </span>
          <a className="cg-footer__link" href="/links">
            Links
          </a>
        </div>
      </div>
    </footer>
  );
}
