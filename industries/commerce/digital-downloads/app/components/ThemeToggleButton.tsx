import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function setDocumentTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  try {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {
    // ignore
  }

  return "light";
}

interface ThemeToggleButtonProps {
  className?: string;
}

export function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    setDocumentTheme(initial);
  }, []);

  const handleToggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";

      if (typeof window !== "undefined") {
        window.localStorage.setItem("theme", next);
      }
      setDocumentTheme(next);

      return next;
    });
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        "inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs transition " +
        "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 " +
        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 " +
        (className ? ` ${className}` : "")
      }
    >
      {isDark ? (
        // Sun icon
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 3v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 18.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4.22 4.22L5.9 5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18.1 18.1l1.68 1.68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 12h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18.5 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4.22 19.78L5.9 18.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18.1 5.9l1.68-1.68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        // Moon icon
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 14.5A7.5 7.5 0 0 1 10.5 5 6 6 0 1 0 20 14.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
