import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Global SCSS
import './assets/scss/main.scss'

import { ScrollSpy } from "bootstrap";

window.onload = () => {
    const el = document.getElementById("scrollspy-container");
    if (el) new ScrollSpy(el, { target: "#mainNav", offset: 100 });
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)