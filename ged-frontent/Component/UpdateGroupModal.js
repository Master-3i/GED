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
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import instance from "../axiosConfig";

import { getToken } from "../token";

export default function UpdateGroupModal({ isOpen, onClose, group }) {
  const { user } = getToken();
  const queryClient = useQueryClient();
  const [name, setName] = useState(group.group_name ? group.group_name : "");
  const toast = useToast();
  const updateGroupNameMutation = useMutation(
    async (name) => {
      const { data } = await instance.post(
        "/group/updateGroupName/" + group._id,
        {
          name: name,
        }
      );
    },
    {
      onSuccess: () => {
        console.log("Im here");
        toast({
          status: "success",
          description: "Group name updated successfully",
          title: "Updated ! ",
          isClosable: true,
          duration: 4000,
          position: "top",
        });
        queryClient.invalidateQueries("groups");
      },
      onSettled: () => {
        onClose();
      },
    }
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Users</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type={"text"}
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            mb={3}
          />
          <br />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Close
          </Button>
          <Button onClick={() => updateGroupNameMutation.mutate(name)}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
