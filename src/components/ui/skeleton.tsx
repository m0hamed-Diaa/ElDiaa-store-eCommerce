import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted",
        "bg-[rgba(184,184,184,0.267)]",
        "dark:bg-[rgba(255,255,255,0.15)]",
        className)}
      {...props}
    />
  )
}

export { Skeleton }
