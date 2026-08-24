import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nfs_theme");
    const preferredDark =
      saved === "dark" ||
      (!saved &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(preferredDark);
    document.documentElement.classList.toggle("dark", preferredDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("nfs_theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      aria-label="Toggle dark mode"
      type="button"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;
