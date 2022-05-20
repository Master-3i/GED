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
import GroupModal from "./GroupModal";

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
        bg={"blue.400"}
        _hover={{ backgroundColor: "blue.500" }}
        _expanded={{ bg: "blue.500" }}
        _focus={{ boxShadow: "none" }}
      >
        Create New
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => newDocumentOnOpen()}>Upload File</MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => newGroupOnOpen()}>New Group</MenuItem>
      </MenuList>
      <DocumentModal
        isOpen={newDocumentIsOpen}
        onClose={newDocumentOnClose}
        onOpen={newDocumentOnOpen}
      />
      <GroupModal
        onClose={newGroupOnClose}
        isOpen={newGroupIsOpen}
        onOpen={newGroupOnOpen}
      />
    </Menu>
  );
}
