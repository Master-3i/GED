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
import ShareDocumentModal from "./ShareDocumentModal";

export default function DocumentMenu({
  setSelectedDocument,
  singleDocument,
  deleteDocumentMutation,
  isOther,
  isGroup,
  isRemove,
  canRemove,
}) {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const {
    onClose: onCloseShare,
    isOpen: isOpenShare,
    onOpen: onOpenShare,
  } = useDisclosure();

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
        {isRemove && (
          <MenuItem
            icon={<AiFillDelete size={"24px"} />}
            _hover={{ color: "blue.500" }}
            onClick={() => deleteDocumentMutation.mutate()}
            isDisabled={isOther}
          >
            Remove from group
          </MenuItem>
        )}
        {!isRemove && (
          <MenuItem
            icon={<AiFillDelete size={"24px"} />}
            _hover={{ color: "blue.500" }}
            onClick={() => deleteDocumentMutation.mutate()}
            isDisabled={isOther}
          >
            Delete
          </MenuItem>
        )}

        {!isGroup && (
          <MenuItem
            icon={<AiFillEdit size={"24px"} />}
            _hover={{ color: "blue.500" }}
            onClick={onOpen}
            isDisabled={isOther}
          >
            Edit
          </MenuItem>
        )}
        {!isGroup && (
          <MenuItem
            icon={<BsFillShareFill size={"24px"} />}
            _hover={{ color: "blue.500" }}
            onClick={onOpenShare}
            isDisabled={isOther}
          >
            Share
          </MenuItem>
        )}
        <MenuItem
          icon={<AiOutlineDownload size={"24px"} />}
          _hover={{ color: "blue.500" }}
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
      <ShareDocumentModal
        isOpen={isOpenShare}
        onClose={onCloseShare}
        _id={singleDocument._id}
      />
    </Menu>
  );
}
