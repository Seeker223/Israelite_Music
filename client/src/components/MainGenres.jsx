import { Link } from "react-router-dom";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchGenres = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
  return res.data;
};

const MainGenres = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchGenres,
  });

  const visibleGenres = Array.isArray(categories)
    ? categories.slice(0, 6)
    : [];

  return (
    <div className="hidden md:flex bg-white/80 backdrop-blur rounded-3xl xl:rounded-full p-4 shadow-card items-center justify-center gap-8 border border-slate-200/60">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/tracks"
          className="bg-brand-700 text-white rounded-full px-4 py-2 shadow-soft hover:bg-brand-800 transition"
        >
          All Music
        </Link>
        {visibleGenres.length ? (
          visibleGenres.map((cat) => (
            <Link
              key={cat._id}
              to={`/tracks?cat=${cat.slug}`}
              className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
              title={cat.name}
            >
              {cat.name}
            </Link>
          ))
        ) : (
          <>
            <Link
              to="/tracks?cat=gospel"
              className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
            >
              Gospel
            </Link>
            <Link
              to="/tracks?cat=worship"
              className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
            >
              Worship
            </Link>
            <Link
              to="/tracks?cat=praise"
              className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
            >
              Praise
            </Link>
            <Link
              to="/tracks?cat=afrobeat"
              className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
            >
              Afrobeat
            </Link>
            <Link
              to="/tracks?cat=inspirational"
              className="hover:bg-brand-50 rounded-full px-4 py-2 transition"
            >
              Inspirational
            </Link>
          </>
        )}
      </div>
      <span className="text-xl font-medium text-slate-300">|</span>
      {/* search */}
      <Search/>
    </div>
  );
};

export default MainGenres;
