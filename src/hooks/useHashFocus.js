import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useHashFocus() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setTimeout(() => {
          element.focus();
        }, 300);
      }
    }
  }, [location]);
}