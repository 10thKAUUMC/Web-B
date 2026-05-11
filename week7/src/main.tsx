import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,

        staleTime:
          1000 * 60 * 5,

        gcTime:
          1000 * 60 * 10,

        refetchOnWindowFocus:
          false,
      },
    },
  });

console.log(
  import.meta.env
    .VITE_GOOGLE_CLIENT_ID
);

ReactDOM.createRoot(
  document.getElementById(
    "root"
  )!
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        import.meta.env
          .VITE_GOOGLE_CLIENT_ID
      }
    >
      <QueryClientProvider
        client={queryClient}
      >
        <App />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);