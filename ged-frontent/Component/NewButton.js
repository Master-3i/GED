import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";

import { AiFillPlusSquare } from "react-icons/ai";



export default function NewButton() {
  return (
    <Menu>
      <MenuButton
        px={4}
        py={2}
        width="full"
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        fontWeight={"bold"}
        color="white"
        bg={"purple.300"}
        _hover={{ backgroundColor: "purple.500" }}
        _expanded={{ bg: "purple.500" }}
        _focus={{ boxShadow: "none" }}
      >
        Create New
      </MenuButton>
      <MenuList>
        <MenuItem>New Folder</MenuItem>
        <MenuDivider />
        <MenuItem>Upload File</MenuItem>
        <MenuDivider />
        <MenuItem>New Group</MenuItem>
      </MenuList>
    </Menu>
  );
}
