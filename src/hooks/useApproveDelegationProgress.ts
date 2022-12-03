import React from "react";

import { TokenWithAllowanceAndBalanceType } from "./../components/DelegateTokenItem";

const useApproveDelegationProgress = (debtTokenList: TokenWithAllowanceAndBalanceType[]) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const approvedList = debtTokenList?.filter((t) => parseFloat(t?.allowance?.toString()) >= parseFloat(t?.balance?.toString()));
    setProgress(approvedList.length / debtTokenList.length || 0);
  }, [debtTokenList, setProgress]);

  return progress;
};

export default useApproveDelegationProgress;
