import type { LinkHubContent, LinkHubLink } from "@/lib/admin/types";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

const defaultUpdatedAt = "2026-05-17T00:00:00.000Z";

const defaultWallsDevineMerchLink = {
  id: "walls-devine-merch-shop",
  eyebrow: "Merch shop",
  title: "Walls/Devine Shop",
  description: "Open the Fourthwall merch room for Volume 1 apparel, printed goods, and release-world objects.",
  href: wallsDevineMerchShopHref,
  ctaLabel: "Open merch shop",
  isFeatured: true,
  isActive: true
} satisfies LinkHubLink;

export const defaultLinkHubContent: LinkHubContent = {
  eyebrow: "Signal routes",
  title: "Jump Through The Active Rooms",
  description: "A compact dispatch board for project worlds, direct studio routes, and the live surfaces orbiting Creatives Guide Us.",
  updatedAt: defaultUpdatedAt,
  links: [
    {
      id: "walls-devine",
      eyebrow: "Collector experience",
      title: "Walls/Devine Volume 1",
      description: "Enter the listening room, release journals, and collector access around Volume 1.",
      href: "/walls-devine",
      ctaLabel: "Enter Volume 1",
      isFeatured: true,
      isActive: true
    },
    {
      id: "bong-tour",
      eyebrow: "Screenplay portal",
      title: "Bong Tour",
      description: "Step into the poster world, screenplay portal, and cue deck around the record and score.",
      href: "/bong-tour",
      ctaLabel: "Enter Bong Tour",
      isFeatured: true,
      isActive: true
    },
    defaultWallsDevineMerchLink,
    {
      id: "contact",
      eyebrow: "Direct route",
      title: "Contact The Studio",
      description: "Start a build, book a room, or ask for the cleanest next move.",
      href: "/contact",
      ctaLabel: "Open contact",
      isFeatured: false,
      isActive: true
    }
  ]
};

export function normalizeLinkHubId(value: string, index = 0) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `link-${index + 1}`;
}

export function normalizeLinkHubLink(link: Partial<LinkHubLink> | null | undefined, index = 0): LinkHubLink {
  const fallback = defaultLinkHubContent.links[index] ?? {
    id: `link-${index + 1}`,
    eyebrow: "Jump link",
    title: `Link ${index + 1}`,
    description: "Add a destination and brief description from the admin console.",
    href: "/",
    ctaLabel: "Open link",
    isFeatured: false,
    isActive: true
  };

  const title = typeof link?.title === "string" && link.title.trim() ? link.title.trim() : fallback.title;
  const href = typeof link?.href === "string" && link.href.trim() ? link.href.trim() : fallback.href;

  return {
    id: normalizeLinkHubId(typeof link?.id === "string" && link.id.trim() ? link.id : `${title}-${index + 1}`, index),
    eyebrow: typeof link?.eyebrow === "string" && link.eyebrow.trim() ? link.eyebrow.trim() : fallback.eyebrow,
    title,
    description: typeof link?.description === "string" && link.description.trim() ? link.description.trim() : fallback.description,
    href,
    ctaLabel: typeof link?.ctaLabel === "string" && link.ctaLabel.trim() ? link.ctaLabel.trim() : fallback.ctaLabel,
    isFeatured: typeof link?.isFeatured === "boolean" ? link.isFeatured : fallback.isFeatured,
    isActive: typeof link?.isActive === "boolean" ? link.isActive : fallback.isActive
  };
}

function ensureWallsDevineMerchLink(links: LinkHubLink[]) {
  const alreadyPresent = links.some(
    (link) => link.id === defaultWallsDevineMerchLink.id || link.href.replace(/\/$/, "") === wallsDevineMerchShopHref.replace(/\/$/, "")
  );

  if (alreadyPresent) {
    return links;
  }

  const wallsIndex = links.findIndex((link) => link.id === "walls-devine" || link.href === "/walls-devine");
  const merchLink = normalizeLinkHubLink(defaultWallsDevineMerchLink, wallsIndex >= 0 ? wallsIndex + 1 : links.length);

  if (wallsIndex < 0) {
    return [...links, merchLink];
  }

  return [...links.slice(0, wallsIndex + 1), merchLink, ...links.slice(wallsIndex + 1)];
}

export function normalizeLinkHubContent(content?: Partial<LinkHubContent> | null): LinkHubContent {
  const links = ensureWallsDevineMerchLink(
    Array.isArray(content?.links) && content?.links.length ? content.links.map((link, index) => normalizeLinkHubLink(link, index)) : defaultLinkHubContent.links
  );

  return {
    eyebrow: typeof content?.eyebrow === "string" && content.eyebrow.trim() ? content.eyebrow.trim() : defaultLinkHubContent.eyebrow,
    title: typeof content?.title === "string" && content.title.trim() ? content.title.trim() : defaultLinkHubContent.title,
    description: typeof content?.description === "string" && content.description.trim() ? content.description.trim() : defaultLinkHubContent.description,
    updatedAt: typeof content?.updatedAt === "string" && content.updatedAt.trim() ? content.updatedAt.trim() : new Date().toISOString(),
    links
  } satisfies LinkHubContent;
}