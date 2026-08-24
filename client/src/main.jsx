import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import TrackListPage from "./routes/TrackListPage.jsx";
import Upload from "./routes/Write.jsx";
import Cpanel from "./routes/Cpanel.jsx";
import EditTrack from "./routes/EditTrack.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import SingleTrackPage from "./routes/SingleTrackPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/tracks",
        element: <TrackListPage />,
      },
      {
        path: "/:slug",
        element: <SingleTrackPage />,
      },
      {
        path: "/write",
        element: <Upload />,
      },
      {
        path: "/cpanel",
        element: <Cpanel />,
      },
      {
        path: "/cpanel/tracks/:id/edit",
        element: <EditTrack />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer
          position="bottom-right"
          autoClose={2800}
          newestOnTop
          pauseOnFocusLoss={false}
        />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
