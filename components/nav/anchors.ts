export type AnchorConfig = {
  id: string;
  label: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  { id: "hero", label: "Vision" },
  // { id: "who", label: "Who We Are" },
  { id: "web", label: "Creative" },
  { id: "music", label: "Music" },
  { id: "writing", label: "Writing" }
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.map((anchor) => anchor.id);
