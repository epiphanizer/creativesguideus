type LaunchStatus = "live" | "preview";

type LaunchStage = {
  status: LaunchStatus;
  label: string;
  launchDate?: string;
};

export const albumLaunchCampaignWindow = "album-launch";
export const albumReleaseDateIso = "2026-07-21";
export const albumReleaseDateLabel = "July 21";
export const bongTourLaunchDateIso = "2026-07-11";
export const bongTourLaunchDateLabel = "July 11";

// Backward-compatible aliases retained while date references are migrated.
export const june30LaunchDateIso = bongTourLaunchDateIso;
export const june30LaunchDateLabel = bongTourLaunchDateLabel;

export const cguLaunchState = {
  wallsDevine: {
    status: "live",
    label: "Live now"
  },
  bongTour: {
    status: "preview",
    label: `Opening ${june30LaunchDateLabel}`,
    launchDate: june30LaunchDateLabel
  },
  appreesh: {
    status: "preview",
    label: `Opening ${june30LaunchDateLabel}`,
    launchDate: june30LaunchDateLabel
  },
  cache: {
    status: "preview",
    label: "Coming soon"
  }
} satisfies {
  wallsDevine: LaunchStage;
  bongTour: LaunchStage;
  appreesh: LaunchStage;
  cache: LaunchStage;
};

export const isBongTourPreview = cguLaunchState.bongTour.status === "preview";
export const isAppreeshPreview = cguLaunchState.appreesh.status === "preview";
export const isCachePreview = cguLaunchState.cache.status === "preview";

export function isBeforeJune30LaunchCutoff(value = new Date()) {
  return value.getTime() < new Date(`${june30LaunchDateIso}T00:00:00.000Z`).getTime();
}