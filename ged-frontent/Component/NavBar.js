import {
  Box,
  Flex,
  Text,
  CloseButton,
  Button,
  Divider,
  Icon,
  useColorModeValue,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  Avatar,
  VStack,
  MenuList,
  MenuItem,
  MenuDivider,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Spacer,
  Progress,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AiFillFile,
  AiOutlineFileAdd,
  AiFillCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { BsShareFill } from "react-icons/bs";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { GrGroup } from "react-icons/gr";
import { AiOutlineUsergroupAdd, AiFillCloud } from "react-icons/ai";

import instance from "../axiosConfig";
import { getToken, logout } from "../token";

import { useRouter } from "next/router";
import NewButton from "./NewButton";
import { useQueryClient, useQuery } from "react-query";

const LinkItems = [
  { name: "Mon GED", icon: AiFillFile, link: "/my-ged" },
  { name: "Partagés avec moi", icon: BsShareFill, link: "/my-ged/shared_w_me" },
];

export const SidebarContent = ({ onClose, ...rest }) => {
  const queryClient = useQueryClient();
  const { user } = getToken();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
      >
        <NewButton />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
      <Accordion
        defaultIndex={[0]}
        allowMultiple
        p={0}
        w="full"
        isDisabled={true}
      >
        <AccordionItem
          w="full"
          isDisabled={
            queryClient.getQueryData("groups")?.length == 0 ||
            queryClient.getQueryData("groups") == null
          }
        >
          <AccordionButton w="full">
            <Box flex="1" textAlign="left">
              Groups
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} is>
            {queryClient.getQueryData("groups")?.length > 0 &&
              queryClient.getQueryData("groups").map((singleGroup) => (
                <Link href={`/my-ged/group/${singleGroup._id}`}>
                  <Box
                    textDecoration={"none"}
                    p={1}
                    _hover={{
                      color: "blue.500",
                      cursor: "pointer",
                    }}
                    fontWeight="semibold"
                    borderRadius={"md"}
                  >
                    <Text>{singleGroup.group_name}</Text>
                  </Box>
                </Link>
              ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Divider mt={"10"} />
      <StorageUsage
        pack={queryClient.getQueryData("pack")}
        userPack={queryClient.getQueryData("userPack")}
      />
    </Box>
  );
};

export const NavItem = ({ icon, children, link, ...rest }) => {
  return (
    <Link
      href={link}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          color: "blue.500",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "blue.500",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export const MobileNav = ({ onOpen, user, ...rest }) => {
  const router = useRouter();
  const token = getToken();
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    try {
      instance.post("/auth/logout");
      logout();
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {!clicked && (
          <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            onClick={() => setClicked(true)}
            icon={<AiOutlineSearch />}
          />
        )}

        {clicked && (
          <InputGroup
            size={"md"}
            transition="ease-in"
            transitionDuration={"0.5s"}
          >
            <InputLeftElement
              children={<AiFillCloseCircle color="gray.300" />}
              _hover={{
                bg: "gray.100",
                borderRadius: "md",
                cursor: "pointer",
                borderColor: "blue.300",
              }}
              onClick={() => setClicked(false)}
            />
            <Input
              pr="4.5rem"
              type={"text"}
              placeholder="search by email or keywords"
              _focus={{ borderColor: "blue.300" }}
              color="gray.500"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                  if (searchQuery.length >= 3) {
                    router.push("/my-ged/search?q=" + searchQuery);
                  }
                }}
              >
                search
              </Button>
            </InputRightElement>
          </InputGroup>
        )}

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    token.user?.picture
                      ? "http://localhost:8000/storage/pictures/" +
                        token.user?.picture.substring(15)
                      : ""
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {user.first_name} {user.last_name}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <Link href={"/profile"}>
                <MenuItem>Profile</MenuItem>
              </Link>
              <Link href="/my-ged/billing">
                <MenuItem>Billing</MenuItem>
              </Link>

              <MenuDivider />
              <MenuItem onClick={() => handleLogout()}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

function StorageUsage({ userPack, pack }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(
      (
        (parseFloat(userPack?.user_storage) / parseFloat(pack?.storage_limit)) *
        100
      ).toFixed(2)
    );
  }, [userPack, pack]);
  return (
    <Box w={"full"} mt="3" p={2}>
      <Box textAlign={"center"}>
        <HStack mb={3}>
          <Icon as={AiFillCloud} mr={5} w={8} h={8} color="blue.300" />
          <Text>Storage Space</Text>
        </HStack>
        <Progress
          colorScheme={"blue"}
          size="sm"
          value={value}
          borderRadius={"md"}
          mb={2}
        />
        <Text
          color={"gray.600"}
          fontWeight="semibold"
        >{`${userPack?.user_storage} Gb used on ${pack?.storage_limit} GB`}</Text>
      </Box>
    </Box>
  );
}

function GroupUsage({ userPack, pack }) {
  const [groupAllowed, setGroupAllowed] = useState(
    pack.group_limit ? parseInt(pack.group_limit) : 0
  );
  const [groupUsed, setGroupUsed] = useState(
    userPack.user_group ? parseInt(userPack.user_group) : 0
  );

  useEffect(() => {}, [userPack, pack]);
}
