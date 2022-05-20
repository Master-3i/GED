import { useEffect, useState } from "react";
import { getToken } from "../../../token";
import { useRouter } from "next/router";
import axios from "axios";
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
  FormControl,
  FormLabel,
  Flex,
  Input,
  Wrap,
  WrapItem,
  Avatar,
  Badge,
  Button,
  Heading,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { SidebarContent, MobileNav } from "../../../Component/NavBar";
import instance, { setAuthorizationHeader } from "../../../axiosConfig";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BsThreeDotsVertical, BsFillShareFill } from "react-icons/bs";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineDownload,
  AiFillEye,
  AiOutlineSetting,
} from "react-icons/ai";
import DocumentMenu from "../../../Component/DocumentMenu";
import TabSelect from "../../../Component/TabSelect";
import { useForm } from "react-hook-form";
import SettingsMenu from "../../../Component/SettingsMenu";

export default function Group({ id, groupDocuments, group, users }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedDocument, setSelectedDocument] = useState();

  useEffect(() => {
    setUser(getToken().user);
    queryClient.setQueryData("groupDocuments", groupDocuments);
    if (getToken().user == null) {
      router.push("/login");
      return;
    }
  }, []);

  const handleDeleteMutation = useMutation(async () => {
    await instance.get("/document/removefromgroup/" + id);
  });

  // const { isLoading: userPackLoading, data: userPackData } = useQuery(
  //   "userPack",
  //   fetchPackUser,
  //   { enabled: user != null }
  // );

  // const fetchPackUser = async () => {
  //   const { data } = await instance.get("/billing/UserPack");
  //   return data;
  // };
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

  

  if (user) {
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
          <Box>
            <Flex dir="row" justifyContent={"space-between"} mt={3} mb={3}>
              <Heading color={"gray.500"}>{group.group_name}</Heading>
              <SettingsMenu group={group} users={users} />
            </Flex>
          </Box>
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
            {groupDocuments.map((singleDocument) => (
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
                        src={singleDocument.file.ext + ".png"}
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
                    deleteDocumentMutation={handleDeleteMutation}
                    singleDocument={singleDocument}
                    isGroup={true}
                    canRemove={
                      user._id == singleDocument.user_id ||
                      user._id == group.group_owner_id
                    }
                    isRemove={true}
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

export async function getServerSideProps(ctx) {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/group/" + ctx.query.id,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + ctx.req.cookies.gid,
        },
      }
    );
    console.log(data);
    return {
      props: {
        id: ctx.query.id,
        groupDocuments: data.groupDocuments,
        group: data.group,
        users: data.users,
      },
    };
  } catch (err) {
    return {
      props: {
        id: ctx.query.id,
      },
    };
  }
}
