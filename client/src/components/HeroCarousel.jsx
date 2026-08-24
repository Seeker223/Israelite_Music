import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const fetchHeroTracks = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: 1, limit: 5, sort: "newest" },
  });
  return res.data?.posts || [];
};

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const { data = [], isPending } = useQuery({
    queryKey: ["heroTracks"],
    queryFn: fetchHeroTracks,
  });

  const slides = data.filter((track) => track?.img).slice(0, 3);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (isPending) {
    return <div className="h-60 md:h-72 rounded-3xl skeleton-shimmer mt-4" />;
  }

  if (!slides.length) return null;

  const slide = slides[index];
  const endpoint = (import.meta.env.VITE_IK_URL_ENDPOINT || "").replace(/\/+$/, "");
  const imagePath = String(slide.img || "").replace(/^\/+/, "");

  return (
    <div className="relative mt-4 rounded-3xl overflow-hidden shadow-card border border-slate-200/60 dark:border-slate-700/50 h-60 md:h-72 lg:h-80">
      <img
        src={`${endpoint}/${imagePath}`}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />
      <div className="relative h-full p-6 md:p-10 flex flex-col justify-end">
        <p className="text-white/90 text-sm mb-2">Latest Highlight</p>
        <h2 className="text-white text-2xl md:text-4xl max-w-2xl font-semibold leading-tight">
          {slide.title}
        </h2>
        <Link
          to={`/${slide.slug}`}
          className="mt-4 w-max px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition"
        >
          Listen Now
        </Link>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            onClick={() => setIndex(dotIndex)}
            className={`h-2.5 rounded-full transition-all ${
              dotIndex === index ? "w-7 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
