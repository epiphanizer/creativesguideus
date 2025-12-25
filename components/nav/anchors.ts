export type AnchorConfig = {
  id: string;
  label: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  { id: "hero", label: "Vision" },
  { id: "who", label: "Who We Are" },
  { id: "web", label: "Software Systems" },
  { id: "work", label: "Outcomes" },
  { id: "music", label: "Sonic Authority" },
  { id: "writing", label: "Narrative Impact" }
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.map((anchor) => anchor.id);
