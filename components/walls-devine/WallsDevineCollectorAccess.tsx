"use client";

import { createPortal } from "react-dom";
import { type ReactNode, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cx } from "@/lib/cx";

import { EcosystemSignupForm } from "./EcosystemSignupForm";

type WallsDevineCollectorAccessProps = {
  source: string;
  interest: string;
  cardEyebrow?: string;
  cardTitle: string;
  cardDescription: string;
  triggerLabel?: string;
  benefits?: string[];
  actionNote?: string;
  modalEyebrow?: string;
  modalTitle?: string;
  modalDescription?: string;
  signupEyebrow?: string;
  signupTitle?: string;
  signupDescription?: string;
  submitLabel?: string;
  successMessage?: string;
  note?: string;
  roomOverlayScript?: string;
  roomOverlaySubtitle?: string;
  className?: string;
  variant?: "feature" | "inline";
  renderTrigger?: (openSignalRoom: () => void) => ReactNode;
};

export function WallsDevineCollectorAccess({
  source,
  interest,
  cardEyebrow,
  cardTitle,
  cardDescription,
  triggerLabel = "Enter The Signal Room",
  benefits = [],
  actionNote,
  modalEyebrow = "Collector access",
  modalTitle = "Enter The Signal Room",
  modalDescription = "Drop your email for first-listen links, hidden-room returns, journal fragments, and artifact-drop signals.",
  signupEyebrow,
  signupTitle,
  signupDescription,
  submitLabel = "Get first access",
  successMessage = "You are in. Watch your inbox for the next collector signal.",
  note = "High-signal only. Used for first listens, hidden-room access, and artifact drops.",
  roomOverlayScript = "The Signal Room",
  roomOverlaySubtitle = "Private collector access",
  className,
  variant = "feature",
  renderTrigger
}: WallsDevineCollectorAccessProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  const openSignalRoom = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      {renderTrigger ? (
        renderTrigger(openSignalRoom)
      ) : (
        <section className={cx("wd-collector-access", `wd-collector-access--${variant}`, className)} aria-label={cardTitle}>
          <div className="wd-collector-access__copy">
            {cardEyebrow ? <p className="wd-collector-access__eyebrow">{cardEyebrow}</p> : null}
            <h3 className="wd-collector-access__title">{cardTitle}</h3>
            <p className="wd-collector-access__description">{cardDescription}</p>
          </div>

          {benefits.length ? (
            <div className="wd-collector-access__benefits" aria-label="Collector access benefits">
              {benefits.map((benefit) => (
                <span key={benefit}>{benefit}</span>
              ))}
            </div>
          ) : null}

          <div className="wd-collector-access__actions">
            <Button type="button" variant="primary" onClick={openSignalRoom}>
              {triggerLabel}
            </Button>
            {actionNote ? <p className="wd-collector-access__action-note">{actionNote}</p> : null}
          </div>
        </section>
      )}

      {hasMounted && isOpen
        ? createPortal(
            <div className="wd-collector-access-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={() => setIsOpen(false)}>
              <div className="wd-collector-access-modal__panel" onClick={(event) => event.stopPropagation()}>
                <div className="wd-collector-access-modal__room-overlay" aria-hidden="true">
                  <span className="wd-collector-access-modal__room-overlay-script">{roomOverlayScript}</span>
                  <span className="wd-collector-access-modal__room-overlay-subtitle">{roomOverlaySubtitle}</span>
                </div>

                <div className="wd-collector-access-modal__header">
                  <div>
                    <p className="wd-collector-access-modal__eyebrow">{modalEyebrow}</p>
                    <h2 id={titleId}>{modalTitle}</h2>
                    <p>{modalDescription}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    Close
                  </Button>
                </div>

                <div className="wd-collector-access-modal__body">
                  {benefits.length ? (
                    <div className="wd-collector-access-modal__benefits" aria-label="Collector access includes">
                      {benefits.map((benefit) => (
                        <span key={benefit}>{benefit}</span>
                      ))}
                    </div>
                  ) : null}

                  <EcosystemSignupForm
                    className="wd-collector-access-modal__signup"
                    source={source}
                    interest={interest}
                    eyebrow={signupEyebrow}
                    title={signupTitle}
                    description={signupDescription}
                    submitLabel={submitLabel}
                    successMessage={successMessage}
                    note={note}
                    compact
                    emailOnly
                  />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export default WallsDevineCollectorAccess;