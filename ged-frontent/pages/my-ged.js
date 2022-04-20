import { useEffect, useState } from "react";
import SidebarWithHeader from "../Component/SideBar";
import { getToken } from "../token";
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
} from "@chakra-ui/react";
import { SidebarContent, MobileNav } from "../Component/NavBar";
import instance, { setAuthorizationHeader } from "../axiosConfig";
import { useQuery, useQueryClient } from "react-query";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineDownload,
  AiFillEye,
} from "react-icons/ai";

export default function Myged({ token }) {
  console.log(token);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setUser(getToken().user);
    if (getToken().user == null) {
      router.push("/login");
      return;
    }
  }, []);

  console.log("all documents : ", queryClient.getQueryData("documents"));

  const fetchUserDocuments = async () => {
    const { data } = await instance.get("/userDocuments");
    return data;
  };

  const { isLoading, isError, data, error } = useQuery(
    "documents",
    fetchUserDocuments,
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
            <SidebarContent onClose={onClose} />
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
                          src={singleDocument.file.ext+".png"}
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
                    <Menu>
                      <MenuButton>
                        <Icon
                          as={BsThreeDotsVertical}
                          _hover={{ cursor: "pointer" }}
                        />
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          icon={<AiFillDelete size={"24px"} />}
                          _hover={{ color: "purple.300" }}
                        >
                          Delete
                        </MenuItem>
                        <MenuItem
                          icon={<AiFillEdit size={"24px"} />}
                          _hover={{ color: "purple.300" }}
                        >
                          Edit
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
                        >
                          Download
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Box>
              ))}
          </SimpleGrid>
        </Box>
      </Box>
    );
  }
}
