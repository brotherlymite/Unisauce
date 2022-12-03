import React from "react";
import { Box, Flex, Text } from "rebass/styled-components";
import Layout from "./primitives/Layout";
import TokenItem from "./TokenItem";
import { increaseByPercent, normalizeBignumber } from "utils/format";
import { Connection } from "container/connection";
import WalletConnectButton from "./wallet/WalletConnectButton";
import TokenFetch from "container/token";
import AppButton from "./primitives/Button";

type Props = {
  isReview: boolean;
};

const PositionTable = ({ isReview = false }: Props) => {
  const { account } = Connection.useContainer();
  const {
    state: {
      aTokenBalance: aTokenBalances,
      stableDebtTokenBalance: stableDebtTokenBalances,
      variableDebtTokenBalance: variableDebtTokenBalances,
    },
  } = TokenFetch.useContainer();

  const aTokenListBalance = React.useMemo(() => {
    return aTokenBalances
      ?.filter((t) => t?.balance?.toString() !== "0")
      .map(
        (token) =>
          token.balance && (
            <TokenItem
              key={token.address}
              token={token.symbol}
              balance={normalizeBignumber(token.balance, token.decimal).slice(0, 9)}
            />
          )
      );
  }, [aTokenBalances]);

  const stableDebtTokenListBalance = React.useMemo(() => {
    return stableDebtTokenBalances
      ?.filter((t) => t?.balance?.toString() !== "0")
      .map(
        (token) =>
          token.balance && (
            <TokenItem
              key={token.address}
              token={token.symbol}
              balance={normalizeBignumber(
                isReview ? increaseByPercent(token.balance, 0.0009) : token.balance,
                token.decimal
              ).slice(0, 9)}
            />
          )
      );
  }, [isReview, stableDebtTokenBalances]);

  const varableDebtTokenListBalance = React.useMemo(() => {
    return variableDebtTokenBalances
      ?.filter((t) => t?.balance?.toString() !== "0")
      .map(
        (token) =>
          token.balance && (
            <TokenItem
              key={token.address}
              token={token.symbol}
              balance={normalizeBignumber(
                isReview ? increaseByPercent(token.balance, 0.0009) : token.balance,
                token.decimal
              ).slice(0, 9)}
            />
          )
      );
  }, [isReview, variableDebtTokenBalances]);
  // console.log(aTokenBalances);
  return (
    <>
      <Layout title={isReview ? "Review Position Transfer" : "Your Positions"}>
        <>
          {!account && !isReview ? (
            <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={520}>
              <Box
                width={400}
                sx={{
                  borderRadius: 10,
                }}
              >
                <Flex
                  padding={10}
                  backgroundColor={"#2d2d2f"}
                  height={60}
                  alignItems={"center"}
                  mb={2}
                  sx={{
                    borderRadius: 10,
                    borderTop: "4px solid",
                    borderColor: "flash",
                  }}
                >
                  <i className="fa fa-info-circle flash" aria-hidden="true"></i>
                  <Text fontFamily={"Roboto Mono"} color="flash" ml={2}>
                    Please connect your wallet
                  </Text>
                </Flex>

                <WalletConnectButton width={"100%" as string} />
              </Box>
            </Flex>
          ) : aTokenBalances.filter((t) => t?.balance?.toString() !== "0").length === 0 ? (
            <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={520}>
              <Box
                width={400}
                sx={{
                  borderRadius: 10,
                }}
              >
                <Flex
                  padding={10}
                  backgroundColor={"#2d2d2f"}
                  height={60}
                  alignItems={"center"}
                  mb={2}
                  sx={{
                    borderRadius: 10,
                    borderTop: "4px solid",
                    borderColor: "flash",
                  }}
                >
                  <i className="fa fa-info-circle flash" aria-hidden="true"></i>
                  <Text fontFamily={"Roboto Mono"} color="flash" ml={2}>
                    You don't have any positions on Aave
                  </Text>
                </Flex>
                <AppButton
                  style={{
                    width: "100%",
                    height: "50px",
                  }}
                  label="Visit Aave"
                  onPress={() => {
                    window.open("https://app.aave.com/");
                  }}
                />
              </Box>
            </Flex>
          ) : (
            <Flex p={10} height={"auto"}>
              {/* Deposit Column */}
              <Box width={1 / 3}>
                <Box
                  sx={{
                    borderBottom: `1px solid #262638`,
                  }}
                >
                  <Text color={"grey"} fontFamily={"Roboto Mono"} textAlign={"center"} p={`10px 0px 15px 0px`}>
                    Deposits
                  </Text>
                </Box>
                {/* Deposit Token List */}
                <Box
                  flexDirection={"column"}
                  display={"flex"}
                  my={2}
                  alignItems={"center"}
                  sx={{
                    height: "50vh",
                    borderRight: `1px solid #262638`,
                  }}
                >
                  {aTokenListBalance}
                </Box>
              </Box>
              {/* Debt Column */}
              {/* Stable Debt Column */}
              <Box width={1 / 3}>
                <Box
                  sx={{
                    borderBottom: `1px solid #262638`,
                  }}
                >
                  <Text color={"grey"} fontFamily={"Roboto Mono"} textAlign={"center"} p={`10px 0px 15px 0px`}>
                    Stable Debts
                  </Text>
                </Box>
                <Box
                  flexDirection={"column"}
                  display={"flex"}
                  my={2}
                  alignItems={"center"}
                  sx={{
                    height: "50vh",
                    borderRight: `1px solid #262638`,
                  }}
                >
                  {stableDebtTokenListBalance}
                </Box>
              </Box>
              {/* Variable Debt Column */}
              <Box width={1 / 3}>
                <Box
                  sx={{
                    borderBottom: `1px solid #262638`,
                  }}
                >
                  <Text color={"grey"} fontFamily={"Roboto Mono"} textAlign={"center"} p={`10px 0px 15px 0px`}>
                    Variable Debts
                  </Text>
                </Box>
                <Box
                  flexDirection={"column"}
                  display={"flex"}
                  my={2}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {varableDebtTokenListBalance}
                </Box>
              </Box>
            </Flex>
          )}
        </>
      </Layout>
    </>
  );
};

export default PositionTable;
