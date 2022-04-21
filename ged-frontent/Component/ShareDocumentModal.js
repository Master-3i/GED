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
import { useState } from "react";
import { useMutation } from "react-query";
import CreatableSelect from "react-select/creatable";
import instance from "../axiosConfig";

export default function ShareDocumentModal({ isOpen, onClose, _id }) {
  const [emails, setEmails] = useState([]);
  const [msg, setMsg] = useState("");
  const toast = useToast();

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
    shareDocumentMutation.mutate({ emails: allEmails });
  };

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
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            color="white"
            bg={"purple.300"}
            _hover={{ backgroundColor: "purple.500" }}
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
