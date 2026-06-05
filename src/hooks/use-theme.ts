import { ThemeProviderContext } from "@/lib/theme-context"
import { useContext } from "react"

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context;
}