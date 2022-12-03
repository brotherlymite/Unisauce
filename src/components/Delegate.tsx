import { TransactionReceipt } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { CHAIN_ID } from "connector";
import { stableDebtTokenList, variableDebtTokenList } from "constants/tokens";
import { Connection } from "container/connection";
import { TRANZO_CONTRACT_ADDRESS } from "container/contract";
import { Global } from "container/global";
import TokenFetch from "container/token";
import { ethers } from "ethers";
import useApproveDelegationProgress from "hooks/useApproveDelegationProgress";
import useDelegation from "hooks/useDelegation";
import useNotiifcation from "hooks/useNotification";
import useToken from "hooks/useToken";
import useTokens from "hooks/useTokens";
import React from "react";
import { Box, Flex } from "rebass";
import { TokenType } from "types/token.types";
import { truncateAddress } from "utils/address";
import DelegateTokenItem, { TokenWithAllowanceAndBalanceType } from "./DelegateTokenItem";
import Layout from "./primitives/Layout";
import Progress from "./primitives/Progress";

type Props = {};

const Delegate = (props: Props) => {
  const { notify } = useNotiifcation();
  const {
    state: {
      stableDebtTokenBalance: stableDebtTokenBalances,
      stableDebtTokenAllowance: stableDebtTokenAllowances,
      variableDebtTokenBalance: variableDebtTokenBalances,
      variableDebtTokenAllowance: variableDebtTokenAllowances,
    },
    actions: { fetchAllowance },
  } = TokenFetch.useContainer();
  // const {
  //   balances: stableDebtTokenBalances,
  //   allowances: stableDebtTokenAllowances,
  //   actions: { fetchAllowance: fetchStableDebtTokenAllowance },
  // } = useTokens(stableDebtTokenList, TokenType.DebtToken);
  // console.log("stableDebtTokenAllowances", stableDebtTokenAllowances.find((t) => t.symbol === "DAI")?.allowance.toString());
  // const {
  //   balances: variableDebtTokenBalances,
  //   allowances: variableDebtTokenAllownaces,
  //   actions: { fetchAllowance: fetchVariableDebtTokenAllowance },
  // } = useTokens(variableDebtTokenList, TokenType.DebtToken);

  const { delegateTokens } = useDelegation(
    stableDebtTokenBalances,
    stableDebtTokenAllowances,
    variableDebtTokenBalances,
    variableDebtTokenAllowances
  );

  const {
    state: {
      signer: { to: toAccountSigner },
    },
    actions: { setConenctTo },
  } = Global.useContainer();
  const { deactivate } = useWeb3React();
  const { account } = Connection.useContainer();
  const progress = useApproveDelegationProgress(delegateTokens);
  const { approveDelegation } = useToken(TokenType.DebtToken, toAccountSigner?.signer || undefined);
  const doDelegateApprove = React.useCallback(
    async (tokenAddress: string, amount: ethers.BigNumber) => {
      if (account !== toAccountSigner.address) {
        deactivate();
        notify({
          title: "Incorrect Account",
          description: `Please switch to ${truncateAddress(toAccountSigner.address)}`,
        });
        setConenctTo(toAccountSigner.address);
        return;
      }
      const receipt: TransactionReceipt = await approveDelegation(tokenAddress, TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan], amount);
      if (receipt?.transactionHash) {
        await fetchAllowance(stableDebtTokenList, TokenType.StableDebtToken);
        await fetchAllowance(variableDebtTokenList, TokenType.VariableDebtToken);
      }
    },
    [account, approveDelegation, deactivate, fetchAllowance, notify, setConenctTo, toAccountSigner.address]
  );
  return (
    <Layout title={"Approve Delegation"}>
      <Box px={3}>
        <Flex
          p={10}
          justifyContent={"space-between"}
          sx={{
            borderBottom: `1px solid #262638`,
          }}
        >
          <Box width={"97%"}>
            <Progress progress={progress} />
          </Box>
          <Box width={"2%"}>
            <i className="fa fa-info-circle flash" aria-hidden="true"></i>
          </Box>
        </Flex>
        <Box minHeight={"55vh"}>
          <Flex flexWrap={"wrap"}>
            {(delegateTokens || []).map((t: TokenWithAllowanceAndBalanceType) => {
              return (
                <DelegateTokenItem
                  key={t?.address}
                  variableDebtTokenBalance={variableDebtTokenBalances}
                  onClick={doDelegateApprove}
                  token={t}
                />
              );
            })}
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default Delegate;
