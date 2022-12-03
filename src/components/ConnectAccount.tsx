import { Box, Flex } from "rebass/styled-components";
import Avatar from "boring-avatars";
import { truncateAddress } from "utils/address";

type Props = {
  from: string;
  to: string;
};

const ConnectAccount = ({ from, to }: Props) => {
  const AccountAvatar = (accountAddress: string) => {
    return (
      <Flex flexDirection={"column"}>
        <Avatar
          size={80}
          name={accountAddress}
          variant="sunset"
          colors={["#d24065", "#ff3779", "#834665", "#4a4a5c", "#e775a7"]}
        />
        <Box
          bg={"flash"}
          ml={-2}
          width={"fix-content"}
          textAlign="center"
          fontSize={12}
          fontFamily={"Roboto Mono"}
          color={"white"}
          p={1}
          px={1}
          mt={3}
          sx={{
            border: "2px solid #76e3d5",
            borderRadius: "10px",
          }}
        >
          {truncateAddress(accountAddress)}
        </Box>
      </Flex>
    );
  };

  return (
    <>
      <Box
        minHeight={"auto"}
        width={"80%"}
        margin={"auto"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        mt={4}
      >
        <Flex>
          <>
            {AccountAvatar(from)}
            <Box
              width={40}
              display={"grid"}
              alignContent={"center"}
              justifyContent={"center"}
              height={40}
              mt={40}
              ml={20}
              mr={30}
              sx={{
                borderRadius: "100%",
              }}
              bg={"grey"}
            >
              <i className="fas fa-arrow-right grey"></i>
            </Box>
            {AccountAvatar(to)}
            {/* <Flex justifyContent={"center"} flexDirection={"column"}>
              <Box
                width={140}
                height={140}
                sx={{
                  border: `2px dashed #544f8e`,
                  borderRadius: "100%",
                }}
                display={"grid"}
                justifyContent={"center"}
                alignContent={"center"}
                bg={"#35325a"}
                ml={20}
              >
                <Image opacity={0.15} mb={2} src={Wallet} width={"80px"} height={"auto"} />
              </Box>
              <AppButton
                style={{
                  marginRight: "-10px",
                  marginTop: "15px",
                  padding: "15px 0px 15px 0px",
                }}
                label={"Connect Account"}
                onPress={() => {}}
              />
            </Flex> */}
          </>
        </Flex>
        {/* <Image
          opacity={0.5}
          mb={2}
          src={Wallet}
          width={"200px"}
          height={"auto"}
        />
        <Text
          fontWeight={"body"}
          mb={3}
          color={"fadedFlash"}
          fontFamily={"Roboto Mono"}
        >
          {"Connect to the account you want to move your positions to".toUpperCase()}
        </Text>
        <AppButton label="Connect Account" onPress={() => console.log("hey")} /> */}
      </Box>
    </>
  );
};

export default ConnectAccount;
