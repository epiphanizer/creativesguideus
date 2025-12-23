import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

type TagProps = {
  children: ReactNode;
  variant?: "outline" | "solid";
  className?: string;
};

export function Tag({ children, variant = "outline", className }: TagProps) {
  return <span className={cx("cg-tag", `cg-tag--${variant}`, className)}>{children}</span>;
}

export default Tag;
