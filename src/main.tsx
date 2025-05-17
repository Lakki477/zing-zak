
import React from 'react'; // Keep explicit React import at the top
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use React when rendering
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
