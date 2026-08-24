import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import TrackMenuActions from "../components/TrackMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { format } from "timeago.js";

const fetchTrack = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const fetchGenres = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
  return res.data;
};

const SingleTrackPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["track", slug],
    queryFn: () => fetchTrack(slug),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchGenres,
  });

  const pageTitle = data ? `${data.title} | Israelite Music` : "Israelite Music";
  const pageDescription = data?.desc
    ? data.desc
    : "Israelite Music track and release from the community.";
  const pageUrl = data
    ? `https://www.israelitemusic.com/${data.slug}`
    : "https://www.israelitemusic.com";
  const pageImage = data?.img
    ? `https://ik.imagekit.io/cu7rwsp4u/${data.img.replace(/^\/+/, "")}`
    : "https://www.israelitemusic.com/logo.png";

  useEffect(() => {
    if (!data) return;

    document.title = pageTitle;

    const setMetaByName = (name, content) => {
      let tag = document.head.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setMetaByProperty = (property, content) => {
      let tag = document.head.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    setMetaByName("description", pageDescription);
    setMetaByProperty("og:type", "article");
    setMetaByProperty("og:title", pageTitle);
    setMetaByProperty("og:description", pageDescription);
    setMetaByProperty("og:url", pageUrl);
    setMetaByProperty("og:image", pageImage);
    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", pageTitle);
    setMetaByName("twitter:description", pageDescription);
    setMetaByName("twitter:image", pageImage);
  }, [data, pageDescription, pageImage, pageTitle, pageUrl]);

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Track not found!";

  return (
    <article className="overflow-hidden py-6 md:py-8">
      <header className="mb-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-5">
          <Link
            to="/tracks"
            className="w-max text-sm font-medium text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
          >
            Back to music
          </Link>
          <h1 className="overflow-wrap-anywhere text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-100 md:text-5xl">
            {data.title}
          </h1>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
            <span>Written by</span>
            <Link
              className="max-w-full truncate font-medium text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200 sm:max-w-xs"
              to={`/tracks?author=${data.user.username}`}
            >
              {data.user.username}
            </Link>
            <span>on</span>
            <Link
              className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
              to={`/tracks?cat=${data.category}`}
            >
              {data.category}
            </Link>
            <span>{format(data.createdAt)}</span>
          </div>
          {data.desc && (
            <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {data.desc}
            </p>
          )}
        </div>
        {data.img && (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-card dark:border-slate-800 dark:bg-slate-800">
            <Image
              src={data.img}
              alt={data.title}
              w="840"
              className="aspect-[16/10] h-full w-full object-cover"
            />
          </div>
        )}
      </header>

      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,calc(100%-340px))_300px] xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 overflow-hidden">
          <div
            className="track-content prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-950 prose-a:text-brand-700 prose-img:rounded-2xl dark:prose-invert dark:text-slate-300 dark:prose-a:text-brand-300"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
          <Comments trackId={data._id}/>
        </div>

        <aside className="min-w-0 h-max rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/75 lg:sticky lg:top-24">
          <h1 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {data.user.img && (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100"
                  w="48"
                  h="48"
                />
              )}
              <Link
                className="min-w-0 truncate font-medium text-brand-700"
                to={`/tracks?author=${data.user.username}`}
                title={data.user.username}
              >
                {data.user.username}
              </Link>
            </div>
          </div>
          <TrackMenuActions track={data}/>
          <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Genres</h1>
          <div className="flex min-w-0 flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link className="hover:text-brand-700 transition" to="/tracks">
              All
            </Link>
            {Array.isArray(categories) && categories.length ? (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  className="truncate hover:text-brand-700 transition"
                  to={`/tracks?cat=${cat.slug}`}
                  title={cat.name}
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <>
                <Link className="hover:text-brand-700 transition" to="/tracks?cat=gospel">
                  Gospel
                </Link>
                <Link className="hover:text-brand-700 transition" to="/tracks?cat=worship">
                  Worship
                </Link>
                <Link className="hover:text-brand-700 transition" to="/tracks?cat=praise">
                  Praise
                </Link>
                <Link className="hover:text-brand-700 transition" to="/tracks?cat=afrobeat">
                  Afrobeat
                </Link>
                <Link className="hover:text-brand-700 transition" to="/tracks?cat=inspirational">
                  Inspirational
                </Link>
              </>
            )}
          </div>
          <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Search</h1>
          <Search />
        </aside>
      </div>
    </article>
  );
};

export default SingleTrackPage;
