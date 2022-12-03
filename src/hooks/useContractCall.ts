import React from "react";

export function useContractCall(fn: Function, deps: any[]) {
  const savedCallback = React.useRef<Function>();

  React.useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  const memoizedCallback = React.useCallback(
    (...args: any[]) => {
      if (savedCallback.current) {
        return savedCallback.current(...args);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps]
  );

  return memoizedCallback;
}
