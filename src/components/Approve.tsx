import { TransactionReceipt } from "@ethersproject/providers";
import { CHAIN_ID } from "connector";
import { aTokenList } from "constants/tokens";
import { Connection } from "container/connection";
import { TRANZO_CONTRACT_ADDRESS } from "container/contract";
import { Global } from "container/global";
import TokenFetch from "container/token";
import { ethers } from "ethers";
import useApproveProgress from "hooks/useApproveProgress";
import useToken from "hooks/useToken";
import { AllownaceTokenType } from "hooks/useTokens";
import React from "react";
import { Box, Flex } from "rebass/styled-components";
import { TokenType } from "../types/token.types";
import ApproveTokenItem from "./ApproveTokenItem";
import Layout from "./primitives/Layout";

type Props = {};

const Progress = ({ progress }: { progress: number }) => {
  return (
    <Box
      bg={"flash"}
      width={`${progress * 100}%`}
      height={14}
      mt={1}
      sx={{
        borderRadius: "10px",
      }}
    ></Box>
  );
};

const Approve = (props: Props) => {
  const { account } = Connection.useContainer();
  const {
    state: {
      signer: { from: fromSigner },
    },
  } = Global.useContainer();

  const {
    state: { aTokenBalance: aTokenBalances, aTokenAllowanace: aTokenAllowances },
    actions: { fetchAllowance },
  } = TokenFetch.useContainer();
  const progress = useApproveProgress(aTokenAllowances, aTokenBalances);
  const { approve } = useToken(TokenType.AToken, fromSigner?.signer || undefined); // fromSigner is signer of wallet from where positions to be moved from

  const doApprove = React.useCallback(
    async (tokenAddress: string, amount: ethers.BigNumber) => {
      const receipt: TransactionReceipt = await approve(tokenAddress, TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan], amount);
      if (receipt && receipt?.transactionHash) {
        fetchAllowance(aTokenList, TokenType.AToken); // refresh allownaces
      }
    },
    [approve, fetchAllowance]
  );

  const approveTokens = React.useMemo(() => {
    return (
      account &&
      aTokenBalances
        .filter((t) => t.balance.toString() !== "0")
        .map((token, i) => (
          <ApproveTokenItem
            key={token.address}
            onClick={doApprove}
            balance={token}
            allowance={aTokenAllowances?.find((t) => t.symbol === token.symbol) as AllownaceTokenType}
          />
        ))
    );
  }, [aTokenBalances, aTokenAllowances, doApprove, account]);

  return (
    <Layout title={"Approve aTokens"}>
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
          <Flex flexWrap={"wrap"}>{approveTokens}</Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default Approve;
