"use client";

import { useCallback, useMemo } from "react";

import { anchors } from "./nav/anchors";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const CONTACT_ANCHOR_ID = "contact";

export function HeaderNav() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeAnchors = useMemo(() => anchors, []);
  const anchorIds = useMemo(() => activeAnchors.map((anchor) => anchor.id), [activeAnchors]);
  const { activeId, manuallySetActiveId } = useActiveSection(anchorIds);

  const scrollToAnchor = useCallback(
    (anchorId: string) => {
      const target = document.getElementById(anchorId);
      if (!target) {
        return;
      }

      manuallySetActiveId(anchorId);
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    },
    [manuallySetActiveId, prefersReducedMotion]
  );

  return (
    <header className="cg-header" role="banner">
      <a className="cg-header__skip" href="#hero">
        Skip to content
      </a>
      <div className="cg-header__inner">
        <div className="cg-header__identity">
          <span className="cg-header__studio">Creatives Guide Us</span>
          <span className="cg-header__tagline">web / music / writing</span>
        </div>
        <nav className="cg-header__nav" aria-label="Primary">
          <ul className="cg-header__list">
            {activeAnchors.map((anchor) => (
              <li key={anchor.id} className="cg-header__item">
                <a
                  href={`#${anchor.id}`}
                  className={[
                    "cg-header__link",
                    activeId === anchor.id ? "cg-header__link--active" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToAnchor(anchor.id);
                  }}
                >
                  {anchor.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="cg-header__cta"
          onClick={() => scrollToAnchor(CONTACT_ANCHOR_ID)}
        >
          Contact
        </button>
      </div>
    </header>
  );
}

export default HeaderNav;
