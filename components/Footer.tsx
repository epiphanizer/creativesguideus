"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cg-footer">
      <div className="cg-footer__inner">
        <p className="cg-footer__manifesto">Independent creative studio &amp; record label in Los Angeles. Cut on analog tape, printed on real paper, made by actual humans with stubborn coffee habits.</p>
        <div className="cg-footer__links" aria-label="Footer links">
          <a className="cg-footer__link" href="/contact">
            Studio Inquiries
          </a>
          <a className="cg-footer__link" href="/links">
            Links
          </a>
          <a className="cg-footer__link" href="mailto:hello@creativesguide.us">
            hello@creativesguide.us
          </a>
        </div>
        <small className="cg-footer__copyright">© {currentYear} Creatives Guide Us, LLC. All rights reserved. Zero bots harmed in the making of this studio.</small>
      </div>
    </footer>
  );
}
