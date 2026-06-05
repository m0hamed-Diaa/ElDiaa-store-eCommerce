import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "gap-2 whitespace-nowrap",
    "font-medium",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
    "cursor-pointer"
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-sm shadow-[var(--shadow-sm)]",

        destructive:
          "bg-[var(--destructive)] text-white hover:bg-[var(--destructive-hover)] hover:opacity-90 shadow-sm shadow-[var(--shadow-sm)]",

        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] shadow-[var(--shadow-sm)]",

        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-80 shadow-[var(--shadow-sm)]",

        ghost:
          "text-[var(--foreground)] hover:bg-[var(--accent)] shadow-[var(--shadow-sm)]",

        link:
          "text-[var(--primary)] relative after:absolute after:left-0 after:bottom-1 after:h-0.5 after:w-0 after:bg-[var(--primary-hover)] after:transition-all hover:after:w-full",
      },

      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",

        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },

      borderRadius: {
        default: "rounded-[var(--radius)]",
        circle: "rounded-full",
      },

      fullWidth: {
        true: "w-full",
      },

      loading: {
        true: "opacity-70 cursor-not-allowed",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      borderRadius: "default",
    },
  }
);