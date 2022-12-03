import React from "react";
import { ethers } from "ethers";
import { Box, Flex } from "rebass/styled-components";

import TokenItem from "./TokenItem";
import { AllownaceTokenType, BalanceTokenType } from "hooks/useTokens";
import { increaseByPercent, normalizeBignumber } from "utils/format";

type Props = {
  balance: BalanceTokenType;
  allowance: AllownaceTokenType;
  onClick: (tokenAddress: string, amount: ethers.BigNumber) => void;
};

const ApproveTokenItem = ({ balance, allowance, onClick }: Props) => {
  // console.log(allowance?.allowance?.toString());
  // console.log(balance?.balance?.toString());
  const isDisabled = React.useMemo(() => {
    return parseFloat(allowance?.allowance.toString()) >= parseFloat(balance?.balance?.toString());
  }, [allowance?.allowance, balance?.balance]);
  const handleClick = () => {
    if (isDisabled) return;
    const amountWithBuffer = increaseByPercent(balance.balance, 0.0001); // 0.001 is buffer - workaround
    onClick(balance.address, amountWithBuffer);
  };

  return (
    <Box
      sx={{
        border: `1px solid #262638`,
        borderRadius: "10px",
      }}
      ml={2}
      width={"250px"}
      height={"112px"}
      mt={3}
    >
      <Flex flexDirection={"column"} justifyContent={"flex-end"}>
        <Box px={3} py={2}>
          <TokenItem token={balance?.symbol} balance={Number(normalizeBignumber(balance.balance, balance.decimal)).toFixed(7)} />
        </Box>
        <Box
          onClick={handleClick}
          bg={isDisabled ? "dullFlash" : "flash"}
          fontFamily={"Roboto Mono"}
          color={"white"}
          width={"100%"}
          textAlign={"center"}
          height={"38px"}
          display={"grid"}
          alignContent={"center"}
          fontSize={"12px"}
          sx={{
            transition: `0.5s`,
            borderRadius: `0px 0px 10px 10px`,
            borderTop: `1px solid #262638`,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: isDisabled ? "" : "fadedFlash",
            },
          }}
        >
          {isDisabled ? "Approved" : "Approve"}
        </Box>
      </Flex>
    </Box>
  );
};

export default ApproveTokenItem;
