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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";

export default function DocumentModal({ isOpen, onOpen, onClose }) {
  const [keywords, setKeywords] = useState([]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Keywords</FormLabel>
              <CreatableSelect isMulti onChange={(e) => console.log(e)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>File</FormLabel>
              <Input type={"file"} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              color="white"
              bg={"purple.300"}
              _hover={{ backgroundColor: "purple.500" }}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
