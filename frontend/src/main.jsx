import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "@/app/App";
import Providers from "@/app/providers";
import { Toaster } from "react-hot-toast";
import { THEME_COLORS } from "@/utils/constants";
import { applyThemeColors } from "@/utils/theme/applyTheme";
import { persistor } from "@/store";

applyThemeColors();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Providers>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: THEME_COLORS.toastBackground,
          color: THEME_COLORS.toastText,
        },
      }}
    />
  </StrictMode>,
);
