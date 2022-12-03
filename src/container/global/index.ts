import React from "react";
import { createContainer } from "unstated-next";
import { useImmerReducer } from "use-immer";

enum ACTIONS {
  TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL",
  SET_TO_SIGNER = "SET_TO_SIGNER",
  SET_FROM_SIGNER = "SET_FROM_SIGNER",
  CLEAR_SIGNERS = "CLEAR_SIGNERS",
  SET_CONNECT_TO = "SET_CONNECT_TO",
  SET_TRANZO_DONE = "SET_TRANZO_DONE",
}

const initialSignerState = {
  from: {
    address: "",
    signer: null,
  },
  to: {
    address: "",
    signer: null,
  },
};

const initialState = {
  modal: {
    isOpen: false,
  },
  signer: initialSignerState,
  connectTo: "",
  tranzoDone: "",
};

type ActionType =
  | { type: ACTIONS.TOGGLE_WALLET_MODAL; payload: boolean }
  | { type: ACTIONS.SET_TO_SIGNER; payload: { signer: any; address: string } }
  | { type: ACTIONS.SET_FROM_SIGNER; payload: { signer: any; address: string } }
  | { type: ACTIONS.CLEAR_SIGNERS }
  | { type: ACTIONS.SET_CONNECT_TO; payload: string }
  | { type: ACTIONS.SET_TRANZO_DONE; payload: string };

export const Global = createContainer(useGlobal);

function useGlobal() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const toggleWalletModal = React.useCallback(
    (payload: boolean) => {
      dispatch({ type: ACTIONS.TOGGLE_WALLET_MODAL, payload });
    },
    [dispatch]
  );

  const setConenctTo = React.useCallback(
    (payload: string) => {
      dispatch({ type: ACTIONS.SET_CONNECT_TO, payload });
    },
    [dispatch]
  );

  const setToSigner = React.useCallback(
    (payload: { signer: any; address: string }) => {
      dispatch({ type: ACTIONS.SET_TO_SIGNER, payload });
    },
    [dispatch]
  );

  const setFromSigner = React.useCallback(
    (payload: { signer: any; address: string }) => {
      dispatch({ type: ACTIONS.SET_FROM_SIGNER, payload });
    },
    [dispatch]
  );

  const clearSigners = React.useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_SIGNERS });
  }, [dispatch]);

  const setTranzoDone = React.useCallback(
    (payload: string) => {
      dispatch({ type: ACTIONS.SET_TRANZO_DONE, payload });
    },
    [dispatch]
  );

  return {
    state,
    actions: {
      toggleWalletModal,
      setToSigner,
      setFromSigner,
      clearSigners,
      setConenctTo,
      setTranzoDone,
    },
  };
}

const reducer = (draft: typeof initialState, action: ActionType): any => {
  switch (action.type) {
    case ACTIONS.TOGGLE_WALLET_MODAL:
      draft.modal.isOpen = action.payload;
      break;
    case ACTIONS.SET_TO_SIGNER:
      draft.signer.to.address = action.payload.address;
      draft.signer.to.signer = action.payload.signer;
      break;
    case ACTIONS.SET_FROM_SIGNER:
      draft.signer.from.address = action.payload.address;
      draft.signer.from.signer = action.payload.signer;
      break;
    case ACTIONS.CLEAR_SIGNERS:
      draft.signer = initialSignerState;
      break;
    case ACTIONS.SET_CONNECT_TO:
      draft.connectTo = action.payload;
      break;
    case ACTIONS.SET_TRANZO_DONE:
      draft.tranzoDone = action.payload;
      break;
    default:
      return draft;
  }
};
