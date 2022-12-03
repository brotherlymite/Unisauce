import useNotification from "hooks/useNotification";
import React from "react";
import { createContainer } from "unstated-next";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEY } from "../../constants/storage";
import { useWeb3React } from "@web3-react/core";
import { CHAIN_ID } from "../../connector";
import usePrevious from "../../hooks/usePrevious";
import { Flow } from "container/flow";
import { Step } from "types/app.types";
import { Global } from "container/global";
import { disconnect } from "process";

enum ACTIONS {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGOUT = "LOGOUT",
}
type ActionType =
  | { type: ACTIONS.LOGIN_REQUEST }
  | { type: ACTIONS.LOGIN_SUCCESS; payload: { address: string } }
  | { type: ACTIONS.LOGIN_FAIL }
  | { type: ACTIONS.LOGOUT };

const { CONNECTOR_ID } = STORAGE_KEY;

const initialState = {
  isLoading: false,
  address: "",
};

export const User = createContainer(useUser);

function usePostLogout(onLogout: Function) {
  const { active } = useWeb3React();
  const previousSession = usePrevious(active);

  React.useEffect(() => {
    if (previousSession && !active) {
      // clear up state when user logs out from wallet connect
      onLogout();
    }
  }, [previousSession, active, onLogout]);
}

function useUser() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { notify } = useNotification();
  const { active, account, activate, deactivate, chainId } = useWeb3React();
  const [, setConnectorId] = useLocalStorage(CONNECTOR_ID.name, CONNECTOR_ID.defaultValue);
  const {
    actions: { changeStep },
  } = Flow.useContainer();

  const {
    actions: { clearSigners, toggleWalletModal, setConenctTo, setTranzoDone },
  } = Global.useContainer();

  usePostLogout(() => {
    setConnectorId("");
    dispatch({ type: ACTIONS.LOGOUT });
  });

  React.useEffect(() => {
    if (active && account && chainId) {
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { address: account } });
      const isWrongNetwork = chainId !== CHAIN_ID.Kovan;
      if (isWrongNetwork) {
        notify({
          title: "Wrong Network",
          description: "Please use Polygon network", // todo: make this from a single source
        });
        // console.log("---connected---");
        toggleWalletModal(false);
        setConenctTo("");
      }
    }
  }, [account, active, chainId, deactivate, notify, setConenctTo, toggleWalletModal]);

  const login = React.useCallback(
    (instance: AbstractConnector, connectorId: string, onActivate?: Function) => {
      dispatch({ type: ACTIONS.LOGIN_REQUEST });
      setConnectorId(connectorId);
      activate(instance, () => {}, true)
        .then(() => {
          if (onActivate) {
            onActivate();
          }
          console.log("connect success");
        })
        .catch((err) => {
          setConnectorId("");
          dispatch({ type: ACTIONS.LOGIN_FAIL });
          console.log(err.code);
        });
    },
    [deactivate, setConnectorId, activate]
  );

  const logout = React.useCallback(() => {
    deactivate();
    changeStep(Step.ONE);
    setTranzoDone("");
    clearSigners();
  }, [changeStep, clearSigners, deactivate, setTranzoDone]);

  const deactivateWallet = React.useCallback(() => {
    deactivate();
  }, [deactivate]);

  //auto login
  // const [isTried, setIsTried] = React.useState(false);
  // const [connectorId] = useLocalStorage(CONNECTOR_ID.name, CONNECTOR_ID.defaultValue);
  // React.useEffect(() => {
  //   const connector = SUPPORTED_WALLETS.find((walletInfo) => walletInfo.id === connectorId)?.connector;
  //   if (!isTried && connector) {
  //     login(connector, connectorId);
  //     setIsTried(true);
  //   }
  // }, [connectorId, isTried, login]);

  return {
    state,
    actions: {
      login,
      logout,
      deactivateWallet,
    },
  };
}

function reducer(state: typeof initialState, action: ActionType) {
  switch (action.type) {
    case ACTIONS.LOGIN_REQUEST: {
      return { ...state, isLoading: true };
    }
    case ACTIONS.LOGIN_SUCCESS: {
      const { address } = action.payload;
      return { ...state, isLoading: false, address };
    }
    case ACTIONS.LOGIN_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case ACTIONS.LOGOUT: {
      return {
        ...state,
        address: "",
      };
    }
    default:
      throw new Error();
  }
}
