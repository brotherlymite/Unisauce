import React from "react";
import { Text } from "rebass/styled-components";

type Props = {
  label: string;
  onClick?: () => void;
};

const MenuItem = ({ label, onClick }: Props) => {
  return (
    <Text
      onClick={onClick}
      fontFamily={"Roboto Mono"}
      my={10}
      color={"grey"}
      sx={{
        transition: "0.4s",
        "&:hover": {
          cursor: "pointer",
          color: "#bbbbbb",
        },
      }}
    >
      {label}
    </Text>
  );
};

export default MenuItem;
