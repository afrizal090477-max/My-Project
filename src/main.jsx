import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/mystore";
import { PageTitleProvider } from "./context/PageTitleContext";
import { restoreSession } from "./features/auth/authSlice";  // TAMBAHAN: import restoreSession


// TAMBAHAN: Restore session dari localStorage saat app load
store.dispatch(restoreSession());


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PageTitleProvider>
        <App />
      </PageTitleProvider>
    </Provider>
  </StrictMode>
);
