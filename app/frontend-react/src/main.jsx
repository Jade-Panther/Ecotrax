import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "./css/index.css";
import "./css/map.css";
import "./css/sidebar.css";
import "./css/right_sidebar.css";
import "./css/filter_sidebar.css";

import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
