import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const TrackListItem = ({ track }) => {
  return (
    <article className="group mb-8 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/75">
      {track.img && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800 md:aspect-[21/8] xl:aspect-auto xl:h-full xl:w-72 xl:float-left xl:mr-6">
          <Image
            src={track.img}
            alt={track.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            w="735"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 p-5 md:p-6">
        <Link
          to={`/${track.slug}`}
          className="text-2xl font-semibold leading-tight text-slate-950 transition hover:text-brand-700 dark:text-slate-100 md:text-3xl"
        >
          {track.title}
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span>Written by</span>
          <Link
            className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            to={`/tracks?author=${track.user.username}`}
          >
            {track.user.username}
          </Link>
          <span>on</span>
          <Link
            className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            to={`/tracks?cat=${track.category}`}
          >
            {track.category}
          </Link>
          <span>{format(track.createdAt)}</span>
        </div>
        {track.desc && (
          <p className="line-clamp-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            {track.desc}
          </p>
        )}
        <Link
          to={`/${track.slug}`}
          className="w-max text-sm font-semibold text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

export default TrackListItem;
