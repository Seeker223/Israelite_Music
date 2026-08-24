import { useState } from "react";
import TrackList from "../components/TrackList";
import SideMenu from "../components/SideMenu";

const TrackListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-6 md:py-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
          Music
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl">
          Music Library
        </h1>
      </div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="mb-5 rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow-soft md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <TrackList />
        </div>
        <aside className={`${open ? "block" : "hidden"} lg:block`}>
          <SideMenu />
        </aside>
      </div>
    </div>
  );
};

export default TrackListPage;
