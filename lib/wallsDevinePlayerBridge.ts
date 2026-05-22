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
export const wallsDevineListeningRoomAnchorId = "walls-devine-listening-room";

type OpenWallsDevineListeningRoomOptions = {
  isPlayerDismissed: boolean;
  prefersReducedMotion: boolean;
  onMissingTarget?: () => void;
};

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

export function openWallsDevineListeningRoomShortcut({
  isPlayerDismissed,
  prefersReducedMotion,
  onMissingTarget
}: OpenWallsDevineListeningRoomOptions) {
  if (typeof window === "undefined") {
    return false;
  }

  if (isPlayerDismissed) {
    requestWallsDevinePlayerRestore();
  }

  requestWallsDevinePlayerOpen();

  const target = document.getElementById(wallsDevineListeningRoomAnchorId);

  if (target) {
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
    return true;
  }

  onMissingTarget?.();
  return false;
}