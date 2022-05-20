import { Box, Container, Heading, Image } from "@chakra-ui/react";

export default function NoResultFound() {
  return (
    <Container
      display="flex"
      flexDirection={"row"}
      h={"100%"}
      justifyContent="center"
      alignItems={"center"}
    >
      <Image src="/void.svg" />
      <Heading size={"3xl"} color="gray.400">
        No file Found
      </Heading>
    </Container>
  );
}
