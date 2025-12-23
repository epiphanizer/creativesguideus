export type AnchorConfig = {
  id: string;
  label: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  { id: "hero", label: "Home" },
  { id: "web", label: "Web / Branding" },
  { id: "music", label: "Music" },
  { id: "writing", label: "Writing" },
  { id: "work", label: "Selected Work", isEnabled: true },
  { id: "about", label: "About / Process" },
  { id: "contact", label: "Contact" }
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.map((anchor) => anchor.id);
