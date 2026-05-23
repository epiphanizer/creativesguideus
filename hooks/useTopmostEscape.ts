import { useEffect, useRef } from "react";

type EscapeHandler = {
  id: symbol;
};

const activeEscapeHandlers: EscapeHandler[] = [];

function removeEscapeHandler(id: symbol) {
  const nextIndex = activeEscapeHandlers.findIndex((handler) => handler.id === id);

  if (nextIndex >= 0) {
    activeEscapeHandlers.splice(nextIndex, 1);
  }
}

export function useTopmostEscape(isActive: boolean, onEscape: () => void) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!isActive || typeof window === "undefined") {
      return;
    }

    const id = Symbol("topmost-escape-handler");
    activeEscapeHandlers.push({ id });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      const activeHandler = activeEscapeHandlers[activeEscapeHandlers.length - 1];

      if (!activeHandler || activeHandler.id !== id) {
        return;
      }

      event.preventDefault();
      onEscapeRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      removeEscapeHandler(id);
    };
  }, [isActive]);
}