export type PlayerDockPosition = {
  x: number;
  y: number;
};

export type PersistedWallsDevinePlayerState = {
  activeIndex?: number;
  isOpen?: boolean;
  isCollapsed?: boolean;
  isDismissed?: boolean;
  dockPosition?: PlayerDockPosition | null;
};

export const wallsDevinePlayerStorageKey = "walls-devine-player-state-v1";
export const wallsDevinePlayerDismissedChangeEventName = "wd-player-dismissed-change";
export const wallsDevinePlayerRestoreRequestEventName = "wd-player-restore-request";
export const wallsDevinePlayerOpenRequestEventName = "wd-player-open-request";

export function readWallsDevinePlayerDismissed() {
  return false;
}

export function dispatchWallsDevinePlayerDismissedChange(isDismissed: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<{ isDismissed: boolean }>(wallsDevinePlayerDismissedChangeEventName, {
      detail: { isDismissed }
    })
  );
}

export function requestWallsDevinePlayerRestore() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(wallsDevinePlayerRestoreRequestEventName));
}

export function requestWallsDevinePlayerOpen() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(wallsDevinePlayerOpenRequestEventName));
}