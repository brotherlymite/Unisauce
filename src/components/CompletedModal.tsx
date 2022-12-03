import { Global } from "container/global";
import { User } from "container/user";
import React from "react";
import { Box } from "rebass/styled-components";
import { getEtherscanTxLink } from "utils/link";
import ConnectAccount from "./ConnectAccount";
import { ExternalLink } from "./ExternalLink";
import AppButton from "./primitives/Button";
import Modal from "./primitives/Modal";

type Props = {};

const CompletedModal = (props: Props) => {
  const {
    state: {
      tranzoDone,
      signer: { to: toAccount, from: fromAccount },
    },
    actions: { setTranzoDone },
  } = Global.useContainer();

  const {
    actions: { logout },
  } = User.useContainer();

  const closeCompletedModal = React.useCallback(() => {
    setTranzoDone("");
  }, [setTranzoDone]);
  return (
    <Modal height={"auto"} close={closeCompletedModal} heading={"Wohoo! Transfer Completed"} show={tranzoDone !== ""}>
      <>
        <ConnectAccount from={fromAccount.address} to={toAccount.address} />
        <Box textAlign={"center"} mt={30}>
          <ExternalLink href={getEtherscanTxLink(tranzoDone)}>View Transaction</ExternalLink>
        </Box>
        <AppButton
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "15px",
          }}
          rightIcon={<i className="fas fa-arrow-right white"></i>}
          label={"Start Another Transfer"}
          onPress={logout}
        />
      </>
    </Modal>
  );
};

export default CompletedModal;
