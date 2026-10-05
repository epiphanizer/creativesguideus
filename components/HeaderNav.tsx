"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { anchors } from "./nav/anchors";
import {
  openWallsDevineListeningRoomShortcut,
  readWallsDevinePlayerDismissed,
  wallsDevineListeningRoomAnchorId,
  wallsDevinePlayerDismissedChangeEventName
} from "@/lib/wallsDevinePlayerBridge";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function HeaderNav() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const isWallsDevineRoute = pathname?.startsWith("/walls-devine") ?? false;
  const router = useRouter();
  const activeAnchors = useMemo(() => anchors, []);
  const anchorIds = useMemo(() => activeAnchors.flatMap((anchor) => (anchor.id ? [anchor.id] : [])), [activeAnchors]);
  const { activeId, manuallySetActiveId } = useActiveSection(anchorIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayerDismissed, setIsPlayerDismissed] = useState(false);
  const [isPastGate, setIsPastGate] = useState(pathname !== "/");

  useEffect(() => {
    if (pathname !== "/") {
      setIsPastGate(true);
      return;
    }

    const checkScroll = () => {
      const broadsheet = document.getElementById("broadsheet-editorial");
      if (broadsheet) {
        const rect = broadsheet.getBoundingClientRect();
        setIsPastGate(rect.top <= 120);
      } else {
        setIsPastGate(window.scrollY > 400);
      }
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [pathname]);

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

  const handleHomeNavigate = useCallback(() => {
    if (pathname !== "/") {
      router.push("/");
      closeMenu();
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
    closeMenu();
  }, [closeMenu, pathname, prefersReducedMotion, router]);

  const handleListeningRoomShortcut = useCallback(() => {
    if (!isWallsDevineRoute) {
      return;
    }

    closeMenu();

    openWallsDevineListeningRoomShortcut({
      isPlayerDismissed,
      prefersReducedMotion,
      onMissingTarget: () => {
        router.push(`/walls-devine#${wallsDevineListeningRoomAnchorId}`);
      }
    });
  }, [closeMenu, isPlayerDismissed, isWallsDevineRoute, prefersReducedMotion, router]);

  const handleWallsDevineSignup = useCallback(() => {
    closeMenu();
    document.getElementById("walls-devine-signal")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }, [closeMenu, prefersReducedMotion]);

  useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

  useEffect(() => {
    if (!isWallsDevineRoute) {
      setIsPlayerDismissed(false);
      return;
    }

    setIsPlayerDismissed(readWallsDevinePlayerDismissed());

    const handleDismissedChange = (event: Event) => {
      const nextState = (event as CustomEvent<{ isDismissed: boolean }>).detail?.isDismissed ?? false;
      setIsPlayerDismissed(nextState);
    };

    window.addEventListener(wallsDevinePlayerDismissedChangeEventName, handleDismissedChange);

    return () => {
      window.removeEventListener(wallsDevinePlayerDismissedChangeEventName, handleDismissedChange);
    };
  }, [isWallsDevineRoute]);

  return (
    <header
      className={["cg-header", pathname === "/" && !isPastGate ? "cg-header--gate-hidden" : ""].filter(Boolean).join(" ")}
      role="banner"
    >
      <a className="cg-header__skip" href="#hero">
        Skip to content
      </a>
      <div className="cg-header__inner">
        <a
          className="cg-header__identity"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            handleHomeNavigate();
          }}
        >
          <span className="cg-header__copy">
            <span className="cg-header__studio">CREATIVES GUIDE US</span>
            <span className="cg-header__tagline">STUDIO &amp; RECORD LABEL</span>
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
        </button>
        <div className={["cg-header__menu", isMenuOpen ? "cg-header__menu--open" : ""].filter(Boolean).join(" ")}>
          {activeAnchors.length ? (
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
          ) : null}
          <div className="cg-header__actions">
            {isWallsDevineRoute ? (
              <button type="button" className="cg-header__cta" onClick={handleWallsDevineSignup}>
                Join the list
              </button>
            ) : (
              <button
                type="button"
                className="cg-header__cta"
                onClick={() => {
                  router.push("/walls-devine");
                  closeMenu();
                }}
              >
                Walls/Devine
              </button>
            )}

            {isWallsDevineRoute ? (
              <button
                type="button"
                className="cg-header__utility-button"
                aria-label={isPlayerDismissed ? "Restore the listening room and jump to it" : "Jump to the listening room"}
                onClick={handleListeningRoomShortcut}
              >
                Listening Room
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderNav;
