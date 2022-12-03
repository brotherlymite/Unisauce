import Avatar from "boring-avatars";
import { Flex, Box, Text } from "rebass/styled-components";
import { truncateAddress } from "utils/address";

type Props = {
  address: string;
  size?: number;
};

const AccountAvatar = ({ address, size = 50 }: Props) => {
  return (
    <Flex flexDirection={"column"}>
      <Avatar size={size} name={address} variant="sunset" colors={["#d24065", "#ff3779", "#834665", "#4a4a5c", "#e775a7"]} />
      <Box
        bg={"flash"}
        width={"fit-content"}
        textAlign="center"
        fontFamily={"Roboto Mono"}
        color={"white"}
        p={1}
        px={10}
        ml={0}
        mt={3}
        sx={{
          border: "2px solid #76e3d5",
          borderRadius: "10px",
        }}
      >
        {truncateAddress(address)}
      </Box>
      <Text fontFamily={"Roboto Mono"} textAlign="center" mt={1} color={"flash"}>
        Connected
      </Text>
    </Flex>
  );
};

export default AccountAvatar;
