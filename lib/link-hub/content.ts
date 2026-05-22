import type { LinkHubContent, LinkHubLink } from "@/lib/admin/types";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

const defaultUpdatedAt = "";
const wallsDevineMailingListHref = `/contact?${new URLSearchParams({
  context: "walls-devine-mailing-list",
  inquiryType: "mailing-list",
  project: "Walls/Devine"
}).toString()}`;

const defaultWallsDevineMailingListLink = {
  id: "walls-devine-mailing-list",
  eyebrow: "Signal route",
  title: "Walls/Devine Mailing List",
  description: "Route drop alerts, listening-room updates, and collector unlock notices through the CGU intake flow.",
  href: wallsDevineMailingListHref,
  ctaLabel: "Join mailing list",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

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
    defaultWallsDevineMailingListLink,
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

function ensureRequiredLinks(links: LinkHubLink[]) {
  let nextLinks = [...links];
  const wallsIndex = links.findIndex((link) => link.id === "walls-devine" || link.href === "/walls-devine");

  const requiredLinks = [defaultWallsDevineMailingListLink, defaultWallsDevineMerchLink];
  let insertedCount = 0;

  requiredLinks.forEach((requiredLink) => {
    const alreadyPresent = nextLinks.some(
      (link) => link.id === requiredLink.id || link.href.replace(/\/$/, "") === requiredLink.href.replace(/\/$/, "")
    );

    if (alreadyPresent) {
      return;
    }

    const insertionIndex = wallsIndex < 0 ? nextLinks.length : Math.min(wallsIndex + 1 + insertedCount, nextLinks.length);
    const normalizedLink = normalizeLinkHubLink(requiredLink, insertionIndex);
    nextLinks = [...nextLinks.slice(0, insertionIndex), normalizedLink, ...nextLinks.slice(insertionIndex)];
    insertedCount += 1;
  });

  if (wallsIndex < 0) {
    return nextLinks;
  }

  return nextLinks;
}

export function normalizeLinkHubContent(content?: Partial<LinkHubContent> | null): LinkHubContent {
  const links = ensureRequiredLinks(
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