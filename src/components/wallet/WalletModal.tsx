import React from "react";
import { Box, Flex } from "rebass/styled-components";

import { User } from "container/user";
import Modal from "../primitives/Modal";
import WalletButton from "./WalletButton";
import { Global } from "../../container/global";
import { SUPPORTED_WALLETS } from "../../constants/wallet";

type Props = {};

/**
 * Wallet Modal Flow
 * GET_TO_SIGNER -> GET_FROM_SIGNER -> SHOW_PREVIEW
 */

const WalletModal = (props: Props) => {
  const {
    state: {
      modal: { isOpen },
    },
    actions: { toggleWalletModal },
  } = Global.useContainer();

  const {
    actions: { logout },
  } = User.useContainer();

  function closeWalletModal() {
    logout();
    toggleWalletModal(false);
  }

  const walletList = React.useCallback(() => {
    return (
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
    );
  }, []);

  return (
    <Modal height={200} close={closeWalletModal} heading={'Connect your wallet'} show={isOpen}>
      <>
        <Flex height={"100%"} flexDirection={"column"} justifyContent={"space-between"}>
          <Box>{walletList()}</Box>
        </Flex>
      </>
    </Modal>
  );
};

export default WalletModal;
