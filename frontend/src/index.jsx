import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import reportWebVitals from "./reportWebVitals";
import "./i18next.js";
import filter from "leo-profanity";

filter.add(filter.getDictionary("ru"));
filter.add(filter.getDictionary("en"));

const root = ReactDOM.createRoot(document.getElementById("chat"));
root.render(<App />);

reportWebVitals();
