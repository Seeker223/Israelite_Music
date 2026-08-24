import { useSearchParams } from "react-router-dom";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchGenres = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
  return res.data;
};

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchGenres,
  });

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };
  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: category,
      });
    }
  };

  const currentSort = searchParams.get("sort") || "newest";
  const currentCategory = searchParams.get("cat") || "general";
  const categoryItemClass = (category) =>
    `cursor-pointer rounded-lg px-3 py-2 transition ${
      currentCategory === category
        ? "bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300"
        : "text-slate-600 hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="h-max rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/75 lg:sticky lg:top-24">
      <h1 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            checked={currentSort === "newest"}
            className="h-4 w-4 cursor-pointer accent-brand-700"
          />
          Newest
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            checked={currentSort === "popular"}
            className="h-4 w-4 cursor-pointer accent-brand-700"
          />
          Most Played
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            checked={currentSort === "trending"}
            className="h-4 w-4 cursor-pointer accent-brand-700"
          />
          Trending Music
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            checked={currentSort === "oldest"}
            className="h-4 w-4 cursor-pointer accent-brand-700"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Genres</h1>
      <div className="flex flex-col gap-2 text-sm">
        {Array.isArray(categories) && categories.length ? (
          <>
            <span
              className={categoryItemClass("general")}
              onClick={() => handleCategoryChange("general")}
            >
              All
            </span>
            {categories.map((cat) => (
              <span
                key={cat._id}
                className={categoryItemClass(cat.slug)}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.name}
              </span>
            ))}
          </>
        ) : (
          <>
            <span
              className={categoryItemClass("general")}
              onClick={() => handleCategoryChange("general")}
            >
              All
            </span>
            <span
              className={categoryItemClass("gospel")}
              onClick={() => handleCategoryChange("gospel")}
            >
              Gospel
            </span>
            <span
              className={categoryItemClass("worship")}
              onClick={() => handleCategoryChange("worship")}
            >
              Worship
            </span>
            <span
              className={categoryItemClass("praise")}
              onClick={() => handleCategoryChange("praise")}
            >
              Praise
            </span>
            <span
              className={categoryItemClass("afrobeat")}
              onClick={() => handleCategoryChange("afrobeat")}
            >
              Afrobeat
            </span>
            <span
              className={categoryItemClass("inspirational")}
              onClick={() => handleCategoryChange("inspirational")}
            >
              Inspirational
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
