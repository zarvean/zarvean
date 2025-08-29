import React from "react";

export const buttonVariants = {
  default: "btn btn-primary",
  destructive: "btn btn-danger", 
  outline: "btn btn-outline-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  link: "btn btn-link"
};

const buttonSizes = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg", 
  icon: "btn-icon"
};

const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  asChild = false, 
  children,
  style = {},
  ...props 
}, ref) => {
  const baseClass = buttonVariants[variant] || buttonVariants.default;
  const sizeClass = buttonSizes[size] || "";
  const classes = `${baseClass} ${sizeClass} ${className}`.trim();

  if (asChild) {
    return React.cloneElement(children, {
      className: `${children.props.className || ""} ${classes}`.trim(),
      style: { ...style, ...children.props.style },
      ref,
      ...props
    });
  }

  return (
    <button
      className={classes}
      ref={ref}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };

// Add custom styles for ghost and icon variants
const customStyles = `
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--color-black);
  padding: 0.5rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-ghost:hover {
  background-color: var(--color-muted-light);
  color: var(--color-primary);
  border: none;
}

.btn-ghost:focus {
  box-shadow: none;
  background-color: var(--color-muted-light);
  color: var(--color-primary);
}

.btn-icon {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-sm.btn-icon {
  width: 2rem;
  height: 2rem;
}

.btn-lg.btn-icon {
  width: 3rem;
  height: 3rem;
}

.btn-link {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.btn-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* Override Bootstrap button styles to match design system */
.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: white;
}

.btn-outline-primary {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-outline-primary:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.btn-secondary {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}