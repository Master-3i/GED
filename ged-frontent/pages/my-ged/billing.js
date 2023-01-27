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
  List,
  Button,
  ListItem,
  ListIcon,
  useToast,
  Heading,
  Spacer,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
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
import { FaCheckCircle } from "react-icons/fa";
import DocumentMenu from "../../Component/DocumentMenu";
import BillingTab from "../../Component/BillingTab";

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

  const fetchAllPacks = async () => {
    const { data } = await instance.get("/pack/packs");
    return data;
  };
  const { data: packsData } = useQuery("packs", fetchAllPacks, {
    enabled: user != null,
  });

  const fetchUserHistory = async () => {
    const { data } = await instance.get("/histories");
    return data;
  };

  const { isLoading: historyLoading, data: historyData } = useQuery(
    "userHistory",
    fetchUserHistory,
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
          <BillingTab
            PlanComponent={PlanComponent}
            HistoryComponent={HistoryComponent}
          />
        </Box>
      </Box>
    );
  }
}

export function PlanComponent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [packs, setPacks] = useState(
    queryClient.getQueryData("packs") ? queryClient.getQueryData("packs") : null
  );
  const [userPack, setUserPack] = useState(
    queryClient.getQueryData("userPack")
      ? queryClient.getQueryData("userPack")
      : null
  );
  const [pack, setPack] = useState(
    queryClient.getQueryData("pack") ? queryClient.getQueryData("pack") : null
  );
  const [storageValue, setStorageValue] = useState(0);
  const [groupValue, setGroupValue] = useState(0);

  useEffect(() => {
    setStorageValue(
      (
        (parseFloat(queryClient.getQueryData("userPack")?.user_storage) /
          parseFloat(queryClient.getQueryData("pack")?.storage_limit)) *
        100
      ).toFixed(2)
    );
    setGroupValue(
      (parseInt(queryClient.getQueryData("userPack")?.user_group) /
        parseInt(queryClient.getQueryData("pack")?.group_limit)) *
        100
    );
  }, [queryClient.getQueryData("userPack"), queryClient.getQueryData("pack")]);

  const handleUpgradePayment = (packId, month) => {
    router.push("/my-ged/payment?pack=" + packId + "&m=" + month, null, {
      query: { pack: packId, m: month },
    });
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
      <Heading size={"md"} color="gray.600" mb={4} textAlign="left" w="full">
        Usage
      </Heading>
      <HStack w={["full", "full", "full", "full"]}>
        <Box
          bg={"gray.100"}
          p={3}
          borderRadius="md"
          textAlign={"center"}
          w="50%"
        >
          <CircularProgress value={storageValue} color="blue.300" size={150}>
            <CircularProgressLabel>{storageValue}%</CircularProgressLabel>
          </CircularProgress>
          <Heading size={"lg"}>Storage</Heading>
        </Box>
        <Spacer />
        <Box
          bg={"gray.100"}
          p={3}
          borderRadius="md"
          textAlign={"center"}
          w="50%"
        >
          <CircularProgress value={groupValue} color="blue.300" size={150}>
            <CircularProgressLabel>
              {queryClient.getQueryData("userPack")?.user_group}/
              {queryClient.getQueryData("pack")?.group_limit}
            </CircularProgressLabel>
          </CircularProgress>
          <Heading size={"lg"}>Group</Heading>
        </Box>
      </HStack>
      <Heading
        size={"md"}
        color="gray.600"
        mb={4}
        textAlign="left"
        w="full"
        mt={4}
      >
        Billing
      </Heading>
      <Box
        bg={"gray.100"}
        p={3}
        borderRadius="md"
        textAlign={"center"}
        w="full"
      >
        <HStack w={"full"}>
          <VStack>
            <Text>Current Plan</Text>
            <Heading size={"md"} fontWeight="bold">
              {queryClient.getQueryData("pack")?.package_name}
            </Heading>
          </VStack>
          <Spacer />
          {queryClient.getQueryData("pack")?.package_name != "Free" && (
            <VStack>
              <Text color={"gray.500"}>Next billing cycle 6 months ago</Text>
              <Text fontWeight={"bold"}>11/11/2022</Text>
            </VStack>
          )}
        </HStack>
      </Box>
      <Heading
        size={"md"}
        color="gray.600"
        mb={4}
        textAlign="left"
        w="full"
        mt={4}
      >
        Plans
      </Heading>
      <Box p={3} borderRadius="md" textAlign={"left"} w="full">
        <Tabs variant={"soft-rounded"} colorScheme="blue" w="full">
          <TabList>
            <Tab>Monthly</Tab>
            <Tab>6 Months</Tab>
            <Tab>Annually</Tab>
          </TabList>
          <TabPanels w={"full"}>
            <TabPanel w="full">
              <HStack spacing={3} w="full" justifyContent={"center"}>
                {queryClient.getQueryData("packs")?.length > 0 &&
                  queryClient.getQueryData("packs").map((singlePack) => (
                    <PriceWrapper>
                      <Box py={4} px={12}>
                        <Text fontWeight="500" fontSize="2xl">
                          {singlePack.package_name}
                        </Text>
                        <HStack justifyContent="center">
                          <Text fontSize="3xl" fontWeight="600">
                            DH
                          </Text>
                          <Text fontSize="5xl" fontWeight="900">
                            {singlePack.price_month}
                          </Text>
                          <Text fontSize="3xl" color="gray.500">
                            /month
                          </Text>
                        </HStack>
                      </Box>
                      <VStack
                        bg={useColorModeValue("gray.50", "gray.700")}
                        py={4}
                        borderBottomRadius={"xl"}
                      >
                        <List spacing={3} textAlign="start" px={12}>
                          {singlePack.features.map((f) => (
                            <ListItem>
                              <ListIcon as={FaCheckCircle} color="green.500" />
                              {f}
                            </ListItem>
                          ))}
                        </List>
                        <Box w="80%" pt={7}>
                          <Button
                            w="full"
                            colorScheme="blue"
                            variant={
                              queryClient.getQueryData("userPack")?.pack_id ==
                              singlePack._id
                                ? "solid"
                                : "outline"
                            }
                            disabled={
                              queryClient.getQueryData("userPack")?.pack_id ==
                              singlePack._id
                                ? true
                                : false
                            }
                            onClick={() =>
                              handleUpgradePayment(singlePack._id, 1)
                            }
                          >
                            {queryClient.getQueryData("userPack")?.pack_id ==
                            singlePack._id
                              ? "Current Plan"
                              : "Upgrade Plan"}
                          </Button>
                        </Box>
                      </VStack>
                    </PriceWrapper>
                  ))}
              </HStack>
            </TabPanel>
            <TabPanel w="full">
              <HStack spacing={3} w="full" justifyContent={"center"}>
                {queryClient.getQueryData("packs")?.length > 0 &&
                  queryClient.getQueryData("packs").map((singlePack) => (
                    <PriceWrapper>
                      <Box py={4} px={12}>
                        <Text fontWeight="500" fontSize="2xl">
                          {singlePack.package_name}
                        </Text>
                        <HStack justifyContent="center">
                          <Text fontSize="3xl" fontWeight="600">
                            DH
                          </Text>
                          <Text fontSize="5xl" fontWeight="900">
                            {singlePack.price_6_month}
                          </Text>
                          <Text fontSize="3xl" color="gray.500">
                            / 6 months
                          </Text>
                        </HStack>
                      </Box>
                      <VStack
                        bg={useColorModeValue("gray.50", "gray.700")}
                        py={4}
                        borderBottomRadius={"xl"}
                      >
                        <List spacing={3} textAlign="start" px={12}>
                          {singlePack.features.map((f) => (
                            <ListItem>
                              <ListIcon as={FaCheckCircle} color="green.500" />
                              {f}
                            </ListItem>
                          ))}
                        </List>
                        <Box w="80%" pt={7}>
                          <Button
                            w="full"
                            colorScheme="blue"
                            variant={
                              queryClient.getQueryData("userPack")?.pack_id ==
                              singlePack._id
                                ? "solid"
                                : "outline"
                            }
                            disabled={
                              queryClient.getQueryData("userPack")?.pack_id ==
                              singlePack._id
                                ? true
                                : false
                            }
                            onClick={() =>
                              handleUpgradePayment(singlePack._id, 6)
                            }
                          >
                            {queryClient.getQueryData("userPack")?.pack_id ==
                            singlePack._id
                              ? "Current Plan"
                              : "Upgrade Plan"}
                          </Button>
                        </Box>
                      </VStack>
                    </PriceWrapper>
                  ))}
              </HStack>
            </TabPanel>
            <TabPanel w="full">
              <HStack spacing={3} w="full" justifyContent={"center"}>
                {queryClient.getQueryData("packs")?.length > 0 &&
                  queryClient.getQueryData("packs").map((singlePack) => (
                    <PriceWrapper>
                      <Box py={4} px={12}>
                        <Text fontWeight="500" fontSize="2xl">
                          {singlePack.package_name}
                        </Text>
                        <HStack justifyContent="center">
                          <Text fontSize="3xl" fontWeight="600">
                            DH
                          </Text>
                          <Text fontSize="5xl" fontWeight="900">
                            {singlePack.price_annually}
                          </Text>
                          <Text fontSize="3xl" color="gray.500">
                            /Annually
                          </Text>
                        </HStack>
                      </Box>
                      <VStack
                        bg={useColorModeValue("gray.50", "gray.700")}
                        py={4}
                        borderBottomRadius={"xl"}
                      >
                        <List spacing={3} textAlign="start" px={12}>
                          {singlePack.features.map((f) => (
                            <ListItem>
                              <ListIcon as={FaCheckCircle} color="green.500" />
                              {f}
                            </ListItem>
                          ))}
                        </List>
                        <Box w="80%" pt={7}>
                          <Button
                            w="full"
                            colorScheme="blue"
                            variant={
                              queryClient.getQueryData("userPack")?.pack_id ==
                              singlePack._id
                                ? "solid"
                                : "outline"
                            }
                            disabled={
                              queryClient.getQueryData("userPack")?.pack_id ==
                              singlePack._id
                                ? true
                                : false
                            }
                            onClick={() =>
                              handleUpgradePayment(singlePack._id, 12)
                            }
                          >
                            {queryClient.getQueryData("userPack")?.pack_id ==
                            singlePack._id
                              ? "Current Plan"
                              : "Upgrade Plan"}
                          </Button>
                        </Box>
                      </VStack>
                    </PriceWrapper>
                  ))}
              </HStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

function HistoryComponent({ histories }) {
  const queryClient = useQueryClient();
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
      {queryClient.getQueryData("userHistory")?.length == 0 && (
        <Heading fontWeight={"thin"}>No payment made</Heading>
      )}
      {queryClient.getQueryData("userHistory")?.length > 0 && (
        <TableContainer
          border={"1px solid lightgray"}
          p={3}
          borderRadius="md"
          w={"full"}
        >
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Order ID</Th>
                <Th>Plan</Th>
                <Th isNumeric>Total</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {queryClient
                .getQueryData("userHistory")
                ?.map((singleHistory, index) => (
                  <Tr>
                    <Td>{index + 1}</Td>
                    <Td>{singleHistory.order_id}</Td>
                    <Td>{singleHistory.pack}</Td>
                    <Td isNumeric>{singleHistory.amount} $</Td>
                    <Td
                      color={
                        singleHistory.status == "success"
                          ? "green.300"
                          : "red.300"
                      }
                    >
                      {singleHistory.status}
                    </Td>
                    <Td>{singleHistory.created_at}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

function PriceWrapper({ children }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.100", "gray.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}
