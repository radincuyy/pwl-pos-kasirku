import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  ThemeProviderContext,
  type Theme,
  type ThemeProviderState,
} from "@/components/providers/theme-context"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme: Theme
  storageKey: string
}

function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  const storedTheme = localStorage.getItem(storageKey)

  if (
    storedTheme === "dark" ||
    storedTheme === "light" ||
    storedTheme === "system"
  ) {
    return storedTheme
  }

  return defaultTheme
}

function resolveTheme(theme: Theme): Exclude<Theme, "system"> {
  if (theme !== "system") {
    return theme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  )

  useEffect(() => {
    const root = window.document.documentElement
    const applyTheme = (): void => {
      root.classList.remove("light", "dark")
      root.classList.add(resolveTheme(theme))
    }

    applyTheme()

    if (theme !== "system") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", applyTheme)

    return () => {
      mediaQuery.removeEventListener("change", applyTheme)
    }
  }, [theme])

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      setTheme: (nextTheme: Theme): void => {
        localStorage.setItem(storageKey, nextTheme)
        setThemeState(nextTheme)
      },
    }),
    [storageKey, theme]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
