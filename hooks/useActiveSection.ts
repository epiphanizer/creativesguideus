import { useEffect, useMemo, useRef, useState } from "react";

const TOP_SCROLL_BUFFER = 80;
const BOTTOM_EPSILON = 2;

export function useActiveSection(sectionIds: string[]) {
  const stableIds = useMemo(() => Array.from(new Set(sectionIds)), [sectionIds]);
  const [activeId, setActiveId] = useState<string | null>(stableIds[0] ?? null);
  const visibilityMapRef = useRef(new Map<string, number>());

  useEffect(() => {
    visibilityMapRef.current = new Map(stableIds.map((id) => [id, 0]));
    setActiveId(stableIds[0] ?? null);

    if (stableIds.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!visibilityMapRef.current.has(entry.target.id)) {
            return;
          }

          const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
          visibilityMapRef.current.set(entry.target.id, ratio);
        });

        const visibleSections = Array.from(visibilityMapRef.current.entries())
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1]);

        if (visibleSections.length > 0) {
          setActiveId((current) => {
            const nextId = visibleSections[0][0];
            return current === nextId ? current : nextId;
          });
          return;
        }

        const scrollY = window.scrollY || window.pageYOffset;
        if (scrollY < TOP_SCROLL_BUFFER) {
          const firstId = stableIds[0] ?? null;
          setActiveId((current) => (current === firstId ? current : firstId));
          return;
        }

        const viewportBottom = scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (viewportBottom >= docHeight - BOTTOM_EPSILON) {
          const lastId = stableIds[stableIds.length - 1] ?? null;
          setActiveId((current) => (current === lastId ? current : lastId));
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "-40% 0px -40% 0px"
      }
    );

    const targets = stableIds
      .map((id) => document.getElementById(id))
      .filter((el): el is Element => Boolean(el));

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, [stableIds]);

  return {
    activeId,
    manuallySetActiveId: setActiveId
  } as const;
}
