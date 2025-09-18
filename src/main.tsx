import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set calibrated numerology profile globally (ensures same logic across all pages)
import { setActiveProfile } from "@/utils/numerology";
import { PERFIL_CALIBRADO } from "@/utils/calibrated-profile";
setActiveProfile(PERFIL_CALIBRADO);

createRoot(document.getElementById("root")!).render(<App />);
