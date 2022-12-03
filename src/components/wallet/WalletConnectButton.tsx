import React from "react";
import { Button } from "rebass/styled-components";
import { Global } from "../../container/global";

type Props = {
  width?: any;
};

const WalletConnectButton = ({ width }: Props) => {
  const {
    actions: { toggleWalletModal },
  } = Global.useContainer();

  function openWalletModal() {
    toggleWalletModal(true);
  }
  return (
    <Button
      color={"white"}
      bg={"flash"}
      height={50}
      width={width ? width : "fit-content"}
      sx={{
        borderRadius: 3,
        border: `1.5px solid #e65f9c`,
        ":hover": {
          backgroundColor: "fadedFlash",
          cursor: "pointer",
        },
      }}
      onClick={openWalletModal}
    >
      Connect Wallet
    </Button>
  );
};

export default WalletConnectButton;
