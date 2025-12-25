"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { anchors } from "./nav/anchors";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
const CONTACT_ANCHOR_ID = "contact";

export function HeaderNav() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
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

  const handleNavigate = useCallback(
    (anchorId: string) => {
      if (pathname !== "/") {
        router.push(`/#${anchorId}`);

        return;
      }

      scrollToAnchor(anchorId);
    },
    [pathname, router, scrollToAnchor]
  );

  return (
    <header className="cg-header" role="banner">
      <a className="cg-header__skip" href="#hero">
        Skip to content
      </a>
      <div className="cg-header__inner">
        <a
          className="cg-header__identity"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            handleNavigate("hero");
          }}
        >
          <span className="cg-header__copy">
            <span className="cg-header__studio">Creatives Guide Us</span>
            <span className="cg-header__tagline">code · composition · story</span>
          </span>
        </a>
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
                    handleNavigate(anchor.id);
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
          onClick={() => handleNavigate(CONTACT_ANCHOR_ID)}
        >
          Build Your Future
        </button>
      </div>
    </header>
  );
}

export default HeaderNav;
