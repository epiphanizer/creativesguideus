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
};

export function Card({
  title,
  eyebrow,
  description,
  href,
  tags,
  footer,
  className,
  children
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

  return (
    <Wrapper {...wrapperProps}>
      <div className="cg-card__content">
        {eyebrow ? <p className="cg-card__eyebrow">{eyebrow}</p> : null}
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
