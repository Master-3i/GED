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
import { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import instance from "../axiosConfig";

export default function DocumentModal({
  isOpen,
  onOpen,
  onClose,
  isUpdate,
  document,
}) {
  const [keywords, setKeywords] = useState([]);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      description: isUpdate ? document.file?.description : "",
      label: isUpdate ? document.file.label : "",
    },
  });
  useEffect(() => {
    if (isUpdate) {
      if (document?.keywords?.length > 0) {
        const newArray = [];
        document?.keywords.map((s) => {
          newArray.push({ label: s, value: s });
        });
        setKeywords(newArray);
      }
    }
  }, []);

  const [file, setFile] = useState();
  const queryClient = useQueryClient();

  const uplaodDocumentMutation = useMutation(
    async (data) => {
      return await instance.post("/uploadDocument", data);
    },
    {
      onSuccess: ({ data: responseData }) => {
        queryClient.invalidateQueries("documents");
      },
    }
  );

  const updateDocumentMutation = useMutation(
    async (data) => {
      return await instance.put("/updateDocument/" + document._id, data);
    },
    {
      onSuccess: ({ data: updatedData }) => {
        console.log("updated adata", updatedData);
        queryClient.setQueryData(
          ["documents", { _id: updatedData._id }],
          updatedData
        );
        return updatedData;
      },
      onSettled: (updatedData) => {
        queryClient.invalidateQueries("documents");
      },
    }
  );

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

  const uploadDocumentUpdate = (data) => {
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
            onSubmit={handleSubmit(
              isUpdate ? uploadDocumentUpdate : uploadDocument
            )}
          >
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {isUpdate && (
                <FormControl mt={4}>
                  <FormLabel>File Name</FormLabel>
                  <Input type={"text"} {...register("label")} />
                </FormControl>
              )}

              <FormControl mt={4}>
                <FormLabel>Keywords</FormLabel>
                <CreatableSelect
                  isMulti
                  onChange={(e) => setKeywords(e)}
                  defaultValue={isUpdate ? keywords : null}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea {...register("description")} />
              </FormControl>
              {!isUpdate && (
                <FormControl mt={4}>
                  <FormLabel>File</FormLabel>
                  <Input
                    type={"file"}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </FormControl>
              )}
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
