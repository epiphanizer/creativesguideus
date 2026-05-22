"use client";

import { useEffect } from "react";

import { ContactSection } from "@/components/ContactSection";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type ContactIntakeModalProps = {
  isOpen: boolean;
  initialSearch: string;
  onClose: () => void;
};

export function ContactIntakeModal({ isOpen, initialSearch, onClose }: ContactIntakeModalProps) {
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="cg-contact-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Guided contact intake"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="cg-contact-modal__panel">
        <button type="button" className="cg-contact-modal__close" onClick={onClose} aria-label="Close guided intake">
          Close
        </button>
        <ContactSection headingLevel="h2" initialSearch={initialSearch} surface="modal" />
      </div>
    </div>
  );
}

export default ContactIntakeModal;