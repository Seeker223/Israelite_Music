import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 mb-6 border-t border-slate-200 dark:border-slate-800 pt-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Israelite Music" className="w-9 h-9 rounded-lg" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Israelite Music
            </h3>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Sharing inspiring music, artists, and stories from the Israelite Music community.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200">Explore</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link className="text-slate-600 dark:text-slate-400 hover:text-brand-700" to="/">
              Home
            </Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-brand-700" to="/tracks">
              Tracks
            </Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-brand-700" to="/write">
              Upload
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200">Contact</h4>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            israelitemusic.com
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            baduntobi2020@gmail.com
          </p>
        </div>
      </div>
      <p className="mt-8 text-xs text-slate-500 dark:text-slate-500">
        © {new Date().getFullYear()} Israelite Music. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
