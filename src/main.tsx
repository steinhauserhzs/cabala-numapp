import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize numerology profile (single source of truth)
import { initializeProfile } from "@/utils/profile-singleton";
import { PERFIL_OFICIAL_FINAL } from "@/utils/official-profile-final";
initializeProfile(PERFIL_OFICIAL_FINAL);

createRoot(document.getElementById("root")!).render(<App />);
