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
  icon?: ReactNode;
  iconLabel?: string;
  badge?: string;
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
  actions,
  icon,
  iconLabel,
  badge
}: SectionHeaderProps) {
  const Heading = headingLevel;
  const hasTopline = Boolean(eyebrow || icon || badge);
  const iconRole = iconLabel ? "img" : "presentation";
  const iconAria = iconLabel ? { "aria-label": iconLabel } : { "aria-hidden": true };

  return (
    <header className={cx("cg-section-header", `cg-section-header--${align}`, className)}>
      <div className="cg-section-header__content">
        {hasTopline ? (
          <p className="cg-section-header__eyebrow">
            {icon ? (
              <span className="cg-section-header__icon" role={iconRole} {...iconAria}>
                {icon}
              </span>
            ) : null}
            {eyebrow ? <span>{eyebrow}</span> : null}
            {badge ? <span className="cg-section-header__badge">{badge}</span> : null}
          </p>
        ) : null}
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
