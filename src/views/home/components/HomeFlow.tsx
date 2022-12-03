import Delegate from "components/Delegate";
import React from "react";
import Approve from "../../../components/Approve";
import PositionTable from "../../../components/PositionTable";
import { Step } from "../../../types/app.types";

type Props = {
  currentStep: Step;
};

const HomeFlow = ({ currentStep }: Props) => {
  function renderFlowComponent() {
    switch (currentStep) {
      case Step.ONE:
        return <PositionTable isReview={false} />;
      case Step.TWO:
        return <Approve />;
      case Step.THREE:
        return <Delegate />;
      case Step.FOUR:
        return <PositionTable isReview={true} />;
      default:
        return <></>;
    }
  }
  return <>{renderFlowComponent()}</>;
};

export default HomeFlow;
