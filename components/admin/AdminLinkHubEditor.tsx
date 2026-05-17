"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

import type { LinkHubContent, LinkHubLink } from "@/lib/admin/types";
import { normalizeLinkHubId } from "@/lib/link-hub/content";
import { Button } from "@/components/ui/Button";

type SaveState = "saving" | "deleting" | "success" | "error";

type AdminLinkHubEditorProps = {
  value: LinkHubContent;
  saveState?: SaveState;
  firestorePath: string;
  onSave: (nextValue: LinkHubContent) => Promise<void>;
};

function createDraftLink(index: number): LinkHubLink {
  const idSeed = `link-${Date.now()}-${index + 1}`;

  return {
    id: normalizeLinkHubId(idSeed, index),
    eyebrow: "",
    title: "",
    description: "",
    href: "",
    ctaLabel: "Open link",
    isFeatured: false,
    isActive: true
  } satisfies LinkHubLink;
}

function trimLink(link: LinkHubLink, index: number): LinkHubLink {
  const title = link.title.trim();
  const href = link.href.trim();

  return {
    ...link,
    id: normalizeLinkHubId(link.id || `${title || href || "link"}-${index + 1}`, index),
    eyebrow: link.eyebrow.trim(),
    title,
    description: link.description.trim(),
    href,
    ctaLabel: link.ctaLabel.trim() || "Open link"
  } satisfies LinkHubLink;
}

export function AdminLinkHubEditor({ value, saveState, firestorePath, onSave }: AdminLinkHubEditorProps) {
  const [draft, setDraft] = useState<LinkHubContent>(value);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setDraft(value);
    setLocalError("");
  }, [value]);

  const activeLinkCount = useMemo(() => draft.links.filter((link) => link.isActive).length, [draft.links]);

  function updateDraft(patch: Partial<LinkHubContent>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function updateLink(index: number, patch: Partial<LinkHubLink>) {
    setDraft((current) => ({
      ...current,
      links: current.links.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link))
    }));
  }

  function handleAddLink() {
    setDraft((current) => ({
      ...current,
      links: [...current.links, createDraftLink(current.links.length)]
    }));
  }

  function handleRemoveLink(index: number) {
    setDraft((current) => ({
      ...current,
      links: current.links.filter((_, linkIndex) => linkIndex !== index)
    }));
  }

  function handleMoveLink(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.links.length) {
        return current;
      }

      const nextLinks = [...current.links];
      const [movedLink] = nextLinks.splice(index, 1);
      nextLinks.splice(nextIndex, 0, movedLink);

      return {
        ...current,
        links: nextLinks
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextValue = {
      ...draft,
      eyebrow: draft.eyebrow.trim(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      links: draft.links.map(trimLink)
    } satisfies LinkHubContent;

    if (!nextValue.title) {
      setLocalError("Add a page title before saving the link hub.");
      return;
    }

    if (!nextValue.description) {
      setLocalError("Add a short page description before saving the link hub.");
      return;
    }

    const invalidLinkIndex = nextValue.links.findIndex((link) => !link.title || !link.href);

    if (invalidLinkIndex >= 0) {
      setLocalError(`Link ${invalidLinkIndex + 1} needs both a title and destination before it can be saved.`);
      return;
    }

    setLocalError("");
    await onSave(nextValue);
  }

  return (
    <article className="cg-admin__panel cg-admin__release-note-card">
      <div className="cg-admin__file-head">
        <div>
          <h3>Public link hub</h3>
          <p>Curate a Linktree-style jump page for CGU rooms, partner platforms, merch, ticketing, or anywhere else the active signal should point.</p>
        </div>
        <p className="cg-admin__path-note">Firestore: {firestorePath}</p>
      </div>

      <form onSubmit={handleSubmit} className="cg-admin__editor-form">
        <div className="cg-admin__editor-split">
          <label className="cg-admin__editor-field">
            <span>Eyebrow</span>
            <input
              type="text"
              className="cg-admin__editor-input"
              value={draft.eyebrow}
              onChange={(event) => updateDraft({ eyebrow: event.target.value })}
              placeholder="Signal routes"
            />
          </label>

          <label className="cg-admin__editor-field">
            <span>Page title</span>
            <input
              type="text"
              className="cg-admin__editor-input"
              value={draft.title}
              onChange={(event) => updateDraft({ title: event.target.value })}
              placeholder="Jump Through The Active Rooms"
              required
            />
          </label>
        </div>

        <label className="cg-admin__editor-field">
          <span>Intro copy</span>
          <textarea
            className="cg-admin__editor-textarea cg-admin__editor-textarea--compact"
            rows={4}
            value={draft.description}
            onChange={(event) => updateDraft({ description: event.target.value })}
            placeholder="Introduce the current rooms, platforms, or jump routes."
            required
          />
        </label>

        <div className="cg-admin__link-hub-toolbar">
          <p className="cg-admin__field-hint">
            {draft.links.length} configured link{draft.links.length === 1 ? "" : "s"} · {activeLinkCount} active on the public page
          </p>
          <div className="cg-admin__editor-actions">
            <a className="cg-admin__external-link" href="/links" target="_blank" rel="noreferrer">
              Open public page
            </a>
            <Button type="button" variant="ghost" size="sm" onClick={handleAddLink}>
              Add link
            </Button>
          </div>
        </div>

        <div className="cg-admin__link-hub-grid">
          {draft.links.map((link, index) => (
            <article
              key={link.id}
              className={[
                "cg-admin__link-hub-card",
                link.isFeatured ? "cg-admin__link-hub-card--featured" : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="cg-admin__link-hub-card-head">
                <div className="cg-admin__stack">
                  <strong>{link.title.trim() || `Link ${index + 1}`}</strong>
                  <span className="cg-admin__path-note">{link.href.trim() || "Add a destination path or external URL."}</span>
                </div>

                <div className="cg-admin__link-hub-card-controls">
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleMoveLink(index, -1)} disabled={index === 0}>
                    Up
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleMoveLink(index, 1)} disabled={index === draft.links.length - 1}>
                    Down
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveLink(index)}>
                    Remove
                  </Button>
                </div>
              </div>

              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Eyebrow</span>
                  <input
                    type="text"
                    className="cg-admin__editor-input"
                    value={link.eyebrow}
                    onChange={(event) => updateLink(index, { eyebrow: event.target.value })}
                    placeholder="Collector experience"
                  />
                </label>

                <label className="cg-admin__editor-field">
                  <span>Title</span>
                  <input
                    type="text"
                    className="cg-admin__editor-input"
                    value={link.title}
                    onChange={(event) => updateLink(index, { title: event.target.value })}
                    placeholder="Walls/Devine Volume 1"
                    required
                  />
                </label>
              </div>

              <label className="cg-admin__editor-field">
                <span>Description</span>
                <textarea
                  className="cg-admin__editor-textarea cg-admin__editor-textarea--compact"
                  rows={3}
                  value={link.description}
                  onChange={(event) => updateLink(index, { description: event.target.value })}
                  placeholder="Tell people what lives behind this route."
                />
              </label>

              <div className="cg-admin__editor-split">
                <label className="cg-admin__editor-field">
                  <span>Destination</span>
                  <input
                    type="text"
                    className="cg-admin__editor-input"
                    value={link.href}
                    onChange={(event) => updateLink(index, { href: event.target.value })}
                    placeholder="/walls-devine or https://example.com"
                    required
                  />
                </label>

                <label className="cg-admin__editor-field">
                  <span>CTA label</span>
                  <input
                    type="text"
                    className="cg-admin__editor-input"
                    value={link.ctaLabel}
                    onChange={(event) => updateLink(index, { ctaLabel: event.target.value })}
                    placeholder="Enter Volume 1"
                  />
                </label>
              </div>

              <div className="cg-admin__toggle-grid">
                <label className="cg-admin__toggle-pill">
                  <input type="checkbox" checked={link.isFeatured} onChange={(event) => updateLink(index, { isFeatured: event.target.checked })} />
                  <span>Featured card</span>
                </label>

                <label className="cg-admin__toggle-pill">
                  <input type="checkbox" checked={link.isActive} onChange={(event) => updateLink(index, { isActive: event.target.checked })} />
                  <span>Visible on /links</span>
                </label>
              </div>
            </article>
          ))}
        </div>

        {localError ? <p className="cg-admin__save-note cg-admin__save-note--error">{localError}</p> : null}

        <div className="cg-admin__editor-actions">
          <Button type="submit" variant="secondary" size="sm" disabled={saveState === "saving"}>
            Save link hub
          </Button>
          {saveState === "saving" ? <p className="cg-admin__save-note">Saving…</p> : null}
          {saveState === "success" ? <p className="cg-admin__save-note cg-admin__save-note--success">Saved.</p> : null}
          {saveState === "error" ? <p className="cg-admin__save-note cg-admin__save-note--error">Could not save the link hub.</p> : null}
        </div>
      </form>
    </article>
  );
}