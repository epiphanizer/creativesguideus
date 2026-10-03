"use client";

import { useMemo, useState, useTransition } from "react";

export type CalligraphicSignatureTitleProps = {
  domain: string;
  eyebrow?: string;
  kicker?: string;
  badgeText?: string;
  badgeHref?: string;
  className?: string;
};

export default function CalligraphicSignatureTitle({
  domain,
  eyebrow,
  kicker,
  badgeText,
  badgeHref,
  className = ""
}: CalligraphicSignatureTitleProps) {
  const [, startTransition] = useTransition();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chars = useMemo(() => {
    return domain.split("").map((char, index) => {
      const isDot = char === ".";
      // Stagger delays between 0.04s and 1.2s
      const delay = Math.round((0.05 + index * 0.055) * 100) / 100;
      return {
        char,
        isDot,
        delay
      };
    });
  }, [domain]);

  return (
    <div className={`cg-ink-title-wrap jw-signature-wrap ${className}`} aria-label={domain}>
      {eyebrow ? (
        <div className="jw-signature-eyebrow-row">
          <span className="jw-signature-eyebrow">{eyebrow}</span>
          {badgeText ? (
            badgeHref ? (
              <a href={badgeHref} className="jw-signature-badge jw-signature-badge--link">
                {badgeText}
              </a>
            ) : (
              <span className="jw-signature-badge">{badgeText}</span>
            )
          ) : null}
        </div>
      ) : null}

      <h1 className="cg-ink-title jw-signature-ink-title">
        {chars.map((item, idx) => (
          <span
            key={`${item.char}-${idx}`}
            className={`cg-ink-char ${item.isDot ? "cg-ink-char--dot" : ""} ${
              hoveredIndex === idx ? "cg-ink-char--hop" : ""
            }`}
            style={{
              animationDelay: `${item.delay}s`
            }}
            onMouseEnter={() => {
              startTransition(() => setHoveredIndex(idx));
            }}
            onMouseLeave={() => {
              startTransition(() => setHoveredIndex(null));
            }}
            onTouchStart={() => {
              startTransition(() => setHoveredIndex(idx));
            }}
            onTouchEnd={() => {
              startTransition(() => setHoveredIndex(null));
            }}
          >
            {item.char}
          </span>
        ))}
      </h1>

      {kicker ? <p className="cg-ink-title__kicker jw-signature-kicker">{kicker}</p> : null}
    </div>
  );
}
