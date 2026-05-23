export type AnchorConfig = {
  label: string;
  id?: string;
  href?: string;
  isEnabled?: boolean;
};

const anchorRegistry: AnchorConfig[] = [
  
];

export const anchors = anchorRegistry.filter((anchor) => anchor.isEnabled !== false);

export const anchorIds = anchors.flatMap((anchor) => (anchor.id ? [anchor.id] : []));
