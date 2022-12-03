import Modal from "components/primitives/Modal";
import { SUPPORTED_WALLETS } from "constants/wallet";
import { Global } from "container/global";
import React from "react";
import { truncateAddress } from "utils/address";
import WalletButton from "./WalletButton";

type Props = {};

const WalletConnectModal = (props: Props) => {
  const {
    state: { connectTo },
    actions: { setConenctTo },
  } = Global.useContainer();

  const closeWalletModal = React.useCallback(() => {
    setConenctTo("");
  }, [setConenctTo]);
  return (
    <Modal height={"auto"} close={closeWalletModal} heading={`Connect to ${truncateAddress(connectTo)}`} show={connectTo !== ""}>
      <>
        {SUPPORTED_WALLETS.map((wallet) => (
          <WalletButton
            key={wallet.name}
            name={wallet.name}
            description={wallet.description}
            connector={wallet.connector}
            id={wallet.id}
            icon={wallet.iconName}
          />
        ))}
      </>
    </Modal>
  );
};

export default WalletConnectModal;
