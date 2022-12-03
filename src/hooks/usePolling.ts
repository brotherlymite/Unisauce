import React from "react";

export const usePolling = (callback: Function, delay: number) => {
  const savedCallback = React.useRef<Function>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function pollFunction() {
      if (savedCallback && savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay) {
      const id = setInterval(pollFunction, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
};
