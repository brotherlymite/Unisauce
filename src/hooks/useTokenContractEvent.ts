import { Contract } from "ethers";
import React from "react";

type Callback = (...args: any[]) => void;

const useContractEvent = (contract: Contract, address: string, eventName: string, callback: Callback) => {
  const savedCallback = React.useRef<Callback | null>();
  const _contract = contract?.attach(address);

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    function listener(...args: any[]) {
      if (savedCallback.current) {
        savedCallback.current(...args);
      }
    }
    if (_contract && eventName) {
      _contract.on(eventName, listener);

      return () => {
        _contract.off(eventName, listener);
      };
    }
  }, [_contract, contract, eventName]);
};

export default useContractEvent;
