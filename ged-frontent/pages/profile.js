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
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { SidebarContent, MobileNav } from "../Component/NavBar";
import instance, { setAuthorizationHeader } from "../axiosConfig";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BsThreeDotsVertical, BsFillShareFill } from "react-icons/bs";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineDownload,
  AiFillEye,
} from "react-icons/ai";
import DocumentMenu from "../Component/DocumentMenu";
import TabSelect from "../Component/TabSelect";
import { useForm } from "react-hook-form";

export default function Myged({ token }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    setUser(getToken().user);
    if (getToken().user == null) {
      router.push("/login");
      return;
    }
  }, []);

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
          <TabSelect
            ProfileComponent={ProfileComponent}
            SecurityComponent={SecurityComponent}
          />
        </Box>
      </Box>
    );
  }
}

export function ProfileComponent() {
  const token = getToken();
  const toast = useToast();
  const [file, setFile] = useState(
    token.user?.picture
      ? "http://localhost:8000/storage/pictures/" +
          token.user?.picture.substring(15)
      : ""
  );
  const { register, handleSubmit } = useForm({
    defaultValues: {
      first_name: token.user.first_name,
      last_name: token.user.last_name,
      phone_num: token.user?.phone_num ? token.user?.phone_num : "",
    },
  });

  const handleRemovePicture = async () => {
    try {
      const { data } = await instance.get("/user/removePicure");
      setFile("");
    } catch (err) {
      toast({
        title: "Error delete Picture",
        description: err.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSubmitFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("picture", file);
    const { data } = await instance.post("/user/updatePicture", formData);
    setFile(
      "http://localhost:8000/storage/pictures/" + data.picture.substring(15)
    );
    toast({
      title: "Updated Successfully",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
    try {
    } catch (err) {
      toast({
        title: "Error Update Picture",
        description: err.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleUpdate = async (updateData) => {
    try {
      const { data } = await instance.post("/user/update", updateData);
      toast({
        title: "Updated Successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Error Update",
        description: err.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      p="4"
      bg={"white"}
      borderRadius="md"
      display="flex"
      flexDir={"column"}
      alignItems="center"
      justifyContent={"center"}
      boxShadow="md"
    >
      <Wrap>
        <WrapItem>
          <Avatar
            size={"2xl"}
            name={`${token.user.first_name} ${token.user.last_name}`}
            src={file}
            loading="lazy"
          />
          <Menu>
            <MenuButton>
              <Badge _hover={{ cursor: "pointer" }}>
                <Icon as={AiFillEdit} w={4} h={4} />
              </Badge>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleRemovePicture}>Remove Picture</MenuItem>
              <MenuItem
                onClick={() => {
                  document.getElementById("selectPicture").click();
                }}
              >
                Update Picture
                <Input
                  id="selectPicture"
                  type={"file"}
                  onChange={(e) => {
                    handleSubmitFile(e.target.files[0]);
                  }}
                  hidden
                />
              </MenuItem>
            </MenuList>
          </Menu>
        </WrapItem>
      </Wrap>
      <br />
      <Box w={["full", "full", "full", "70%"]}>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Flex
            flexDirection={"row"}
            alignItems="center"
            justifyContent={"center"}
            gap={3}
          >
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input type={"text"} {...register("first_name")} required />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input type={"text"} {...register("last_name")} required />
            </FormControl>
          </Flex>
          <br />
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input type={"number"} {...register("phone_num")} />
          </FormControl>
          <br />
          <Button type="submit" ml={"0"}>
            Save Changes
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export function SecurityComponent() {
  const { register, handleSubmit, reset } = useForm();
  const [err, setErr] = useState(false);
  const toast = useToast();

  const handleUpdatePassword = async (dataPassword) => {
    if (dataPassword.newPassword != dataPassword.confirmNewPassword)
      setErr(true);
    setErr(false);
    try {
      const { data } = await instance.post("/user/updatePassword", {
        old: dataPassword.oldPassword,
        new: dataPassword.newPassword,
      });
      reset();
      toast({
        title: "Updated Successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Error Update Password",
        description: err.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      p="4"
      bg={"white"}
      borderRadius="md"
      display="flex"
      flexDir={"column"}
      alignItems="center"
      justifyContent={"center"}
      boxShadow="md"
    >
      <Box w={["full", "full", "full", "70%"]}>
        <form onSubmit={handleSubmit(handleUpdatePassword)}>
          {err && (
            <Alert status="error">
              <AlertTitle>Missmatched Password</AlertTitle>
              <AlertDescription>Password should be matched</AlertDescription>
            </Alert>
          )}

          <FormControl>
            <FormLabel>Old Password</FormLabel>
            <Input
              type={"password"}
              {...register("oldPassword", { required: true, minLength: 8 })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              type={"password"}
              {...register("newPassword", { required: true, minLength: 8 })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type={"password"}
              {...register("confirmNewPassword", {
                required: true,
                minLength: 8,
              })}
            />
          </FormControl>
          <br />
          <Button type="submit" ml={"0"}>
            Save Changes
          </Button>
        </form>
      </Box>
    </Box>
  );
}
