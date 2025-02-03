import React from 'react';
import classNames from 'classnames';

// Button variant configuration
const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  variant: {
    default: 'bg-brand text-text-primary hover:bg-brand-hover',
    secondary: 'bg-white text-text-inverted border border-border hover:bg-gray-100',
    outline: 'bg-transparent border border-brand text-brand hover:bg-brand hover:text-text-primary',
    ghost: 'hover:bg-surface hover:text-text-primary',
    link: 'underline-offset-4 hover:underline text-brand'
  },
  size: {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10'
  }
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'default', 
    size = 'default', 
    ...props 
  }, ref) => {
    const classes = classNames(
      buttonVariants.base,
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      className
    );

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;