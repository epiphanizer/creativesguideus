export type AnchorConfig = {
  id: string;
  label: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  { id: "hero", label: "Prologue" },
  { id: "web", label: "Studio Method" },
  { id: "work", label: "Proof" },
  { id: "music", label: "Scorebook" },
  { id: "writing", label: "Story Slate" },
  { id: "contact", label: "Begin Dialogue" }
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.map((anchor) => anchor.id);
