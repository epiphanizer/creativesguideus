type LaunchStatus = "live" | "preview";

type LaunchStage = {
  status: LaunchStatus;
  label: string;
  launchDate?: string;
};

export const albumLaunchCampaignWindow = "album-launch";
export const june30LaunchDateIso = "2026-06-30";
export const june30LaunchDateLabel = "June 30";

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
  }
} satisfies {
  wallsDevine: LaunchStage;
  bongTour: LaunchStage;
  appreesh: LaunchStage;
};

export const isBongTourPreview = cguLaunchState.bongTour.status === "preview";
export const isAppreeshPreview = cguLaunchState.appreesh.status === "preview";

export function isBeforeJune30LaunchCutoff(value = new Date()) {
  return value.getTime() < new Date(`${june30LaunchDateIso}T00:00:00.000Z`).getTime();
}