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
import { useRouter } from "next/router";
import { useRef } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import { useMutation, useQueryClient } from "react-query";
import instance from "../axiosConfig";
import { getToken } from "../token";
import InviteUserInput from "./InviteUserInput";

export default function GroupDeleteConfirmationModal({
  isOpen,
  onClose,
  users,
  group,
}) {
  const { user } = getToken();
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const deleteGroupMutation = useMutation(
    async () => {
      return await instance.delete(`/group/destroy/${group._id}`);
    },
    {
      onSuccess: () => {
        toast({
          status: "success",
          description: `Group deleted Successfully`,
          title: "Group deleted !",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries("groups");
        router.push("/my-ged");
      },
      onError: () => {
        toast({
          status: "error",
          title: "Error",
          isClosable: true,
          position: "top",
        });
      },
      onSettled: () => onClose(),
    }
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure? You can't undo this action afterwards.</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} fontWeight="bold" mr={3}>
            Close
          </Button>
          <Button
            colorScheme={"red"}
            fontWeight="bold"
            onClick={deleteGroupMutation.mutate}
          >
            Delete{" "}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
