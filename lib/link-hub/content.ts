import type { LinkHubContent, LinkHubLink } from "@/lib/admin/types";
import { buildContactHref } from "@/lib/contact-intake-routing";
import { albumLaunchCampaignWindow, june30LaunchDateLabel } from "@/lib/launch-state";
import { wallsDevineMerchShopHref } from "@/lib/walls-devine/links";

const defaultUpdatedAt = "";
const legacyLinkHubTitle = "Active Releases & Studio Directory";
const legacyLinkHubDescription = "A direct directory of releases, screenplays, and studio contacts for Creatives Guide Us.";
const wallsDevineSignalListHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "walls-devine-mailing-list",
    inquiryType: "mailing-list",
    project: "Walls/Devine",
    surface: "campaign-world",
    sourceRoute: "/links",
    campaignWindow: albumLaunchCampaignWindow
  }
});

const defaultWallsDevineLink = {
  id: "walls-devine",
  eyebrow: "Debut Album",
  title: "Walls/Devine Volume 1",
  description: "Four songs tracked live in the studio. Raw electric guitars, fuzz bass, spoken Midwestern verse, and zero auto-tune. Loud enough to wake the landlord.",
  href: "/walls-devine",
  ctaLabel: "Enter Listening Room",
  isFeatured: true,
  isActive: true
} satisfies LinkHubLink;

const defaultWallsDevineSignalListLink = {
  id: "walls-devine-mailing-list",
  eyebrow: "Mailing List",
  title: "Studio Notices & Pressings",
  description: "Get notified when vinyl pressings drop or when the studio shares rare room audio and session notes. No spam, no marketing fluff, ever.",
  href: wallsDevineSignalListHref,
  ctaLabel: "Join the mailing list",
  isFeatured: true,
  isActive: true
} satisfies LinkHubLink;

const defaultWallsDevineMerchLink = {
  id: "walls-devine-merch-shop",
  eyebrow: "Merch Shop",
  title: "Shop Volume 1 Physical Goods",
  description: "Heavyweight hoodies, hand-pulled woodcut prints, and physical artifacts made to outlive your phone (and probably our studio van).",
  href: wallsDevineMerchShopHref,
  ctaLabel: "Shop the collection",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const defaultBongTourLink = {
  id: "bong-tour",
  eyebrow: "Feature Screenplay",
  title: "Bong Tour",
  description: "A comedy about hauling a fragile, six-foot hand-blown glass rig across Route 66 in July heat in a van with a broken radiator. Motels, road food, and original score cues.",
  href: "/bong-tour",
  ctaLabel: "Read screenplay & cues",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const defaultCacheLink = {
  id: "cache",
  eyebrow: "Adventure Series",
  title: "Cache",
  description: "An upcoming adventure series. Field expeditions, treasure hunting, and the pursuit of things left off the map. Coordinates and dispatch details to follow.",
  href: "/cache",
  ctaLabel: "Request dispatch",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const defaultContactLink = {
  id: "contact",
  eyebrow: "Direct Line",
  title: "Talk to the Studio",
  description: "Got a film to score, a record to track, or a weird print project in mind? We actually read and answer these ourselves with fresh coffee in hand.",
  href: "/contact",
  ctaLabel: "Say hello",
  isFeatured: false,
  isActive: true
} satisfies LinkHubLink;

const canonicalLinkOrder = [
  "walls-devine",
  "walls-devine-mailing-list",
  "walls-devine-merch-shop",
  "bong-tour",
  "cache",
  "contact"
] as const;

export const defaultLinkHubContent: LinkHubContent = {
  eyebrow: "Studio Directory",
  title: "Creatives Guide Us Directory",
  description: "Original records built on real guitars and SP-404 chops in Ableton, original feature screenplays, and physical editions edited painstakingly ourselves from our studio in Salt Lake City, operating globally. Click around, listen to some tunes, or drop us a line.",
  updatedAt: defaultUpdatedAt,
  links: [
    defaultWallsDevineLink,
    defaultWallsDevineSignalListLink,
    defaultWallsDevineMerchLink,
    defaultBongTourLink,
    defaultCacheLink,
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
    defaultWallsDevineSignalListLink,
    defaultWallsDevineMerchLink,
    defaultBongTourLink,
    defaultCacheLink,
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