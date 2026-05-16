"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { anchors } from "./nav/anchors";
import { WallsDevineCollectorAccess } from "@/components/walls-devine/WallsDevineCollectorAccess";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function HeaderNav() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const activeAnchors = useMemo(() => anchors, []);
  const anchorIds = useMemo(() => activeAnchors.flatMap((anchor) => (anchor.id ? [anchor.id] : [])), [activeAnchors]);
  const { activeId, manuallySetActiveId } = useActiveSection(anchorIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

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
      } else {
        scrollToAnchor(anchorId);
      }

      closeMenu();
    },
    [closeMenu, pathname, router, scrollToAnchor]
  );

  const handleLinkNavigate = useCallback(
    (href: string) => {
      router.push(href);
      closeMenu();
    },
    [closeMenu, router]
  );

  useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

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
            <span className="cg-header__tagline">sound · story · signal</span>
          </span>
        </a>
        <button
          type="button"
          className={["cg-header__menu-toggle", isMenuOpen ? "cg-header__menu-toggle--open" : ""].filter(Boolean).join(" ")}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="cg-header__menu-toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="cg-header__menu-toggle-label">Menu</span>
        </button>
        <div className={["cg-header__menu", isMenuOpen ? "cg-header__menu--open" : ""].filter(Boolean).join(" ")}>
          <nav className="cg-header__nav" aria-label="Primary" id="primary-navigation">
            <ul className="cg-header__list">
              {activeAnchors.map((anchor) => (
                <li key={anchor.id ?? anchor.href ?? anchor.label} className="cg-header__item">
                  <a
                    href={anchor.id ? `#${anchor.id}` : anchor.href ?? "/"}
                    className={[
                      "cg-header__link",
                      anchor.id && activeId === anchor.id ? "cg-header__link--active" : "",
                      anchor.href && pathname === anchor.href ? "cg-header__link--active" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={(event) => {
                      event.preventDefault();
                      if (anchor.id) {
                        handleNavigate(anchor.id);
                        return;
                      }

                      if (anchor.href) {
                        handleLinkNavigate(anchor.href);
                      }
                    }}
                  >
                    {anchor.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <WallsDevineCollectorAccess
            source="header-nav"
            interest="Walls Devine collector signal list"
            cardTitle="Enter The Signal Room"
            cardDescription="Get the shortest route to first-listen links, journal fragments, hidden-room passwords, and release-night signals."
            triggerLabel="Enter The Signal Room"
            benefits={["First-listen links", "Studio-journal fragments", "Hidden-room passwords"]}
            modalTitle="Enter The Signal Room"
            modalDescription="Drop your email for the cleanest route to the next room opening, hidden-listen signal, and collector-only update."
            submitLabel="Get collector access"
            successMessage="You are in. Watch your inbox for the next room opening, journal fragment, and collector signal."
            note="High-signal only. Used for first listens, hidden-room access, and artifact drops."
            renderTrigger={(openSignalRoom) => (
              <button
                type="button"
                className="cg-header__cta"
                onClick={() => {
                  closeMenu();
                  openSignalRoom();
                }}
              >
                Signal Room
              </button>
            )}
          />
        </div>
      </div>
    </header>
  );
}

export default HeaderNav;
