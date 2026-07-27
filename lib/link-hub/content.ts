import type { LinkHubContent, LinkHubLink } from "@/lib/admin/types";

const defaultUpdatedAt = "2026-05-17T00:00:00.000Z";

export const defaultLinkHubContent: LinkHubContent = {
  eyebrow: "Signal routes",
  title: "Enter The Active Rooms",
  description: "A concise guide to the current projects, the studio contact line, and the clearest ways into CGU.",
  updatedAt: defaultUpdatedAt,
  links: [
    {
      id: "walls-devine",
      eyebrow: "Collector experience",
      title: "Walls/Devine Volume 1",
      description: "Step into Volume 1 through the listening room, journals, merch, and collector pieces.",
      href: "/walls-devine",
      ctaLabel: "Enter Volume 1",
      isFeatured: true,
      isActive: true
    },
    {
      id: "bong-tour",
      eyebrow: "Screenplay portal",
      title: "Bong Tour",
      description: "Explore the poster, premise, and soundtrack world behind Bong Tour.",
      href: "/bong-tour",
      ctaLabel: "Enter Bong Tour",
      isFeatured: true,
      isActive: true
    },
    {
      id: "contact",
      eyebrow: "Direct route",
      title: "Contact The Studio",
      description: "Reach the studio for builds, bookings, collaborations, or the next right move.",
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

export function normalizeLinkHubContent(content?: Partial<LinkHubContent> | null): LinkHubContent {
  const links = Array.isArray(content?.links) && content?.links.length ? content.links.map((link, index) => normalizeLinkHubLink(link, index)) : defaultLinkHubContent.links;

  return {
    eyebrow: typeof content?.eyebrow === "string" && content.eyebrow.trim() ? content.eyebrow.trim() : defaultLinkHubContent.eyebrow,
    title: typeof content?.title === "string" && content.title.trim() ? content.title.trim() : defaultLinkHubContent.title,
    description: typeof content?.description === "string" && content.description.trim() ? content.description.trim() : defaultLinkHubContent.description,
    updatedAt: typeof content?.updatedAt === "string" && content.updatedAt.trim() ? content.updatedAt.trim() : new Date().toISOString(),
    links
  } satisfies LinkHubContent;
}