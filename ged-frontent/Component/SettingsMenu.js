import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  MenuDivider,
} from "@chakra-ui/react";
import { AiFillSetting } from "react-icons/ai";
import { getToken } from "../token";
import GroupDeleteConfirmationModal from "./DeleteGroupConfirmation";
import UpdateGroupModal from "./UpdateGroupModal";
import UsersModal from "./UsersModal";

export default function SettingsMenu({ group, users }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenGroup,
    onClose: onCloseGroup,
    onOpen: onOpenGroup,
  } = useDisclosure();
  const {
    isOpen: isOpenGroupDelete,
    onClose: onCloseGroupDelete,
    onOpen: onOpenGroupDelete,
  } = useDisclosure();
  const { user } = getToken();
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<AiFillSetting w={8} h={8} />}
        bg={"gray.200"}
        variant="outline"
      />
      <MenuList>
        <MenuItem onClick={onOpen}>Users</MenuItem>
        {user._id == group.group_owner_id && (
          <MenuItem onClick={onOpenGroup}>Update Group</MenuItem>
        )}
        <MenuDivider />
        {user._id == group.group_owner_id && (
          <MenuItem color={"red"} onClick={onOpenGroupDelete}>
            Delete Group
          </MenuItem>
        )}
      </MenuList>
      <UsersModal
        users={users}
        isOpen={isOpen}
        onClose={onClose}
        group={group}
      />
      <UpdateGroupModal
        isOpen={isOpenGroup}
        onClose={onCloseGroup}
        group={group}
      />
      <GroupDeleteConfirmationModal
        isOpen={isOpenGroupDelete}
        onClose={onCloseGroupDelete}
        group={group}
      />
    </Menu>
  );
}
