import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import filter from "leo-profanity";
import App from "./components/App.jsx";
import reportWebVitals from "./reportWebVitals";
import "./i18next.js";

(filter as any).add((filter as any).getDictionary("ru"));
(filter as any).add((filter as any).getDictionary("en"));

const chatElement = document.getElementById("chat");
if (chatElement) {
  const root = ReactDOM.createRoot(chatElement);
  root.render(<App />);
} else {
  console.error('Element with id "chat" not found');
}

reportWebVitals();