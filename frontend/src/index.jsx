import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import reportWebVitals from "./reportWebVitals";
import "./i18next.js";

const root = ReactDOM.createRoot(document.getElementById("chat"));
root.render(<App />);

reportWebVitals();
