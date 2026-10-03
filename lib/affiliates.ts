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
};

export const MELODYNE_AFFILIATE: AffiliateProduct = {
  id: "celemony-melodyne-5",
  name: "Celemony Melodyne 5 Studio",
  category: "Vocal Pitch & Formant Editing",
  vendor: "Plugin Boutique / Celemony",
  headline: "Official Studio Profit Center // Avid Melodyne Fans",
  tagline: "Unapologetic, obsessive vocal pitch sculptors since 2009.",
  description:
    "We don't use robotic drone presets—we are diehard, avid Celemony Melodyne power users. Every vocal take, formant drift, and vibrato curve is lovingly nudged by hand. If you buy Melodyne through our affiliate link, we earn a modest commission that directly subsidizes our vintage 12AX7 tube amp habit.",
  affiliateUrl:
    "https://www.pluginboutique.com/product/2-Effects/54-Vocal/7086-Melodyne-5-Studio?a_aid=cgu_studio&a_bid=melodyne_profit_center",
  secondaryUrl:
    "https://www.sweetwater.com/store/detail/Melodyne5Stu--celemony-melodyne-5-studio?utm_source=creativesguideus&utm_medium=affiliate",
  discountNote: "Supports independent studio recording · 100% human-tuned",
  commissionDisclosure:
    "Affiliate Disclosure: Creatives Guide Us earns an affiliate commission on qualifying software purchases. It keeps our patch bay soldered and the tube amps glowing."
};
