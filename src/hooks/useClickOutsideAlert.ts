import { useEffect, MutableRefObject } from "react";

const useOutsideAlerter = (
  ref: MutableRefObject<any>,
  alertCallback?: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        alertCallback && alertCallback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  } , [ref, alertCallback]);
};

export default useOutsideAlerter;
