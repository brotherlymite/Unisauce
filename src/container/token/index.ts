import { variableDebtTokenList } from "constants/tokens";
import { aTokenList, stableDebtTokenList } from "./../../constants/tokens";
import { CHAIN_ID } from "./../../connector/index";
import React from "react";
import { Connection } from "container/connection";
import { Contract, TRANZO_CONTRACT_ADDRESS } from "container/contract";
import { Global } from "container/global";
import { AllownaceTokenType } from "hooks/useTokens";
import { BalanceTokenType } from "hooks/useTokens";
import { Token, TokenType } from "types/token.types";
import { createContainer } from "unstated-next";
import { Contract as MulticallContract, ContractCall } from "ethers-multicall";
import { Fragment } from "ethers/lib/utils";
import { useImmerReducer } from "use-immer";

enum ACTIONS {
  SET_LOADING = "SET_LOADING",
  SET_ATOKEN_BALANCE = "SET_ATOKEN_BALANCE",
  SET_ATOKEN_ALLOWANCE = "SET_ATOKEN_ALLOWANCE",
  SET_STABLE_DEBT_TOKEN_BALANCE = "SET_STABLE_DEBT_TOKEN_BALANCE",
  SET_STABLE_DEBT_TOKEN_ALLOWANCE = "SET_STABLE_DEBT_TOKEN_ALLOWANCE",
  SET_VARIABLE_DEBT_TOKEN_BALANCE = "SET_VARIABLE_DEBT_TOKEN_BALANCE",
  SET_VARIABLE_DEBT_TOKEN_ALLOWANCE = "SET_VARIABLE_DEBT_TOKEN_ALLOWANCE",
}

const initialState = {
  loading: false,
  aTokenBalance: [] as BalanceTokenType[],
  aTokenAllowanace: [] as AllownaceTokenType[],
  stableDebtTokenBalance: [] as BalanceTokenType[],
  stableDebtTokenAllowance: [] as AllownaceTokenType[],
  variableDebtTokenBalance: [] as BalanceTokenType[],
  variableDebtTokenAllowance: [] as AllownaceTokenType[],
};

type ActionType =
  | { type: ACTIONS.SET_LOADING; payload: boolean }
  | { type: ACTIONS.SET_ATOKEN_BALANCE; payload: BalanceTokenType[] }
  | { type: ACTIONS.SET_ATOKEN_ALLOWANCE; payload: AllownaceTokenType[] }
  | { type: ACTIONS.SET_STABLE_DEBT_TOKEN_BALANCE; payload: BalanceTokenType[] }
  | { type: ACTIONS.SET_STABLE_DEBT_TOKEN_ALLOWANCE; payload: AllownaceTokenType[] }
  | { type: ACTIONS.SET_VARIABLE_DEBT_TOKEN_BALANCE; payload: BalanceTokenType[] }
  | { type: ACTIONS.SET_VARIABLE_DEBT_TOKEN_ALLOWANCE; payload: AllownaceTokenType[] };

const TokenFetch = createContainer(useToken);

function useToken() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const { ethMulticallProvider } = Connection.useContainer();
  const {
    state: {
      signer: { to: toAccount, from: fromAccount },
    },
  } = Global.useContainer();
  const { erc20: ERC20Contract, debtToken: DebtTokenContract } = Contract.useContainer();

  const setLoading = React.useCallback(
    (payload: boolean) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload });
    },
    [dispatch]
  );
  const setATokenBalance = React.useCallback(
    (payload: BalanceTokenType[]) => {
      dispatch({ type: ACTIONS.SET_ATOKEN_BALANCE, payload });
    },
    [dispatch]
  );

  const setATokenAllowance = React.useCallback(
    (payload: AllownaceTokenType[]) => {
      dispatch({ type: ACTIONS.SET_ATOKEN_ALLOWANCE, payload });
    },
    [dispatch]
  );

  const setStableDebtTokenBalance = React.useCallback(
    (payload: BalanceTokenType[]) => {
      dispatch({ type: ACTIONS.SET_STABLE_DEBT_TOKEN_BALANCE, payload });
    },
    [dispatch]
  );

  const setStableDebtTokenAllowance = React.useCallback(
    (payload: AllownaceTokenType[]) => {
      dispatch({ type: ACTIONS.SET_STABLE_DEBT_TOKEN_ALLOWANCE, payload });
    },
    [dispatch]
  );

  const setVariableDebtTokenBalance = React.useCallback(
    (payload: BalanceTokenType[]) => {
      dispatch({ type: ACTIONS.SET_VARIABLE_DEBT_TOKEN_BALANCE, payload });
    },
    [dispatch]
  );

  const setVariableDebtTokenAllowance = React.useCallback(
    (payload: AllownaceTokenType[]) => {
      dispatch({ type: ACTIONS.SET_VARIABLE_DEBT_TOKEN_ALLOWANCE, payload });
    },
    [dispatch]
  );

  const fetchBalance = React.useCallback(
    async (tokenList: Token[], tokenType: TokenType) => {
      const erc20 = tokenType === TokenType.AToken ? ERC20Contract.eth : DebtTokenContract;

      const tokenBalanceCalls: ContractCall[] = [];
      tokenList.forEach((token) => {
        if (erc20 && ethMulticallProvider && token && fromAccount.address) {
          const contract = new MulticallContract(token.address, erc20.interface.fragments as Fragment[]);
          tokenBalanceCalls.push(contract.balanceOf(fromAccount.address));
        }
      });
      const tokenBalances = await ethMulticallProvider?.all([...tokenBalanceCalls]);
      if (!tokenBalances) return;
      const balance = tokenList.map((t, i) => {
        return { ...t, balance: tokenBalances[i] };
      });

      if (tokenType === TokenType.AToken) setATokenBalance(balance);
      if (tokenType === TokenType.StableDebtToken) setStableDebtTokenBalance(balance);
      if (tokenType === TokenType.VariableDebtToken) setVariableDebtTokenBalance(balance);
    },
    [
      DebtTokenContract,
      ERC20Contract.eth,
      ethMulticallProvider,
      fromAccount.address,
      setATokenBalance,
      setStableDebtTokenBalance,
      setVariableDebtTokenBalance,
    ]
  );

  const fetchAllowance = React.useCallback(
    async (tokenList: Token[], tokenType: TokenType) => {
      const erc20 = tokenType === TokenType.AToken ? ERC20Contract.eth : DebtTokenContract;
      const allowanceFuncName = tokenType === TokenType.AToken ? "allowance" : "borrowAllowance";

      const allowanceContractCalls: ContractCall[] = [];
      tokenList.forEach((token) => {
        const approver = tokenType === TokenType.AToken ? fromAccount.address : toAccount.address;
        if (erc20 && ethMulticallProvider && token && approver) {
          const contract = new MulticallContract(token.address, erc20.interface.fragments as Fragment[]);
          allowanceContractCalls.push(contract[allowanceFuncName](approver, TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan]));
        }
      });
      const allowances = await ethMulticallProvider?.all([...allowanceContractCalls]);
      if (!allowances) return;

      const allowance = tokenList.map((t, i) => {
        return { ...t, allowance: allowances[i] };
      });

      if (tokenType === TokenType.AToken) setATokenAllowance(allowance);
      if (tokenType === TokenType.StableDebtToken) setStableDebtTokenAllowance(allowance);
      if (tokenType === TokenType.VariableDebtToken) setVariableDebtTokenAllowance(allowance);
    },
    [
      ERC20Contract.eth,
      DebtTokenContract,
      ethMulticallProvider,
      setATokenAllowance,
      setStableDebtTokenAllowance,
      setVariableDebtTokenAllowance,
      fromAccount.address,
      toAccount.address,
    ]
  );

  const refresh = React.useCallback(async () => {
    setLoading(true);
    await fetchBalance(aTokenList, TokenType.AToken);
    await fetchAllowance(aTokenList, TokenType.AToken);
    await fetchBalance(stableDebtTokenList, TokenType.StableDebtToken);
    await fetchAllowance(stableDebtTokenList, TokenType.StableDebtToken);
    await fetchBalance(variableDebtTokenList, TokenType.VariableDebtToken);
    await fetchAllowance(variableDebtTokenList, TokenType.VariableDebtToken);
    setLoading(false);
  }, [fetchAllowance, fetchBalance, setLoading]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    state,
    actions: {
      refresh,
      setLoading,
      fetchBalance,
      fetchAllowance,
      setATokenBalance,
      setATokenAllowance,
      setStableDebtTokenBalance,
      setStableDebtTokenAllowance,
      setVariableDebtTokenBalance,
      setVariableDebtTokenAllowance,
    },
  };
}
const reducer = (draft: typeof initialState, action: ActionType): any => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      draft.loading = action.payload;
      break;
    case ACTIONS.SET_ATOKEN_BALANCE:
      draft.aTokenBalance = action.payload;
      break;
    case ACTIONS.SET_ATOKEN_ALLOWANCE:
      draft.aTokenAllowanace = action.payload;
      break;
    case ACTIONS.SET_STABLE_DEBT_TOKEN_BALANCE:
      draft.stableDebtTokenBalance = action.payload;
      break;
    case ACTIONS.SET_STABLE_DEBT_TOKEN_ALLOWANCE:
      draft.stableDebtTokenAllowance = action.payload;
      break;
    case ACTIONS.SET_VARIABLE_DEBT_TOKEN_BALANCE:
      draft.variableDebtTokenBalance = action.payload;
      break;
    case ACTIONS.SET_VARIABLE_DEBT_TOKEN_ALLOWANCE:
      draft.variableDebtTokenAllowance = action.payload;
      break;
    default:
      return draft;
  }
};

export default TokenFetch;
