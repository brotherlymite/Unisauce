import React from "react";
import { Box, Flex, Text } from "rebass/styled-components";

import Header from "../../components/Header";
import AppButton from "../../components/primitives/Button";
import { Flow } from "../../container/flow/index";
import HomeFlow from "./components/HomeFlow";
import Stepper from "./components/Stepper";
import useTranzo from "hooks/useTranzo";
import { Step } from "types/app.types";
import { Global } from "container/global";
import Strip from "components/Strip";

type Props = {};

const Home = (props: Props) => {
  const {
    actions: { tranzoTransfer },
  } = useTranzo();
  const {
    currentStep,
    loading,
    actions: { changeStep, buttonFlow },
  } = Flow.useContainer();
  const {
    state: {
      tranzoDone,
      signer: { to: toAccount },
    },
  } = Global.useContainer();

  const handlePress = React.useCallback(() => {
    if (loading || tranzoDone) return;
    if (currentStep === Step.FOUR) {
      tranzoTransfer(toAccount.address);
      return;
    }

    buttonFlow(currentStep).action();
  }, [buttonFlow, currentStep, loading, toAccount.address, tranzoDone, tranzoTransfer]);

  const getAppButtonText = React.useCallback(() => {
    if (currentStep === Step.FOUR) {
      return "Transfer Positions";
    } else if (tranzoDone) {
      return "Transfer Completed";
    } else {
      return buttonFlow(currentStep).buttonLabel;
    }
  }, [buttonFlow, currentStep, tranzoDone]);
  return (
    <>
      <Header />
    </>
  );
};

export default Home;
