import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import instance from "../axiosConfig";

export default function GroupModal({
  isOpen,
  onOpen,
  onClose,
  isUpdate,
  document,
}) {
  const [emails, setEmails] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const queryClient = useQueryClient();

  const createGroupMutation = useMutation(
    async ({ group_name, users }) => {
      const { data } = await instance.post("/group/store", {
        group_name: group_name,
        users: users,
      });
      return data;
    },
    {
      onSuccess: ({ data: createGroupData }) => {
        queryClient.invalidateQueries("groups");
        toast({
          title: "Created Successfully !",
          status: "success",
          position: "top",
          isClosable: true,
          duration: 4000,
        });
      },
      onError: (t) => {
        toast({
          title: "Error Creating Group !",
          description: t.response.data,
          status: "error",
          position: "top",
          isClosable: true,
          duration: 4000,
        });
      },
      onSettled: () => {
        reset();
        onClose();
      },
    }
  );
  const createGroup = (data) => {
    const allEmails = [];
    emails.map((singleKeyword) => allEmails.push(singleKeyword.value));
    createGroupMutation.mutate({
      group_name: data.group_name,
      users: allEmails,
    });
  };

  const updateGroup = (data) => {
    const newKeywords = keywords.map((s) => s.value);
    data.keywords = newKeywords;
    console.log("this is update", newKeywords);
    updateDocumentMutation.mutate(data);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            id="documentForm"
            onSubmit={handleSubmit(isUpdate ? updateGroup : createGroup)}
          >
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>Group Name</FormLabel>
                <Input type={"text"} {...register("group_name")} />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Invite Users ( emails )</FormLabel>
                <CreatableSelect
                  isMulti
                  onChange={(e) => setEmails(e)}
                  defaultValue={isUpdate ? keywords : null}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                color="white"
                bg={"blue.400"}
                _hover={{ backgroundColor: "blue.500" }}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
