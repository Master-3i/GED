import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
} from "@chakra-ui/react";

import { AiFillPlusSquare } from "react-icons/ai";
import DocumentModal from "./DocumentModal";

export default function NewButton() {
  const {
    isOpen: newDocumentIsOpen,
    onClose: newDocumentOnClose,
    onOpen: newDocumentOnOpen,
  } = useDisclosure();
  const {
    isOpen: newGroupIsOpen,
    onClose: newGroupOnClose,
    onOpen: newGroupOnOpen,
  } = useDisclosure();
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
        <MenuItem onClick={() => newDocumentOnOpen()}>Upload File</MenuItem>
        <MenuDivider />
        <MenuItem>New Group</MenuItem>
      </MenuList>
      <DocumentModal
        isOpen={newDocumentIsOpen}
        onClose={newDocumentOnClose}
        onOpen={newDocumentOnOpen}
      />
    </Menu>
  );
}
