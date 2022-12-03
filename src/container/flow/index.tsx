import React from "react";

import TokenFetch from "container/token";
import { Step } from "../../types/app.types";
import useDelegation from "hooks/useDelegation";
import { createContainer } from "unstated-next";
import { Connection } from "../connection/index";
import useNotification from "hooks/useNotification";
import useApproveProgress from "hooks/useApproveProgress";
import useApproveDelegationProgress from "hooks/useApproveDelegationProgress";

export const Flow = createContainer(useFlow);

function useFlow() {
  const [loading, setLoading] = React.useState(false);
  const {
    state: {
      loading: tokenFetchLoading,
      aTokenBalance: aTokenBalances,
      aTokenAllowanace: aTokenAllowances,
      stableDebtTokenAllowance: stableDebtTokenAllowances,
      stableDebtTokenBalance: stableDebtTokenBalances,
      variableDebtTokenBalance: variableDebtTokenBalances,
      variableDebtTokenAllowance: variableDebtTokenAllowanaces,
    },
  } = TokenFetch.useContainer();
  const { account } = Connection.useContainer();

  const { delegateTokens } = useDelegation(
    stableDebtTokenBalances,
    stableDebtTokenAllowances,
    variableDebtTokenBalances,
    variableDebtTokenAllowanaces
  );
  const approveProgress = useApproveProgress(aTokenAllowances, aTokenBalances);
  const delegationProgress = useApproveDelegationProgress(delegateTokens);
  const [currentStep, setCurrentStep] = React.useState<Step>(Step.ONE);
  const { notify } = useNotification();

  const changeStep = React.useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  React.useEffect(() => {
    setLoading(tokenFetchLoading);
  }, [tokenFetchLoading]);

  const buttonFlow = (currentStep: Step) => {
    // console.log("currentStep", currentStep);
    switch (currentStep) {
      case Step.ONE:
        return {
          buttonLabel: "Transfer Positions",
          action: moveApproveStep,
        };
      case Step.TWO:
        return {
          buttonLabel: "Continue",
          action: moveDelegationStep,
        };
      case Step.THREE:
        return {
          buttonLabel: "Continue",
          action: moveReviewPositions,
        };
      default:
        throw Error("Can not handle current step");
    }
  };

  // Private functions
  const moveApproveStep = () => {
    if (aTokenBalances.filter((t) => t.balance?.toString() !== "0").length === 0 || !account) return;
    changeStep(currentStep + 1);
  };

  const moveDelegationStep = async () => {
    if (approveProgress !== 1) {
      notify({
        title: "Approval Pending",
        description: "Please approve all the tokens",
      });
      return;
    }
    if (currentStep === Step.FOUR) return;
    changeStep(currentStep + 1);
  };

  const moveReviewPositions = async () => {
    if (delegationProgress !== 1) {
      notify({
        title: "Delegation Pending",
        description: "Please delegate all the tokens",
      });
      return;
    }
    if (currentStep === Step.FOUR) return;
    changeStep(currentStep + 1);
  };

  return {
    currentStep,
    loading,
    actions: {
      changeStep,
      buttonFlow,
    },
  };
}
