import { useEffect } from "react";

let activeBodyScrollLocks = 0;
let initialBodyOverflow = "";

function acquireBodyScrollLock() {
  if (typeof document === "undefined") {
    return () => {};
  }

  const { body } = document;

  if (activeBodyScrollLocks === 0) {
    initialBodyOverflow = body.style.overflow;
    body.style.overflow = "hidden";
  }

  activeBodyScrollLocks += 1;

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    activeBodyScrollLocks = Math.max(0, activeBodyScrollLocks - 1);

    if (activeBodyScrollLocks === 0) {
      body.style.overflow = initialBodyOverflow;
      initialBodyOverflow = "";
    }
  };
}

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    return acquireBodyScrollLock();
  }, [isLocked]);
}