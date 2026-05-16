"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { anchors } from "./nav/anchors";
import { WallsDevineCollectorAccess } from "@/components/walls-devine/WallsDevineCollectorAccess";
import {
  readWallsDevinePlayerDismissed,
  requestWallsDevinePlayerRestore,
  wallsDevinePlayerDismissedChangeEventName
} from "@/lib/wallsDevinePlayerBridge";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function HeaderNav() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const isWallsDevineRoute = pathname?.startsWith("/walls-devine") ?? false;
  const isBongTourRoute = pathname?.startsWith("/bong-tour") ?? false;
  const router = useRouter();
  const activeAnchors = useMemo(() => anchors, []);
  const anchorIds = useMemo(() => activeAnchors.flatMap((anchor) => (anchor.id ? [anchor.id] : [])), [activeAnchors]);
  const { activeId, manuallySetActiveId } = useActiveSection(anchorIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPlayerRestore, setShowPlayerRestore] = useState(false);

  const headerRoom = useMemo(() => {
    if (isBongTourRoute) {
      return {
        buttonLabel: "Smoke Room",
        source: "header-nav-bong-tour",
        interest: "Bong Tour producer portal",
        cardTitle: "Enter The Smoke Room",
        cardDescription: "Get the shortest route to deck access, cue-world alignment, soundtrack conversations, and private Bong Tour updates.",
        benefits: ["Deck access", "Soundtrack alignment", "Packaging conversation"],
        modalEyebrow: "Producer portal",
        modalTitle: "Enter The Smoke Room",
        modalDescription: "Drop your email for the cleanest route to the Bong Tour deck, soundtrack-fit conversations, and private portal updates.",
        submitLabel: "Request the room key",
        successMessage: "You are in. Watch for the private deck route and next Bong Tour signal.",
        note: "Used for deck access, soundtrack conversations, and partner follow-up only.",
        roomOverlayScript: "The Smoke Room",
        roomOverlaySubtitle: "Deck, tone, and score in one move"
      };
    }

    if (isWallsDevineRoute) {
      return {
        buttonLabel: "Signal Room",
        source: "header-nav-walls-devine",
        interest: "Walls Devine collector signal list",
        cardTitle: "Enter The Signal Room",
        cardDescription: "Get the shortest route to first-listen links, journal fragments, hidden-room passwords, and release-night signals.",
        benefits: ["First-listen links", "Studio-journal fragments", "Hidden-room passwords"],
        modalEyebrow: "Collector access",
        modalTitle: "Enter The Signal Room",
        modalDescription: "Drop your email for the cleanest route to the next room opening, hidden-listen signal, and collector-only update.",
        submitLabel: "Get collector access",
        successMessage: "You are in. Watch your inbox for the next room opening, journal fragment, and collector signal.",
        note: "High-signal only. Used for first listens, hidden-room access, and artifact drops.",
        roomOverlayScript: "The Signal Room",
        roomOverlaySubtitle: "Private collector access"
      };
    }

    return {
      buttonLabel: "Signal Room",
      source: "header-nav-cgu",
      interest: "Creatives Guide Us private room",
      cardTitle: "Enter The Signal Room",
      cardDescription: "Get the shortest route to project openings, private room notes, and first-access signals across the current release worlds.",
      benefits: ["Project openings", "Private room notes", "First-access signals"],
      modalEyebrow: "Project access",
      modalTitle: "Enter The Signal Room",
      modalDescription: "Drop your email for the cleanest route to the next project room opening, private note, or first-access signal.",
      submitLabel: "Get room access",
      successMessage: "You are in. Watch for the next room opening and private project signal.",
      note: "High-signal only. Used for project openings, first-access notes, and private updates.",
      roomOverlayScript: "The Signal Room",
      roomOverlaySubtitle: "Project openings and private access"
    };
  }, [isBongTourRoute, isWallsDevineRoute]);

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

  useEffect(() => {
    if (!isWallsDevineRoute) {
      setShowPlayerRestore(false);
      return;
    }

    setShowPlayerRestore(readWallsDevinePlayerDismissed());

    const handleDismissedChange = (event: Event) => {
      const nextState = (event as CustomEvent<{ isDismissed: boolean }>).detail?.isDismissed ?? false;
      setShowPlayerRestore(nextState);
    };

    window.addEventListener(wallsDevinePlayerDismissedChangeEventName, handleDismissedChange);

    return () => {
      window.removeEventListener(wallsDevinePlayerDismissedChangeEventName, handleDismissedChange);
    };
  }, [isWallsDevineRoute]);

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
          <div className="cg-header__actions">
            <WallsDevineCollectorAccess
              source={headerRoom.source}
              interest={headerRoom.interest}
              cardTitle={headerRoom.cardTitle}
              cardDescription={headerRoom.cardDescription}
              triggerLabel={headerRoom.cardTitle}
              benefits={headerRoom.benefits}
              modalEyebrow={headerRoom.modalEyebrow}
              modalTitle={headerRoom.modalTitle}
              modalDescription={headerRoom.modalDescription}
              submitLabel={headerRoom.submitLabel}
              successMessage={headerRoom.successMessage}
              note={headerRoom.note}
              roomOverlayScript={headerRoom.roomOverlayScript}
              roomOverlaySubtitle={headerRoom.roomOverlaySubtitle}
              renderTrigger={(openSignalRoom) => (
                <button
                  type="button"
                  className="cg-header__cta"
                  onClick={() => {
                    closeMenu();
                    openSignalRoom();
                  }}
                >
                  {headerRoom.buttonLabel}
                </button>
              )}
            />

            {isWallsDevineRoute && showPlayerRestore ? (
              <div className="cg-header__player-return">
                <p>Portable player hidden. Bring the listening-room dock back any time from here.</p>
                <button
                  type="button"
                  className="cg-header__player-return-button"
                  onClick={() => {
                    requestWallsDevinePlayerRestore();
                    setShowPlayerRestore(false);
                    closeMenu();
                  }}
                >
                  Restore portable player
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderNav;
