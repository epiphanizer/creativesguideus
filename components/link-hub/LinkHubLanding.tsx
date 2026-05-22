"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getLinkHubContent } from "@/lib/firebase/link-hub-public";
import { defaultLinkHubContent } from "@/lib/link-hub/content";

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function formatUpdatedAt(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently updated";
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function LinkHubLanding() {
  const [linkHub, setLinkHub] = useState(defaultLinkHubContent);

  useEffect(() => {
    let isActive = true;

    void getLinkHubContent().then((content) => {
      if (isActive) {
        setLinkHub(content);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const activeLinks = useMemo(() => linkHub.links.filter((link) => link.isActive), [linkHub.links]);
  const featuredLinkCount = useMemo(() => activeLinks.filter((link) => link.isFeatured).length, [activeLinks]);

  return (
    <main className="cg-page cg-link-hub-page" id="hero">
      <section className="cg-link-hub" aria-labelledby="cg-link-hub-title">
        <div className="cg-link-hub__masthead">
          <div className="cg-link-hub__masthead-top">
            <div className="cg-link-hub__identity">
              <span className="cg-link-hub__identity-mark">CGU</span>
              <div>
                <strong>Creatives Guide Us</strong>
                <small>sound · story · signal</small>
              </div>
            </div>

            <span className="cg-link-hub__status-pill">
              {activeLinks.length} live route{activeLinks.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="cg-link-hub__hero">
            <div className="cg-link-hub__intro">
              <p className="cg-link-hub__eyebrow">{linkHub.eyebrow}</p>
              <h1 id="cg-link-hub-title">{linkHub.title}</h1>
              <p className="cg-link-hub__description">{linkHub.description}</p>
            </div>

            <div className="cg-link-hub__summary">
              <div className="cg-link-hub__summary-grid">
                <article className="cg-link-hub__summary-card">
                  <span className="cg-link-hub__summary-label">Updated</span>
                  <strong>{formatUpdatedAt(linkHub.updatedAt)}</strong>
                  <p>Fresh jump links from the current CGU rooms.</p>
                </article>

                <article className="cg-link-hub__summary-card">
                  <span className="cg-link-hub__summary-label">Focus</span>
                  <strong>
                    {featuredLinkCount
                      ? `${featuredLinkCount} featured route${featuredLinkCount === 1 ? "" : "s"}`
                      : `${activeLinks.length} active route${activeLinks.length === 1 ? "" : "s"}`}
                  </strong>
                  <p>
                    {featuredLinkCount
                      ? "Priority rooms stay surfaced first for fast scanning on compact phones."
                      : "Everything live is stacked into one compact dispatch board."}
                  </p>
                </article>
              </div>

              <div className="cg-link-hub__meta-links">
                <Link href="/">Home</Link>
                <Link href="/work">Work</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="cg-link-hub__stack">
          {activeLinks.length ? (
            activeLinks.map((link, index) => {
              const external = isExternalHref(link.href);

              return (
                <a
                  key={link.id}
                  className={[
                    "cg-link-hub__card",
                    link.isFeatured ? "cg-link-hub__card--featured" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  <div className="cg-link-hub__card-head">
                    <div className="cg-link-hub__card-meta">
                      <span className="cg-link-hub__card-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="cg-link-hub__card-eyebrow">{link.eyebrow}</span>
                    </div>
                    {link.isFeatured ? <span className="cg-link-hub__card-badge">Featured</span> : null}
                  </div>

                  <div className="cg-link-hub__card-copy">
                    <h2>{link.title}</h2>
                    <p>{link.description}</p>
                  </div>

                  <div className="cg-link-hub__card-foot">
                    <span className="cg-link-hub__card-cta">{link.ctaLabel || "Open link"}</span>
                    <small>{external ? "External route" : "Inside CGU"}</small>
                  </div>
                </a>
              );
            })
          ) : (
            <article className="cg-link-hub__empty-state">
              <p className="cg-link-hub__card-eyebrow">Signal routes</p>
              <h2>The current dispatch board is being reset.</h2>
              <p>Check back shortly or head to the studio contact route for the cleanest next step.</p>
              <Link href="/contact" className="cg-link-hub__card-cta cg-link-hub__card-cta--inline">
                Open contact
              </Link>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}