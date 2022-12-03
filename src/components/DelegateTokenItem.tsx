import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { BalanceTokenType } from "hooks/useTokens";
import React from "react";
import { Box, Flex, Text } from "rebass/styled-components";
import { increaseByPercent, normalizeBignumber } from "utils/format";
import TokenItem from "./TokenItem";

export interface TokenWithAllowanceAndBalanceType extends BalanceTokenType {
  allowance: number;
  type: "stable" | "variable";
}

type Props = {
  token: TokenWithAllowanceAndBalanceType;
  onClick: (tokenAddress: string, amount: ethers.BigNumber) => void;
  variableDebtTokenBalance: BalanceTokenType[];
};

const DelegateTokenItem = ({ token, onClick, variableDebtTokenBalance }: Props) => {
  const isDisabled = React.useMemo(() => {
    return parseFloat(token?.allowance?.toString()) >= parseFloat(token?.balance?.toString());
  }, [token?.allowance, token?.balance]);
  const handleClick = () => {
    let amountWithBuffer = token.balance;
    if (isDisabled) return;
    const variableDebtForSameToken = variableDebtTokenBalance.find((t) => t.symbol === token.symbol);
    // to handle buffer when variable debt token is available for same stable debt token
    if (token.type === "stable" && variableDebtForSameToken && parseFloat(variableDebtForSameToken?.balance?.toString()) > 0) {
      let _amountWithBuffer = new BigNumber(amountWithBuffer.toString());
      const amountInBN = new BigNumber(variableDebtForSameToken?.balance?.toString());
      _amountWithBuffer = _amountWithBuffer.plus(amountInBN?.multipliedBy(new BigNumber(0.0015)));
      amountWithBuffer = ethers.BigNumber.from(_amountWithBuffer.toFixed(0));
    }
    amountWithBuffer = increaseByPercent(amountWithBuffer, 0.0015); // buffer 0.1% workaround
    // console.log(amountWithBuffer.toString());
    onClick(token.address, amountWithBuffer);
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
        <Flex>
          <Box width={"80%"} px={3} py={2}>
            <TokenItem token={token?.symbol} balance={Number(normalizeBignumber(token?.balance, token.decimal)).toFixed(7)} />
          </Box>
          <Box width={"50%"} display={"flex"} justifyContent="flex-end">
            <Text
              fontFamily={"Roboto Mono"}
              color={"white"}
              bg={"flash"}
              fontSize={10}
              height={"fit-content"}
              padding={1}
              margin={2}
              px={1}
              sx={{
                borderRadius: 5,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {token?.type.charAt(0).toUpperCase() + token?.type.slice(1)} Debt
            </Text>
          </Box>
        </Flex>
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
          {isDisabled ? "Delegated" : "Delegate"}
        </Box>
      </Flex>
    </Box>
  );
};

export default DelegateTokenItem;
