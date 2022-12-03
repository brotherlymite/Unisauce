import Avatar from "boring-avatars";
import { Global } from "container/global";
import { Text, Box, Flex } from "rebass/styled-components";
import { truncateAddress } from "utils/address";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const Layout = ({ title, children }: Props) => {
  const {
    state: {
      signer: { from: fromAccount, to: toAccount },
    },
  } = Global.useContainer();

  return (
    <Box
      sx={{
        "@media screen and (max-width: 40em)": {
          display: "none",
        },
      }}
    >
      <Flex width={"80%"} margin={"auto"} justifyContent={"space-between"}>
        <Text fontFamily={"secondary"} mt={30} fontSize={3} fontWeight="body" color="fadedFlash">
          {title}
        </Text>
        {fromAccount.address && toAccount.address && (
          <Box mt={3} mb={-2}>
            <Flex
              width={"100%"}
              height={"auto"}
              padding={10}
              paddingX={15}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Avatar
                size={25}
                name={fromAccount.address}
                variant="sunset"
                colors={["#d24065", "#ff3779", "#834665", "#4a4a5c", "#e775a7"]}
              />{" "}
              <Text alignSelf={"center"} color={"flash"} fontFamily={"Roboto Mono"} ml={2}>
                {truncateAddress(fromAccount.address)}
              </Text>
              <Box
                width={20}
                mx={2}
                mt={0.9}
                display={"grid"}
                alignContent={"center"}
                justifyContent={"center"}
                height={20}
                mr={2}
                sx={{
                  borderRadius: "100%",
                }}
                bg={"grey"}
              >
                <i className="fas fa-arrow-right grey small"></i>
              </Box>
              <Avatar
                size={25}
                name={toAccount.address}
                variant="sunset"
                colors={["#d24065", "#ff3779", "#834665", "#4a4a5c", "#e775a7"]}
              />
              <Text color={"flash"} fontFamily={"Roboto Mono"} alignSelf={"center"} ml={2}>
                {truncateAddress(toAccount.address)}
              </Text>
            </Flex>
          </Box>
        )}
      </Flex>
      <Box
        margin={"auto"}
        width={"80%"}
        height={"auto"}
        bg={"fadedDark"}
        mt={10}
        sx={{
          borderRadius: 8,
          border: `1px solid #262638`,
        }}
      >
        {children && children}
      </Box>
    </Box>
  );
};

export default Layout;
