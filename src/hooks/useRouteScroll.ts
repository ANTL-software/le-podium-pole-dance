import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useRouteScroll() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = new URLSearchParams(location.search).get("section") ?? "";

    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname, location.search]);
}
