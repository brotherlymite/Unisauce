export type TokenListType = {
  symbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  decimals: number;
};

export type TokenList = TokenListType[];

export type Token = {
  symbol: string;
  address: string;
  decimal: number;
};

export enum TokenType {
  AToken = "AToken",
  DebtToken = "DebtToken",
  StableDebtToken = "StableDebtToken",
  VariableDebtToken = "VariableDebtToken",
}
