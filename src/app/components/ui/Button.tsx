import React from "react";
import Link from "next/link";
import classNames from "classnames";

// Button variant configuration
const buttonVariants = {
  base: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  variant: {
    default: "bg-brand text-text-primary hover:bg-brand-hover",
    secondary:
      "bg-white text-text-inverted border border-border hover:bg-gray-100",
    outline:
      "bg-transparent border border-brand text-brand hover:bg-brand hover:text-text-primary",
    ghost: "hover:bg-surface hover:text-text-primary",
    link: "underline-offset-4 hover:underline text-brand",
    nav: "no-underline text-text-primary",
  },
  size: {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  },
};

type ButtonBaseProps = {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  className?: string;
};

// Props that are specific to Next.js Link component
type LinkProps = ButtonBaseProps & {
  href: string;
  asLink: true;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;

// Props that are specific to button element
type ButtonProps = ButtonBaseProps & {
  asLink?: false;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

// Combined props type using discriminated union
type CombinedButtonProps = LinkProps | ButtonProps;

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  CombinedButtonProps
>(
  (
    {
      className,
      children,
      variant = "default",
      size = "default",
      asLink,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      buttonVariants.base,
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      className
    );

    if (asLink && "href" in props) {
      return (
        <Link
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as LinkProps)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as ButtonProps)}
      >
        {children}
      </button>
    );
  }
);

export default Button;
