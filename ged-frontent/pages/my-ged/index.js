import { useEffect, useState } from "react";
import SidebarWithHeader from "../../Component/SideBar";
import { getToken } from "../../token";
import { useRouter } from "next/router";
import {
  Box,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
  Text,
  SimpleGrid,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { SidebarContent, MobileNav } from "../../Component/NavBar";
import instance, { setAuthorizationHeader } from "../../axiosConfig";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BsThreeDotsVertical, BsFillShareFill } from "react-icons/bs";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineDownload,
  AiFillEye,
} from "react-icons/ai";
import DocumentMenu from "../../Component/DocumentMenu";

export default function Myged({ token }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = useState();
  const toast = useToast();

  useEffect(() => {
    setUser(getToken().user);
    if (getToken().user == null) {
      router.push("/login");
      return;
    }
  }, []);

  const fetchUserDocuments = async () => {
    const { data } = await instance.get("/userDocuments");
    return data;
  };

  const deleteDocumentMutation = useMutation(
    async () => {
      return await instance.delete("/deleteDocument/" + selectedDocument._id);
    },
    {
      onSuccess: (data, error) => {
        queryClient.invalidateQueries("documents");
        toast({
          title: "Deleted Successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      },
    }
  );


  const fetchGroups = async () => {
    const { data } = await instance.get("/groups");
    return data;
  };

  const { isLoading, isError, data, error } = useQuery(
    "documents",
    fetchUserDocuments,
    { enabled: user != null }
  );

  const { isLoading: groupLoading, data: groupData } = useQuery(
    "groups",
    fetchGroups,
    { enabled: user != null }
  );

  const fetchPackUser = async () => {
    const { data } = await instance.get("/billing/UserPack");
    return data;
  };
  const { isLoading: userPackLoading, data: userPackData } = useQuery(
    "userPack",
    fetchPackUser,
    { enabled: user != null }
  );

  
  const fetchPack = async () => {
    const { data } = await instance.get("/billing/pack");
    return data;
  };
  const { isLoading: packLoading, data: packData } = useQuery(
    "pack",
    fetchPack,
    { enabled: user != null }
  );
  if (user && data) {
    return (
      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <SidebarContent
          onClose={() => onClose}
          display={{ base: "none", md: "block" }}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose}  />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} user={getToken().user} />
        <Box ml={{ base: 0, md: 60 }} p="4">
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
            {queryClient
              .getQueryData("documents")
              .documents.map((singleDocument) => (
                <Box
                  bg={"white"}
                  h="200px"
                  rounded={"md"}
                  boxShadow="md"
                  p={2}
                  key={singleDocument._id}
                >
                  <Box height={"130"}>
                    <Box rounded={"md"} textAlign="center">
                      <HStack justifyContent={"center"}>
                        <Image
                          src={"/"+singleDocument.file.ext + ".png"}
                          h="130px"
                          w="50%"
                        />
                      </HStack>
                    </Box>
                  </Box>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems="center"
                    h={"54"}
                  >
                    <Text fontWeight="semibold" color={"gray.600"}>
                      {singleDocument.file.label}
                    </Text>
                    <DocumentMenu
                      setSelectedDocument={setSelectedDocument}
                      deleteDocumentMutation={deleteDocumentMutation}
                      singleDocument={singleDocument}
                    />
                  </HStack>
                </Box>
              ))}
          </SimpleGrid>
        </Box>
      </Box>
    );
  }
}
