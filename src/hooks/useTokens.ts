import { CHAIN_ID } from "./../connector/index";
import { TRANZO_CONTRACT_ADDRESS } from "./../container/contract/index";
import { ethers } from "ethers";
import { Connection } from "../container/connection/index";
import { Contract } from "../container/contract/index";
import React from "react";
import { Contract as MulticallContract, ContractCall } from "ethers-multicall";
import { Fragment } from "ethers/lib/utils";
import { Token, TokenType } from "types/token.types";
import { Global } from "container/global";

/**
 * Provides utils for approval of token, balance of token, balances of tokens
 * get allowance by spender, get allowances for list of token etc..
 */

export interface BalanceTokenType extends Token {
  balance: ethers.BigNumber;
}

export interface AllownaceTokenType extends Token {
  allowance: ethers.BigNumber;
}

const useTokens = (tokenList: Token[], tokenType: TokenType) => {
  const [balances, setBalances] = React.useState<BalanceTokenType[]>([]);
  const [allowances, setAllowances] = React.useState<AllownaceTokenType[]>([]);
  const [isBalanceLoading, setIsBalanceLoading] = React.useState<boolean>(false);
  const [isAllowanceLoading, setIsAllowanceLoading] = React.useState<boolean>(false);
  const { erc20: ERC20Contract, debtToken: DebtTokenContract } = Contract.useContainer();

  const { ethMulticallProvider } = Connection.useContainer();
  const {
    state: {
      signer: { to: toAccount, from: fromAccount },
    },
  } = Global.useContainer();
  const erc20 = tokenType === TokenType.AToken ? ERC20Contract.eth : DebtTokenContract;
  const allowanceFuncName = tokenType === TokenType.AToken ? "allowance" : "borrowAllowance";

  React.useEffect(() => {
    async function fetchBalance() {
      setIsBalanceLoading(true);
      const tokenBalanceCalls: ContractCall[] = [];
      tokenList.forEach((token) => {
        if (erc20 && ethMulticallProvider && token && fromAccount.address) {
          const contract = new MulticallContract(token.address, erc20.interface.fragments as Fragment[]);
          tokenBalanceCalls.push(contract.balanceOf(fromAccount.address));
        }
      });
      const tokenBalances = await ethMulticallProvider?.all([...tokenBalanceCalls]);
      if (tokenBalances) {
        setBalances(
          tokenList.map((t, i) => {
            return { ...t, balance: tokenBalances[i] };
          })
        );
      } else {
        return setBalances([]);
      }
      setIsBalanceLoading(false);
    }
    fetchBalance();

    /**
     * @Todo
     * Casuing infinite re-render when all dependencies are
     * added. Need to be fixed
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethMulticallProvider, fromAccount.address]);

  const fetchAllowance = React.useCallback(async () => {
    setIsAllowanceLoading(true);
    const allowanceContractCalls: ContractCall[] = [];
    tokenList.forEach((token) => {
      const approver = tokenType === TokenType.AToken ? fromAccount.address : toAccount.address;
      if (erc20 && ethMulticallProvider && token && approver) {
        const contract = new MulticallContract(token.address, erc20.interface.fragments as Fragment[]);
        allowanceContractCalls.push(contract[allowanceFuncName](approver, TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan]));
      }
    });
    const allowances = await ethMulticallProvider?.all([...allowanceContractCalls]);
    if (allowances) {
      setAllowances(
        tokenList.map((t, i) => {
          return { ...t, allowance: allowances[i] };
        })
      );
    } else {
      setAllowances([]);
    }
    setIsAllowanceLoading(false);
  }, [tokenList, ethMulticallProvider, tokenType, fromAccount.address, toAccount.address, erc20, allowanceFuncName]);

  React.useEffect(() => {
    fetchAllowance();
  }, [ethMulticallProvider, toAccount, tokenType, fetchAllowance]);

  return {
    isAllowanceLoading,
    allowances,
    isBalanceLoading,
    balances,
    actions: {
      fetchAllowance,
    },
  };
};

export default useTokens;
