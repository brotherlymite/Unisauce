import Avatar from "boring-avatars";
import React from "react";
import { Box, Flex, Text } from "rebass/styled-components";

import { User } from "../../container/user";
import useOutsideAlerter from "../../hooks/useClickOutsideAlert";
import { truncateAddress } from "../../utils/address";
import MenuItem from "../../components/Menu/MenuItem";
import MenuOverlay from "../../components/Menu/MenuOverlay";
import ButtonArrow from "../primitives/ButtonArrow";

type Props = {};

const AccountStatus = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const {
    state: { address },
    actions: { logout },
  } = User.useContainer();

  const onToggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const onMenuClose = () => {
    setIsMenuOpen(false);
  };
  useOutsideAlerter(menuRef, () => {
    if (isMenuOpen) onMenuClose();
  });

  const copyToClipboard = (content: any) => {
    const el = document.createElement("textarea");
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  return (
    <Flex flexDirection={"column"}>
      <div ref={menuRef}>
        <Flex
          onClick={onToggleMenu}
          backgroundColor={"fadedDark"}
          height={"auto"}
          padding={10}
          paddingX={15}
          sx={{
            borderRadius: 15,
            border: `1px solid #262638`,
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Avatar size={25} name={address} variant="sunset" colors={["#d24065", "#ff3779", "#834665", "#4a4a5c", "#e775a7"]} />
          <Text alignSelf={"center"} ml={2}>
            {truncateAddress(address)}
          </Text>
          <Box alignSelf={"center"} ml={2}>
            <ButtonArrow isOpen={isMenuOpen} />
          </Box>
        </Flex>
        <MenuOverlay isOpen={isMenuOpen}>
          <>
            <MenuItem
              label="Copy Address"
              onClick={() => {
                // console.log("clicked");
                copyToClipboard(address);
              }}
            />

            <MenuItem
              label="Open In Etherscan"
              onClick={() => {
                window.open(`https://mumbai.polygonscan.com/address/${address}`);
              }}
            />
            <Text
              mt={3}
              onClick={logout}
              fontFamily={"Roboto Mono"}
              color={"flash"}
              sx={{
                border: "1px solid",
                borderColor: "flash",
                padding: 10,
                borderRadius: 10,
                textAlign: "center",
                transition: "0.4s",
                "&:hover": {
                  cursor: "pointer",
                  color: "fadedGrey",
                  borderColor: "fadedGrey",
                },
              }}
            >
              Disconnect
            </Text>
          </>
        </MenuOverlay>
      </div>
    </Flex>
  );
};

export default AccountStatus;
