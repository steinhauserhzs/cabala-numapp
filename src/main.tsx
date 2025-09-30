import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize numerology profile at app startup
import { setActiveProfile } from './utils/profile-singleton';
import { PERFIL_CONECTA } from './utils/numerology-profile';

setActiveProfile(PERFIL_CONECTA);
console.log('[main] Initialized with PERFIL_CONECTA');

createRoot(document.getElementById("root")!).render(<App />);
