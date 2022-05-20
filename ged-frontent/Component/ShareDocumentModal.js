import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import CreatableSelect from "react-select/creatable";
import instance from "../axiosConfig";
import Select from "react-select";

export default function ShareDocumentModal({ isOpen, onClose, _id }) {
  const [emails, setEmails] = useState([]);
  const [msg, setMsg] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const toast = useToast();
  const queryClient = useQueryClient();

  const shareDocumentMutation = useMutation(
    async (data) => {
      return await instance.post("/shareDocument/" + _id, data);
    },
    {
      onSuccess: ({ data }) => {
        if (data.noExist.length > 0) {
          let message = "Following Emails : ";
          data.noExist.map((e) => {
            message = message.concat(e, ", ");
          });
          message = message.concat("does not exist");
          toast({
            title: "Warning sharing document",
            description: message,
            status: "warning",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
        }
      },
      onSettled: () => {
        onClose();
      },
    }
  );

  const handleShareDocument = () => {
    const allEmails = emails.map((e) => e.value);
    const allSelectedGroups = selectedGroups.map((e) => e.value);
    shareDocumentMutation.mutate({
      emails: allEmails,
      groups: allSelectedGroups,
    });
  };

  useEffect(() => {
    const filterGroups = [];
    const allGroups = queryClient.getQueryData("groups");
    console.info("Im here", allGroups);
    if (allGroups?.length > 0) {
      console.info("Im here");
      allGroups.map((singleGroup) => {
        console.log("single Group", singleGroup);
        filterGroups.push({
          label: singleGroup.group_name,
          value: singleGroup._id,
        });
      });
      setGroups(filterGroups);
    }
  }, []);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Document</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>User's email</FormLabel>
            <CreatableSelect isMulti onChange={(e) => setEmails(e)} />
          </FormControl>
          <FormControl>
            <FormLabel>Groups</FormLabel>
            <Select
              options={groups}
              isSearchable
              isMulti
              onChange={(e) => setSelectedGroups(e)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            color="white"
            bg={"blue.300"}
            _hover={{ backgroundColor: "blue.500" }}
            onClick={handleShareDocument}
          >
            Share
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
