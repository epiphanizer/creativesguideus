import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  headingLevel?: HeadingLevel;
  id?: string;
  align?: "start" | "center";
  className?: string;
  actions?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  description,
  headingLevel = "h2",
  id,
  align = "start",
  className,
  actions
}: SectionHeaderProps) {
  const Heading = headingLevel;

  return (
    <header className={cx("cg-section-header", `cg-section-header--${align}`, className)}>
      <div className="cg-section-header__content">
        {eyebrow ? <p className="cg-section-header__eyebrow">{eyebrow}</p> : null}
        <Heading id={id} className="cg-section-header__title">
          {title}
        </Heading>
        {subtitle ? <p className="cg-section-header__subtitle">{subtitle}</p> : null}
        {description ? <p className="cg-section-header__description">{description}</p> : null}
      </div>
      {actions ? <div className="cg-section-header__actions">{actions}</div> : null}
    </header>
  );
}

export default SectionHeader;
