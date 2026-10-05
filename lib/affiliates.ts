/**
 * Studio Profit Centers & Affiliate Partnerships
 *
 * Creatives Guide Us: Unapologetic, avid Celemony Melodyne power users.
 * We hand-sculpt vocal pitch, vibrato curves, and formants note-by-note.
 */

export type AffiliateProduct = {
  id: string;
  name: string;
  category: string;
  vendor: string;
  headline: string;
  tagline: string;
  description: string;
  affiliateUrl: string;
  secondaryUrl?: string;
  discountNote?: string;
  commissionDisclosure: string;
  isActive: boolean;
};

export const MELODYNE_AFFILIATE: AffiliateProduct = {
  id: "celemony-melodyne-5",
  name: "Celemony Melodyne 5 Studio",
  category: "Vocal Pitch & Formant Editing",
  vendor: "Plugin Boutique / Celemony",
  headline: "Studio Tool // Vocal Pitch Sculpting [DEACTIVATED]",
  tagline: "Vocal pitch and formant editing software.",
  description:
    "Celemony Melodyne studio vocal pitch and formant editing software. Affiliate and profit-center integration is permanently deactivated.",
  affiliateUrl:
    "https://www.pluginboutique.com/product/2-Effects/54-Vocal/7086-Melodyne-5-Studio",
  secondaryUrl:
    "https://www.sweetwater.com/store/detail/Melodyne5Stu--celemony-melodyne-5-studio",
  discountNote: "Studio reference only",
  commissionDisclosure:
    "Notice: Creatives Guide Us does not operate an active affiliate profit center or commercial kickback program.",
  isActive: false
};
