import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize numerology profile at app startup
import { setActiveProfile } from './utils/profile-singleton';
import { PERFIL_OFICIAL_FINAL } from './utils/official-profile-final';

setActiveProfile(PERFIL_OFICIAL_FINAL);
console.log('[main] Initialized with PERFIL_OFICIAL_FINAL');

createRoot(document.getElementById("root")!).render(<App />);
