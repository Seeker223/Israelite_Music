import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import MainGenres from "../components/MainGenres";
import FeaturedTracks from "../components/FeaturedTracks";
import TrackList from "../components/TrackList";
import HeroCarousel from "../components/HeroCarousel";

const Homepage = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* BREADCRUMB */}
      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-700 transition">Home</Link>
        <span>-</span>
        <span className="text-brand-700 font-medium">Music & Releases</span>
      </div>
      {/* INTRODUCTION */}
      <div className="flex items-center justify-between gap-8">
        {/* titles */}
        <div className="max-w-2xl">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
         {/* Welcome To Israelite Music */}
         Israelite Music
          </h1>
          <p className="mt-6 text-md md:text-xl text-slate-600 dark:text-slate-300">
            Discover inspiring music, artists, albums, and songs from the Israelite Music community. <br/><br/>Music | Artists | Albums | Songs | Lyrics | New Releases
            {/* Music connects people and stories across generations. */}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/tracks"
              className="px-5 py-3 rounded-full bg-brand-700 text-white shadow-soft hover:bg-brand-800 transition"
            >
              Explore Music
            </Link>
            {isAdmin && (
              <Link
                to="/write"
                className="px-5 py-3 rounded-full border border-brand-200 dark:border-slate-700 text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
              >
                Upload Music
              </Link>
            )}
          </div>
        </div>
        {/* animated button */}
        {isAdmin ? (
          <Link to="/write" className="hidden md:block relative">
            <svg
              viewBox="0 0 200 200"
              width="200"
              height="200"
              className="text-lg tracking-widest"
            >
              <path
                id="circlePath"
                fill="none"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
              <text>
                <textPath href="#circlePath" startOffset="0%">
                  Israelite Music -
                </textPath>
                <textPath href="#circlePath" startOffset="50%">
                  Israelite Music -
                </textPath>
              </text>
            </svg>
            <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-brand-700 rounded-full flex items-center justify-center shadow-soft">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50"
                height="50"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <line x1="6" y1="18" x2="18" y2="6" />
                <polyline points="9 6 18 6 18 15" />
              </svg>
            </button>
          </Link>
        ) : (
          <div className="hidden md:block relative opacity-60 cursor-not-allowed">
            <svg
              viewBox="0 0 200 200"
              width="200"
              height="200"
              className="text-lg tracking-widest"
            >
              <path
                id="circlePath"
                fill="none"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
              <text>
                <textPath href="#circlePath" startOffset="0%">
                  Israelite Music -
                </textPath>
                <textPath href="#circlePath" startOffset="50%">
                  Israelite Music -
                </textPath>
              </text>
            </svg>
            <button
              type="button"
              disabled
              className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-slate-400 rounded-full flex items-center justify-center shadow-soft cursor-not-allowed"
              aria-label="Only admins can write tracks"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50"
                height="50"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <line x1="6" y1="18" x2="18" y2="6" />
                <polyline points="9 6 18 6 18 15" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <HeroCarousel />
      {/* CATEGORIES */}
      <MainGenres />
      {/* FEATURED POSTS */}
      <FeaturedTracks />
      {/* POST LIST */}
      <div className="">
        <h1 className="my-8 text-2xl text-slate-700 dark:text-slate-200 font-semibold">Latest Music</h1>
        <TrackList/>
      </div>
    </div>
  );
};

export default Homepage;

