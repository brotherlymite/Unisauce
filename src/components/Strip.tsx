import React from "react";
import { Box, Text } from "rebass/styled-components";

type Props = {};

const Strip = (props: Props) => {
  return (
    <Box
      bg={"flash"}
      textAlign={"center"}
      height={40}
      width={"100%"}
      display={"grid"}
      alignContent={"center"}
      justifyContent={"center"}
    >
      <Text fontFamily={"Roboto Mono"} color={"white"} fontSize={12}>
        TranzoFi is currently live on AAVE V2 Polygon Market⚡
      </Text>
    </Box>
  );
};

export default Strip;
