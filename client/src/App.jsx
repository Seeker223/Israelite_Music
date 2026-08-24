import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Homepage from "./routes/Homepage.jsx";
import TrackListPage from "./routes/TrackListPage.jsx";
import SingleTrackPage from "./routes/SingleTrackPage.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import Cpanel from "./routes/Cpanel.jsx";

const ClientOnlyUpload = () => {
  const [UploadComponent, setUploadComponent] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("./routes/Write.jsx").then((module) => {
      if (mounted) {
        setUploadComponent(() => module.default);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!UploadComponent) {
    return <div className="py-10 text-slate-600">Loading editor...</div>;
  }

  return <UploadComponent />;
};

const ClientOnlyEditTrack = () => {
  const [EditTrackComponent, setEditTrackComponent] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("./routes/EditTrack.jsx").then((module) => {
      if (mounted) {
        setEditTrackComponent(() => module.default);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!EditTrackComponent) {
    return <div className="py-10 text-slate-600">Loading editor...</div>;
  }

  return <EditTrackComponent />;
};

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/tracks" element={<TrackListPage />} />
        <Route path="/:slug" element={<SingleTrackPage />} />
        <Route
          path="/write"
          element={<ClientOnlyUpload />}
        />
        <Route path="/cpanel" element={<Cpanel />} />
        <Route path="/cpanel/tracks/:id/edit" element={<ClientOnlyEditTrack />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default App;
