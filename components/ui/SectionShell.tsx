import type { JSX as ReactJSX, ReactNode } from "react";

import { cx } from "@/lib/cx";

type SectionShellProps = {
  id: string;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  variant?: "default" | "hero" | "compact";
  as?: keyof ReactJSX.IntrinsicElements;
  children: ReactNode;
};

export function SectionShell({
  id,
  className,
  innerClassName,
  labelledBy,
  variant = "default",
  as: Wrapper = "section",
  children
}: SectionShellProps) {
  return (
    <Wrapper
      id={id}
      aria-labelledby={labelledBy}
      className={cx("cg-section", variant !== "default" && `cg-section--${variant}`, className)}
    >
      <div className={cx("cg-section__inner", innerClassName)}>{children}</div>
    </Wrapper>
  );
}

export default SectionShell;
