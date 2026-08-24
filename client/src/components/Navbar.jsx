import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const mobileMenu = (
    <div
      className={`md:hidden fixed inset-0 z-[9999] h-[100dvh] w-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-all duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_45%)]" />
      <div className="relative min-h-[100dvh] w-full p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            <img
              src="/logo.png"
              alt="Israelite Music Logo"
              className="w-8 h-8 rounded-lg"
            />
            <span>Israelite Music</span>
          </div>
          <button
            className="h-10 w-10 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-100 flex items-center justify-center bg-white/80 dark:bg-slate-900/70"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-3 text-lg font-medium text-slate-900 dark:text-slate-100">
          <Link
            to="/"
            className="rounded-2xl px-4 py-3 bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            Home
          </Link>
          <Link
            to="/tracks?sort=trending"
            className="rounded-2xl px-4 py-3 bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            Trending Music
          </Link>
          <Link
            to="/tracks?sort=popular"
            className="rounded-2xl px-4 py-3 bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            Most Played
          </Link>
          <SignedIn>
            {isAdmin && (
              <>
                <Link
                  to="/cpanel"
                  className="rounded-2xl px-4 py-3 bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  Music Studio
                </Link>
                <Link
                  to="/write"
                  className="rounded-2xl px-4 py-3 bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  Upload Music
                </Link>
              </>
            )}
          </SignedIn>
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
          <SignedIn>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user?.username || user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <UserButton />
            </div>
            <SignOutButton>
              <button
                className="w-full rounded-2xl px-4 py-3 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm bg-white/95 dark:bg-slate-900/85"
                type="button"
              >
                Sign out
              </button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link
              to="/login"
              className="block text-center rounded-2xl px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium"
            >
              Login
            </Link>
          </SignedOut>
          <div className="flex justify-end text-slate-800 dark:text-white">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="w-full h-16 md:h-20 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/75 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-3 text-lg md:text-xl font-bold tracking-tight">
          <img src="/logo.png" alt="Israelite Music Logo" className="w-8 h-8 rounded-lg" />
          <span className="text-slate-900 dark:text-slate-100">Israelite Music</span>
        </Link>

      <div className="hidden md:flex items-center gap-5 xl:gap-7 text-sm font-medium text-slate-700 dark:text-slate-200">
        <Link to="/" className="hover:text-brand-700 transition">
          Home
        </Link>
        <Link to="/tracks?sort=trending" className="hover:text-brand-700 transition">
          Trending Music
        </Link>
        <Link to="/tracks?sort=popular" className="hover:text-brand-700 transition">
          Most Played
        </Link>
        <SignedIn>
          {isAdmin && (
            <>
              <Link to="/cpanel" className="hover:text-brand-700 transition">
                Music Studio
              </Link>
              <Link
                to="/write"
                className="px-4 py-2 rounded-full bg-brand-700 text-white shadow-soft hover:bg-brand-800 transition"
              >
                Upload Music
              </Link>
            </>
          )}
        </SignedIn>
        <ThemeToggle />
        <SignedOut>
          <Link
            to="/login"
            className="py-2 px-4 rounded-full border border-brand-200 dark:border-slate-700 text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
          >
            Login
          </Link>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 max-w-28 truncate">
              {user?.username || user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
            <SignOutButton>
              <button className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                Sign out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>
      </div>

      <button
        className="md:hidden h-10 w-10 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        type="button"
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={`h-0.5 w-5 bg-slate-900 dark:bg-slate-100 transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-slate-900 dark:bg-slate-100 transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-slate-900 dark:bg-slate-100 transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      </header>
      {typeof document !== "undefined" && createPortal(mobileMenu, document.body)}
    </>
  );
};

export default Navbar;
