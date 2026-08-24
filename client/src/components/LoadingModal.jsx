const LoadingModal = ({ open }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/logo.png"
          alt="Israelite Music"
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-card"
        />
        <p className="text-slate-700 dark:text-slate-200 font-medium">
          Loading Israelite Music...
        </p>
        <div className="w-40 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full w-1/2 bg-brand-700 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
