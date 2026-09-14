"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

type WritingTabItem = {
  id: string;
  label: string;
  summary?: string;
  content: ReactNode;
};

type WritingTabsProps = {
  items: WritingTabItem[];
};

export function WritingTabs({ items }: WritingTabsProps) {
  const fallbackId = useId();
  const firstItem = items[0];
  const [activeId, setActiveId] = useState(firstItem?.id ?? "");

  useEffect(() => {
    if (items.length === 0) {
      setActiveId("");

      return;
    }

    if (!items.some((item) => item.id === activeId)) {
      setActiveId(items[0]?.id ?? "");
    }
  }, [items, activeId]);

  const tabIds = useMemo(
    () =>
      items.map((item) => ({
        tabId: `${item.id}-${fallbackId}-tab`,
        panelId: `${item.id}-${fallbackId}-panel`
      })),
    [items, fallbackId]
  );

  const getIdsForIndex = useCallback(
    (index: number) => tabIds[index] ?? { tabId: "", panelId: "" },
    [tabIds]
  );

  const findIndexById = useCallback(
    (id: string) => items.findIndex((item) => item.id === id),
    [items]
  );

  const focusTabAtIndex = useCallback(
    (index: number) => {
      const nextIndex = (index + items.length) % items.length;
      const item = items[nextIndex];
      if (!item) {
        return;
      }

      setActiveId(item.id);
      const { tabId } = getIdsForIndex(nextIndex);
      const tabElement = document.getElementById(tabId);
      tabElement?.focus();
    },
    [getIdsForIndex, items]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (items.length === 0) {
        return;
      }

      const candidateIndex = findIndexById(activeId);
      const currentIndex = candidateIndex >= 0 ? candidateIndex : 0;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusTabAtIndex(currentIndex + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusTabAtIndex(currentIndex - 1);
          break;
        case "Home":
          event.preventDefault();
          focusTabAtIndex(0);
          break;
        case "End":
          event.preventDefault();
          focusTabAtIndex(items.length - 1);
          break;
        default:
          break;
      }
    },
    [activeId, findIndexById, focusTabAtIndex, items]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="cg-writing-tabs">
      <div
        role="tablist"
        aria-label="Writing services"
        className="cg-writing-tabs__list"
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const { tabId, panelId } = getIdsForIndex(index);

          return (
            <button
              key={item.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              className="cg-writing-tabs__tab"
              data-state={isActive ? "active" : "inactive"}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(item.id)}
            >
              <span className="cg-writing-tabs__label">{item.label}</span>
              {item.summary ? <span className="cg-writing-tabs__summary">{item.summary}</span> : null}
            </button>
          );
        })}
      </div>

      {items.map((item, index) => {
        const isActive = item.id === activeId;
        const { panelId, tabId } = getIdsForIndex(index);

        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            className="cg-writing-tabs__panel"
            data-state={isActive ? "active" : "inactive"}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
