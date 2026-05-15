export type AnchorConfig = {
  label: string;
  id?: string;
  href?: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  { id: "projects", label: "Projects" },
  { id: "music", label: "Music" },
  { id: "work", label: "Work" },
  { href: "/bong-tour", label: "Bong Tour" }
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.flatMap((anchor) => (anchor.id ? [anchor.id] : []));
