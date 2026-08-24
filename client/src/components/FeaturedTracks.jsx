import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import TextSkeleton from "./TextSkeleton";

const fetchTrack = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
  );
  return res.data;
};

const FeaturedTracks = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredTracks"],
    queryFn: () => fetchTrack(),
  });

  if (isPending) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-200/70 dark:border-slate-800 p-5">
        <TextSkeleton lines={5} />
      </div>
    );
  }
  if (error) return "Something went wrong!" + error.message;

  const tracks = data.posts;
  if (!tracks || tracks.length === 0) {
    return;
  }

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* First */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-5 shadow-card">
        {/* image */}
        {tracks[0].img && <Image
          src={tracks[0].img}
          className="rounded-3xl object-cover"
          w="895"
        />}
        {/* details */}
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
          <h1 className="font-semibold lg:text-lg text-brand-700">01.</h1>
          <Link
            className="text-brand-700 lg:text-lg"
            to={`/tracks?cat=${tracks[0].category}`}
          >
            {tracks[0].category}
          </Link>
          <span className="text-slate-500">{format(tracks[0].createdAt)}</span>
        </div>
        {/* title */}
        <Link
          to={tracks[0].slug}
            className="text-xl lg:text-3xl font-semibold lg:font-bold text-slate-900 dark:text-slate-100 hover:text-brand-700 transition"
        >
          {tracks[0].title}
        </Link>
      </div>
      {/* Others */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* second */}
        {tracks[1] && <div className="lg:h-1/3 flex justify-between gap-4 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-4 shadow-card">
          {tracks[1].img && <div className="w-1/3 aspect-video">
            <Image
              src={tracks[1].img}
              className="rounded-3xl object-cover w-full h-full"
              w="298"
            />
          </div>}
          {/* details and title */}
          <div className="w-2/3">
            {/* details */}
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4 text-slate-600 dark:text-slate-300">
              <h1 className="font-semibold text-brand-700">02.</h1>
              <Link
                className="text-brand-700"
                to={`/tracks?cat=${tracks[1].category}`}
              >
                {tracks[1].category}
              </Link>
              <span className="text-slate-500 text-sm">{format(tracks[1].createdAt)}</span>
            </div>
            {/* title */}
            <Link
              to={tracks[1].slug}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium text-slate-900 dark:text-slate-100 hover:text-brand-700 transition"
            >
              {tracks[1].title}
            </Link>
          </div>
        </div>}
        {/* third */}
        {tracks[2] && <div className="lg:h-1/3 flex justify-between gap-4 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-4 shadow-card">
          {tracks[2].img && <div className="w-1/3 aspect-video">
            <Image
              src={tracks[2].img}
              className="rounded-3xl object-cover w-full h-full"
              w="298"
            />
          </div>}
          {/* details and title */}
          <div className="w-2/3">
            {/* details */}
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4 text-slate-600 dark:text-slate-300">
              <h1 className="font-semibold text-brand-700">03.</h1>
              <Link
                className="text-brand-700"
                to={`/tracks?cat=${tracks[2].category}`}
              >
                {tracks[2].category}
              </Link>
              <span className="text-slate-500 text-sm">{format(tracks[2].createdAt)}</span>
            </div>
            {/* title */}
            <Link
              to={tracks[2].slug}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium text-slate-900 dark:text-slate-100 hover:text-brand-700 transition"
            >
              {tracks[2].title}
            </Link>
          </div>
        </div>}
        {/* fourth */}
        {tracks[3] && <div className="lg:h-1/3 flex justify-between gap-4 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-4 shadow-card">
          {tracks[3].img && <div className="w-1/3 aspect-video">
            <Image
              src={tracks[3].img}
              className="rounded-3xl object-cover w-full h-full"
              w="298"
            />
          </div>}
          {/* details and title */}
          <div className="w-2/3">
            {/* details */}
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4 text-slate-600 dark:text-slate-300">
              <h1 className="font-semibold text-brand-700">04.</h1>
              <Link
                className="text-brand-700"
                to={`/tracks?cat=${tracks[3].category}`}
              >
                {tracks[3].category}
              </Link>
              <span className="text-slate-500 text-sm">{format(tracks[3].createdAt)}</span>
            </div>
            {/* title */}
            <Link
              to={tracks[3].slug}
              className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium text-slate-900 dark:text-slate-100 hover:text-brand-700 transition"
            >
              {tracks[3].title}
            </Link>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default FeaturedTracks;
