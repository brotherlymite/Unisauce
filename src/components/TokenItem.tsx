import React from "react";
import { Flex, Box, Text, Image } from "rebass";

type Props = {
  token: string;
  balance: string;
};

const TokenItem = ({ token, balance }: Props) => {
  return (
    <Flex my={2}>
      <Image
        width={38}
        height={38}
        sx={{
          border: `3px solid`,
          borderColor: "#17CEB9",
          borderRadius: "100%",
          opacity: 0.9,
        }}
        mr={9}
        src={`/icons/tokens/${token.toLocaleLowerCase()}.svg`}
        alt={token}
      />
      <Box mt={1}>
        <Text fontFamily={"Roboto"} color={"lightGrey"}>
          {token}
        </Text>
        <Text fontFamily={"Roboto Mono"} fontSize={"12px"} color={"grey"}>
          {balance}
        </Text>
      </Box>
    </Flex>
  );
};

export default TokenItem;
