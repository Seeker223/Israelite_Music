import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";

export const render = (url) => {
  const queryClient = new QueryClient();
  const publishableKey =
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

  const appHtml = renderToString(
    <ClerkProvider publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={2800}
          newestOnTop
          pauseOnFocusLoss={false}
        />
      </QueryClientProvider>
    </ClerkProvider>
  );

  return { html: appHtml, head: "" };
};
