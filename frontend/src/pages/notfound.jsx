import React from "react";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("notFoundPage")}</h1>
    </div>
  );
}
