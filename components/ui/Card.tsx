"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { cx } from "@/lib/cx";
import { Tag } from "./Tag";

type CardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  tags?: string[];
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
};

export function Card({
  title,
  eyebrow,
  description,
  tags,
  footer,
  className,
  children,
  icon,
  onClick,
  ariaLabel
}: CardProps) {
  const showTopline = Boolean(icon || eyebrow);
  const isInteractive = typeof onClick === "function";
  const cardClassName = cx("cg-card", isInteractive && "cg-card--link", className);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      className={cardClassName}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? ariaLabel ?? `Open ${title}` : undefined}
    >
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
    </article>
  );
}

export default Card;
