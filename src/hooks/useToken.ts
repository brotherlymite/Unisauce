import { truncateAddress } from "utils/address";
import { ethers } from "ethers";

import { Contract } from "container/contract";
import { TokenType } from "./../types/token.types";
import { useContractCall } from "./useContractCall";
import { Transaction } from "../container/Transaction";
import { Connection } from "./../container/connection/index";
import { Global } from "container/global";

function useToken(tokenType: TokenType, overrideSigner?: ethers.Signer) {
  const { executeWithGasLimit } = Transaction.useContainer();
  const {
    state: {
      signer: { to: toAccountSigner },
    },
  } = Global.useContainer();
  const { signer } = Connection.useContainer();
  const { erc20: ERC20Contract, debtToken } = Contract.useContainer();
  const erc20 = tokenType === TokenType.AToken ? ERC20Contract.eth : debtToken;
  const _signer = overrideSigner ? overrideSigner : signer;
  /**
   * Approves a spender to spend
   * @param tokenAddress
   * @param spender
   * @param amount
   */
  const approve = useContractCall(
    async (tokenAddress: string, spender: string, amount: ethers.BigNumber) => {
      const contract = erc20.attach(tokenAddress);
      const receipt = await executeWithGasLimit(contract!.connect(_signer), "approve", [spender, amount]);
      return receipt;
    },
    [executeWithGasLimit, signer, erc20]
  );

  const approveDelegation = useContractCall(
    async (tokenAddress: string, spender: string, amount: ethers.BigNumber) => {
      const currentWalletAddress = await signer.getAddress();
      if (currentWalletAddress !== toAccountSigner.address) {
        alert(`Please switch to ${truncateAddress(toAccountSigner.address)}`);
        return;
      }
      const contract = erc20.attach(tokenAddress);
      const receipt = await executeWithGasLimit(contract!.connect(_signer), "approveDelegation", [spender, amount]);
      return receipt;
    },
    [executeWithGasLimit, signer, erc20]
  );

  return {
    approve,
    approveDelegation,
  };
}

export default useToken;
