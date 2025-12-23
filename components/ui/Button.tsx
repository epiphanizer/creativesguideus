import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/cx";

type ButtonVariants = "primary" | "secondary" | "ghost";
type ButtonSizes = "md" | "sm";

type BaseButtonProps = {
  children: ReactNode;
  variant?: ButtonVariants;
  size?: ButtonSizes;
  className?: string;
};

type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    as?: "button";
    href?: never;
  };

type ButtonAsAnchor = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
    as: "a";
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  as = "button",
  ...rest
}: ButtonProps) {
  const classes = cx("cg-button", `cg-button--${variant}`, `cg-button--${size}`, className);

  if (as === "a") {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;
