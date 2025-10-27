import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PageTitleProvider } from "@/context/PageTitleContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PageTitleProvider>
    <App />
    </PageTitleProvider>
  </StrictMode>
);
