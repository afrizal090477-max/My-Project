import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { PageTitleProvider } from "./context/PageTitleContext";
import { UserProfileProvider, useUserProfile } from "./context/UserProfileContext"; // tambahkan ini
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PageTitleProvider>
          <UserProfileProvider>
            <App />
          </UserProfileProvider>
        </PageTitleProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
