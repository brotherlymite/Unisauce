import useNotification from "hooks/useNotification";
import { Global } from "container/global";
import { useWeb3React } from "@web3-react/core";
import { User } from "container/user";
import React from "react";

export enum GetSignerType {
  GET_TO_SIGNER = "GET_TO_SIGNER",
  GET_FROM_SIGNER = "GET_FROM_SIGNER",
  SHOW_PREVIEW = "SHOW_PREVIEW",
}

const useWalletModal = () => {
  const [type, setType] = React.useState(GetSignerType.GET_TO_SIGNER);
  const { notify } = useNotification();
  const {
    state: { address },
    actions: { deactivateWallet },
  } = User.useContainer();
  const { library, account } = useWeb3React();
  const {
    state: {
      signer: { to: toSignerData },
    },
    actions: { setFromSigner, setToSigner, toggleWalletModal },
  } = Global.useContainer();

  const getWalletModalHeading = React.useCallback(() => {
    switch (type) {
      case GetSignerType.GET_FROM_SIGNER:
        return "Connect to the wallet you wish to move positions from";
      case GetSignerType.GET_TO_SIGNER:
        return "Connect to the wallet you wish to move positions to";
      case GetSignerType.SHOW_PREVIEW:
        return "Accounts Preview";
      default:
        return "";
    }
  }, [type]);

  // private functions

  const showWalletEmptyError = React.useCallback(() => {
    notify({ title: "Wallet Error", description: "Please select a wallet account" });
    deactivateWallet();
  }, [deactivateWallet, notify]);

  const setToWalletSigner = React.useCallback(() => {
    if (address === "") {
      showWalletEmptyError();
      return;
    }
    setToSigner({
      signer: library?.getSigner() || null,
      address: account || "",
    });
    deactivateWallet();
    setType(GetSignerType.GET_FROM_SIGNER);
  }, [account, address, deactivateWallet, library, setToSigner, showWalletEmptyError]);

  const setFromWalletSigner = React.useCallback(() => {
    if (address === toSignerData?.address) {
      notify({ title: "Same wallet account", description: "To and from account cannot be same" });
      deactivateWallet();
      return;
    }

    if (address === "") {
      showWalletEmptyError();
      return;
    }
    setFromSigner({
      signer: library?.getSigner() || null,
      address: account || "",
    });
    setType(GetSignerType.SHOW_PREVIEW);
  }, [address, toSignerData?.address, setFromSigner, library, account, notify, deactivateWallet, showWalletEmptyError]);

  const handleWalletModalNext = React.useCallback(() => {
    switch (type) {
      case GetSignerType.GET_TO_SIGNER:
        return setToWalletSigner();
      case GetSignerType.GET_FROM_SIGNER:
        return setFromWalletSigner();
      default:
        setType(GetSignerType.GET_TO_SIGNER);
        toggleWalletModal(false);
    }
  }, [setFromWalletSigner, setToWalletSigner, toggleWalletModal, type]);
  return {
    type,
    setType,
    handleWalletModalNext,
    getWalletModalHeading,
  };
};

export default useWalletModal;
