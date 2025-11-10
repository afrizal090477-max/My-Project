import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { PageTitleProvider } from "./context/PageTitleContext"; // import dan path sesuai project kamu
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PageTitleProvider>
          <App />
        </PageTitleProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
