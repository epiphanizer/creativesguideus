export function Footer() {
  return (
    <footer className="cg-footer">
      <div className="cg-footer__inner">
        <p className="cg-footer__manifesto">Build more momentum. Command higher resonance.</p>
        <a className="cg-footer__email" href="mailto:hello@creativesguide.us">
          hello@creativesguide.us
        </a>
        <small className="cg-footer__copyright">© {new Date().getFullYear()} Creatives Guide Us. All rights observed.</small>
      </div>
    </footer>
  );
}
