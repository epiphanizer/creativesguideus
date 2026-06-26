import type { LinkHubContent, LinkHubLink } from "@/lib/admin/types";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, june30LaunchDateLabel } from "@/lib/launch-state";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

const defaultUpdatedAt = "";
const legacyLinkHubTitle = "Jump Through The Active Rooms";
const legacyLinkHubDescription = "A compact dispatch board for project worlds, direct studio routes, and the live surfaces orbiting Creatives Guide Us.";
const appreeshPreviewHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "appreesh-preview",
    inquiryType: "mailing-list",
    project: "Appreesh",
    surface: "product-app",
    sourceRoute: "/links",
    campaignWindow: albumLaunchCampaignWindow
  }
});

const defaultWallsDevineLink = {
  id: "walls-devine",
  eyebrow: "Collector experience",
  title: "Walls/Devine Volume 1",
  description: "Enter the listening room, release journals, collector path, and the live album world around Volume 1.",
  href: "/walls-devine",
  ctaLabel: "Enter Volume 1",
  isFeatured: true,
  isActive: true
} satisfies LinkHubLink;

const defaultWallsDevineMerchLink = {
  id: "walls-devine-merch-shop",
  eyebrow: "Merch shop",
  title: "Shop Volume 1 Merch",
  description: "Open the Fourthwall merch room for Volume 1 apparel, printed goods, and release-world objects.",
  href: wallsDevineMerchShopHref,
  ctaLabel: "Open merch shop",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const defaultBongTourLink = {
  id: "bong-tour",
  eyebrow: "Screenplay portal",
  title: "Bong Tour",
  description: `Preview the poster, logline, and launch lane now. The private treatment opens ${june30LaunchDateLabel}.`,
  href: "/bong-tour",
  ctaLabel: "Preview Bong Tour",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const defaultAppreeshPreviewLink = {
  id: "appreesh-preview",
  eyebrow: "Preview route",
  title: "Appreesh",
  description: `Queue the Appreesh preview lane inside CGU now. No external Appreesh handoff before ${june30LaunchDateLabel}.`,
  href: appreeshPreviewHref,
  ctaLabel: "Request Appreesh notice",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const defaultContactLink = {
  id: "contact",
  eyebrow: "Direct route",
  title: "Contact the Studio",
  description: "Start a build, book a room, or ask for the cleanest next move.",
  href: "/contact",
  ctaLabel: "Open contact",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const canonicalLinkOrder = [
  "walls-devine",
  "walls-devine-merch-shop",
  "bong-tour",
  "appreesh-preview",
  "contact"
] as const;

export const defaultLinkHubContent: LinkHubContent = {
  eyebrow: "Project routes",
  title: "Jump Through The Live And Staged Rooms",
  description: "A compact dispatch board for Volume 1 now, the July 11 openings next, and a direct studio route beneath them.",
  updatedAt: defaultUpdatedAt,
  links: [
    defaultWallsDevineLink,
    defaultWallsDevineMerchLink,
    defaultBongTourLink,
    defaultAppreeshPreviewLink,
    defaultContactLink
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

function orderCanonicalLinks(links: LinkHubLink[]) {
  return [...links].sort((left, right) => {
    const leftIndex = canonicalLinkOrder.indexOf(left.id as (typeof canonicalLinkOrder)[number]);
    const rightIndex = canonicalLinkOrder.indexOf(right.id as (typeof canonicalLinkOrder)[number]);
    const normalizedLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const normalizedRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

    return normalizedLeft - normalizedRight;
  });
}

function ensureRequiredLinks(links: LinkHubLink[]) {
  let nextLinks = [...links];

  const requiredLinks = [
    defaultWallsDevineLink,
    defaultWallsDevineMerchLink,
    defaultBongTourLink,
    defaultAppreeshPreviewLink,
    defaultContactLink
  ];

  requiredLinks.forEach((requiredLink) => {
    const existingIndex = nextLinks.findIndex(
      (link) => link.id === requiredLink.id || link.href.replace(/\/$/, "") === requiredLink.href.replace(/\/$/, "")
    );

    if (existingIndex >= 0) {
      nextLinks = nextLinks.map((link, index) => (index === existingIndex ? normalizeLinkHubLink(requiredLink, index) : link));
      return;
    }

    const insertionIndex = nextLinks.length;
    const normalizedLink = normalizeLinkHubLink(requiredLink, insertionIndex);
    nextLinks = [...nextLinks, normalizedLink];
  });

  return orderCanonicalLinks(nextLinks);
}

export function normalizeLinkHubContent(content?: Partial<LinkHubContent> | null): LinkHubContent {
  const links = ensureRequiredLinks(
    Array.isArray(content?.links) && content?.links.length ? content.links.map((link, index) => normalizeLinkHubLink(link, index)) : defaultLinkHubContent.links
  );

  return {
    eyebrow: typeof content?.eyebrow === "string" && content.eyebrow.trim() ? content.eyebrow.trim() : defaultLinkHubContent.eyebrow,
    title:
      typeof content?.title === "string" && content.title.trim() && content.title.trim() !== legacyLinkHubTitle
        ? content.title.trim()
        : defaultLinkHubContent.title,
    description:
      typeof content?.description === "string" && content.description.trim() && content.description.trim() !== legacyLinkHubDescription
        ? content.description.trim()
        : defaultLinkHubContent.description,
    updatedAt: typeof content?.updatedAt === "string" && content.updatedAt.trim() ? content.updatedAt.trim() : new Date().toISOString(),
    links
  } satisfies LinkHubContent;
}