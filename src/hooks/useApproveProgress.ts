import { BigNumber } from "ethers";
import { increaseByPercent } from "utils/format";
import React from "react";
import { AllownaceTokenType, BalanceTokenType } from "./useTokens";

const useApproveProgress = (tokenAllowances: Array<AllownaceTokenType> | undefined, tokenBalances: Array<BalanceTokenType>) => {
  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    const tokensWithBalance = tokenBalances.filter((t) => t?.balance?.toString() !== "0");
    const tokensApproved = tokensWithBalance.filter(
      (tb) =>
        parseFloat((tokenAllowances?.find((ta) => ta?.symbol === tb?.symbol)?.allowance || "").toString()) >=
        parseFloat(tb?.balance?.toString())
    );
    setProgress(tokensApproved.length / tokensWithBalance.length || 0);
  }, [tokenAllowances, tokenBalances]);

  return progress;
};

export default useApproveProgress;
