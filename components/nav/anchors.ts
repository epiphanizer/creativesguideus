export type AnchorConfig = {
  id: string;
  label: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  { id: "hero", label: "Home" },
  { id: "web", label: "Practice" },
  { id: "music", label: "Music" },
  { id: "writing", label: "Bong Tour" },
  { id: "contact", label: "Start" },
  { id: "partners", label: "Partners" }
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.map((anchor) => anchor.id);
