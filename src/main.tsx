import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set unified numerology profile globally (ensures same logic across all pages)
import { setActiveProfile } from "@/utils/numerology";
import { PERFIL_CONECTA } from "@/utils/numerology-profile";
setActiveProfile(PERFIL_CONECTA);

createRoot(document.getElementById("root")!).render(<App />);
