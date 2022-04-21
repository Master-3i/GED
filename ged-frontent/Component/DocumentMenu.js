import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";

import { BsThreeDotsVertical, BsFillShareFill } from "react-icons/bs";
import {
  AiFillEye,
  AiFillDelete,
  AiFillEdit,
  AiOutlineDownload,
} from "react-icons/ai";
import DocumentModal from "./DocumentModal";
import instance from "../axiosConfig";

export default function DocumentMenu({
  setSelectedDocument,
  singleDocument,
  deleteDocumentMutation,
}) {
  const { onClose, onOpen, isOpen } = useDisclosure();

  const handleDownloadDocument = async () => {
    const { data } = await instance.get(
      "/downloadDocument/" + singleDocument._id,
      { responseType: "blob" }
    );
    if (data) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", singleDocument.file.label);
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <Menu
      onOpen={() => {
        setSelectedDocument(singleDocument);
      }}
      onClose={() => setSelectedDocument(null)}
    >
      <MenuButton>
        <Icon as={BsThreeDotsVertical} _hover={{ cursor: "pointer" }} />
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<AiFillDelete size={"24px"} />}
          _hover={{ color: "purple.300" }}
          onClick={() => deleteDocumentMutation.mutate()}
        >
          Delete
        </MenuItem>
        <MenuItem
          icon={<AiFillEdit size={"24px"} />}
          _hover={{ color: "purple.300" }}
          onClick={onOpen}
        >
          Edit
        </MenuItem>
        <MenuItem
          icon={<BsFillShareFill size={"24px"} />}
          _hover={{ color: "purple.300" }}
        >
          Share
        </MenuItem>
        <MenuItem
          icon={<AiFillEye size={"24px"} />}
          _hover={{ color: "purple.300" }}
        >
          Preview
        </MenuItem>
        <MenuItem
          icon={<AiOutlineDownload size={"24px"} />}
          _hover={{ color: "purple.300" }}
          onClick={() => handleDownloadDocument()}
        >
          Download
        </MenuItem>
      </MenuList>
      <DocumentModal
        isUpdate={true}
        document={singleDocument}
        onClose={onClose}
        isOpen={isOpen}
        onOpen={onClose}
      />
    </Menu>
  );
}
