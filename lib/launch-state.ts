type LaunchStatus = "live" | "preview";

type LaunchStage = {
  status: LaunchStatus;
  label: string;
  launchDate?: string;
};

export const albumLaunchCampaignWindow = "album-launch";
export const wallsDevineLaunchDateIso = "2026-09-01";
export const wallsDevineLaunchDateLabel = "September 1";
export const appreeshLaunchDateIso = "2026-09-11";
export const appreeshLaunchDateLabel = "September 11";
export const bongTourLaunchDateIso = "2026-11-04";
export const bongTourLaunchDateLabel = "November 4";
export const cacheLaunchYearLabel = "2027";
export const launchSequenceSeasonLabel = "Fall 2026";
export const launchSequenceDateRangeLabel = `${wallsDevineLaunchDateLabel} to ${bongTourLaunchDateLabel}`;

export const albumReleaseDateIso = wallsDevineLaunchDateIso;
export const albumReleaseDateLabel = wallsDevineLaunchDateLabel;

// Backward-compatible aliases retained while date references are migrated.
export const june30LaunchDateIso = wallsDevineLaunchDateIso;
export const june30LaunchDateLabel = launchSequenceSeasonLabel;

export const cguLaunchState = {
  wallsDevine: {
    status: "preview",
    label: `Opening ${wallsDevineLaunchDateLabel}`,
    launchDate: wallsDevineLaunchDateLabel
  },
  bongTour: {
    status: "preview",
    label: `Opening ${bongTourLaunchDateLabel}`,
    launchDate: bongTourLaunchDateLabel
  },
  appreesh: {
    status: "preview",
    label: `Opening ${appreeshLaunchDateLabel}`,
    launchDate: appreeshLaunchDateLabel
  },
  cache: {
    status: "preview",
    label: `Opening ${cacheLaunchYearLabel}`,
    launchDate: cacheLaunchYearLabel
  }
} satisfies {
  wallsDevine: LaunchStage;
  bongTour: LaunchStage;
  appreesh: LaunchStage;
  cache: LaunchStage;
};

export const isWallsDevinePreview = cguLaunchState.wallsDevine.status === "preview";
export const isBongTourPreview = cguLaunchState.bongTour.status === "preview";
export const isAppreeshPreview = cguLaunchState.appreesh.status === "preview";
export const isCachePreview = cguLaunchState.cache.status === "preview";

export function isBeforeWallsDevineLaunchCutoff(value = new Date()) {
  return value.getTime() < new Date(`${wallsDevineLaunchDateIso}T00:00:00.000Z`).getTime();
}

export function isBeforeAppreeshLaunchCutoff(value = new Date()) {
  return value.getTime() < new Date(`${appreeshLaunchDateIso}T00:00:00.000Z`).getTime();
}

export function isBeforeBongTourLaunchCutoff(value = new Date()) {
  return value.getTime() < new Date(`${bongTourLaunchDateIso}T00:00:00.000Z`).getTime();
}

export function isBeforeJune30LaunchCutoff(value = new Date()) {
  return isBeforeWallsDevineLaunchCutoff(value);
}