import { TokenWithAllowanceAndBalanceType } from "components/DelegateTokenItem";
import { BalanceTokenType } from "hooks/useTokens";
import { AllownaceTokenType } from "hooks/useTokens";
import React from "react";
const useDelegation = (
  stableDebtTokenBalances: BalanceTokenType[],
  stableDebtTokenAllowances: AllownaceTokenType[],
  variableDebtTokenBalances: BalanceTokenType[],
  variableDebtTokenAllownaces: AllownaceTokenType[]
) => {
  const stableDelegateTokens = React.useMemo(
    () =>
      stableDebtTokenBalances
        .filter((t) => t?.balance?.toString() !== "0")
        .map((tk) => {
          const ta = stableDebtTokenAllowances.find((t) => t.symbol === tk.symbol);
          if (ta) {
            return {
              ...tk,
              allowance: ta.allowance,
              type: "stable",
            };
          }
          return {
            ...tk,
            type: "stable",
          };
        }),
    [stableDebtTokenAllowances, stableDebtTokenBalances]
  );

  const variableDelegateTokens = React.useMemo(
    () =>
      variableDebtTokenBalances
        .filter((t) => t?.balance?.toString() !== "0")
        .map((tk) => {
          const ta = variableDebtTokenAllownaces.find((t) => t.symbol === tk.symbol);
          if (ta) {
            return {
              ...tk,
              allowance: ta.allowance,
              type: "variable",
            };
          }
          return {
            ...tk,
            type: "variable",
          };
        }),
    [variableDebtTokenAllownaces, variableDebtTokenBalances]
  );

  const delegateTokens: TokenWithAllowanceAndBalanceType[] = React.useMemo(
    () => ([] as any).concat(stableDelegateTokens, variableDelegateTokens),
    [stableDelegateTokens, variableDelegateTokens]
  );

  return {
    delegateTokens,
  };
};

export default useDelegation;
