import type { ReactNode } from "react";

import { cx } from "@/lib/cx";
import { Tag } from "./Tag";

type CardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
  tags?: string[];
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
};

export function Card({
  title,
  eyebrow,
  description,
  href,
  tags,
  footer,
  className,
  children,
  icon
}: CardProps) {
  const Wrapper = href ? "a" : "article";
  const wrapperProps = href
    ? {
        href,
        className: cx("cg-card", href && "cg-card--link", className)
      }
    : {
        className: cx("cg-card", className)
      };

  const showTopline = Boolean(icon || eyebrow);

  return (
    <Wrapper {...wrapperProps}>
      <div className="cg-card__content">
        {showTopline ? (
          <div className="cg-card__topline">
            {icon ? (
              <span className="cg-card__icon" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            {eyebrow ? <span className="cg-card__eyebrow">{eyebrow}</span> : null}
          </div>
        ) : null}
        <h3 className="cg-card__title">{title}</h3>
        {description ? <p className="cg-card__description">{description}</p> : null}
        {children}
      </div>
      {tags && tags.length > 0 ? (
        <div className="cg-card__tags" aria-label="Tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      ) : null}
      {footer ? <div className="cg-card__footer">{footer}</div> : null}
    </Wrapper>
  );
}

export default Card;
