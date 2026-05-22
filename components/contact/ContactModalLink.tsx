"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

type ContactModalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  buttonVariant?: "primary" | "secondary" | "ghost";
  buttonSize?: "md" | "sm";
};

export function ContactModalLink({ href, children, className, buttonVariant, buttonSize = "md" }: ContactModalLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cx(
        buttonVariant && "cg-button",
        buttonVariant && `cg-button--${buttonVariant}`,
        buttonVariant && `cg-button--${buttonSize}`,
        className
      )}
    >
      {children}
    </Link>
  );
}

export default ContactModalLink;