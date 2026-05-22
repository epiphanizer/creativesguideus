export type AnchorConfig = {
  label: string;
  id?: string;
  href?: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  { href: "/walls-devine", label: "Walls/Devine" },
  { href: "/bong-tour", label: "Bong Tour" },
  { href: "/work", label: "Work" }
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.flatMap((anchor) => (anchor.id ? [anchor.id] : []));
