import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force dark mode by default for the black and gold theme
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(<App />);
