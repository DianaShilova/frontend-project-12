import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./locales/index.js";
import filter from "leo-profanity";

i18next.createInstance();
i18next.use(initReactI18next).init({
  fallbackLng: "ru",
  debug: true,
  resources,
  interpolation: {
    excapeValue: false,
  },
});
