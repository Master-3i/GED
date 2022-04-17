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
} from "@chakra-ui/react";
import { SidebarContent, MobileNav } from "../Component/NavBar";

export default function Myged() {
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
          <Text>Here goes khobza</Text>
        </Box>
      </Box>
    );
  }
}
