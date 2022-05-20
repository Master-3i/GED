import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  HStack,
  VStack,
  Spacer,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import instance from "../axiosConfig";
import { getToken } from "../token";
import InviteUserInput from "./InviteUserInput";

export default function UsersModal({ isOpen, onClose, users, group }) {
  const { user } = getToken();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Users</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {user._id == group.group_owner_id && (
            <InviteUserInput group={group} />
          )}

          <VStack w="full">
            {users.map((s) => (
              <UserList user={s} auth={user} group={group} />
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function UserList({ user, auth, group }) {
  const handleRemoveUser = async () => {
    if (group.group_owner_id == auth._id) return;
    try {
      await instance.get(`/group/removeUser/${user._id}/${group._id}`);
      toast({
        status: "success",
        description: `${user.email} removed from group`,
        title: "Removed from group !",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        status: "error",
        title: "Error",
        isClosable: true,
        position: "top",
      });
    }
    instance.get(`/group/removeUser/${user._id}/${group._id}`);
  };
  const toast = useToast();
  return (
    <Box
      p={3}
      m={3}
      borderRadius="md"
      boxShadow={"md"}
      bg="gray.100"
      id={user._id}
      w="full"
    >
      <HStack w="full">
        <Text>{`${user.first_name} ${user.last_name}`}</Text>
        <Tag colorScheme={"blue"}>
          {user._id == group.group_owner_id ? "Group owner" : "Member"}
        </Tag>
        <Spacer />
        {auth._id == group.group_owner_id && (
          <HStack spacing={3} alignSelf={"flex-end"}>
            <Box
              onClick={handleRemoveUser}
              _disabled={user._id == group.group_owner_id}
            >
              <Tooltip
                label={`Remove ${user.first_name} ${user.last_name} from the group`}
              >
                <Icon
                  as={IoIosRemoveCircle}
                  w={4}
                  h={4}
                  id={user._id}
                  _hover={{ cursor: "pointer" }}
                  color="red"
                />
              </Tooltip>
            </Box>
          </HStack>
        )}
      </HStack>
    </Box>
  );
}
