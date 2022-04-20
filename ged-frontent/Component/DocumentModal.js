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
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import instance from "../axiosConfig";

export default function DocumentModal({ isOpen, onOpen, onClose }) {
  const [keywords, setKeywords] = useState([]);
  const { register, handleSubmit } = useForm();
  const [file, setFile] = useState();

  const uplaodDocumentMutation = useMutation(async (data) => {
    return await instance.post("/uploadDocument", data);
  });

  const uploadDocument = (data) => {
    if (file == null) return;
    const allKeywords = [];
    keywords.map((singleKeyword) => allKeywords.push(singleKeyword.value));
    const formData = new FormData();

    formData.append("document", file);
    formData.append(
      "info",
      JSON.stringify({
        label: file.name,
        description: data.description,
      })
    );
    formData.append("keywords", allKeywords);
    uplaodDocumentMutation.mutate(formData);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form id="documentForm" onSubmit={handleSubmit(uploadDocument)}>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>Keywords</FormLabel>
                <CreatableSelect isMulti onChange={(e) => setKeywords(e)} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea {...register("description")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>File</FormLabel>
                <Input
                  type={"file"}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                color="white"
                bg={"purple.300"}
                _hover={{ backgroundColor: "purple.500" }}
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
