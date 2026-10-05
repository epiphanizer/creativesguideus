"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cg-footer">
      <div className="cg-footer__inner">
        <p className="cg-footer__manifesto">The creative epicenter for independent sound, screen, and software craft based in Salt Lake City, operating globally. Sound production, screenwriting, and digital/physical editions.</p>
        <div className="cg-footer__links" aria-label="Footer links">
          <a className="cg-footer__link" href="/walls-devine">
            Walls/Devine
          </a>
          <a className="cg-footer__link" href="/links">
            Links
          </a>
          <a className="cg-footer__link" href="https://walls-devine.myshopify.com" target="_blank" rel="noopener noreferrer">
            Merch Shop
          </a>
          <a className="cg-footer__link" href="mailto:hello@creativesguide.us">
            hello@creativesguide.us
          </a>
        </div>
        <small className="cg-footer__copyright">© {currentYear} Creatives Guide Us, LLC. All rights reserved.</small>
      </div>
    </footer>
  );
}
