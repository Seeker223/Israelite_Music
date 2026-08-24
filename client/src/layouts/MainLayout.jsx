import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { SignedIn, useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingModal from "../components/LoadingModal";
import NotificationWatcher from "../components/NotificationWatcher";

const MainLayout = () => {
  const [showLoading, setShowLoading] = useState(true);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingModal open={showLoading} />
      <NotificationWatcher />
      <div className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-40 mx-auto max-w-7xl min-h-screen text-slate-900 dark:text-slate-100">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
      <SignedIn>
        {isAdmin && (
          <Link
            to="/write"
            className="fixed md:hidden bottom-6 right-4 z-40 px-4 py-3 rounded-full bg-brand-700 text-white shadow-soft font-semibold"
          >
            Upload Music
          </Link>
        )}
      </SignedIn>
    </>
  );
};

export default MainLayout;
