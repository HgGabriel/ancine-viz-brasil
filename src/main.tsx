import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ReactQueryProvider, ThemeProvider } from "./providers";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </ThemeProvider>
);
