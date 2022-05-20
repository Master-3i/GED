import {
  Flex,
  Stack,
  useColorModeValue,
  Container,
  Heading,
  VStack,
  Text,
  FormControl,
  Input,
  Button,
  Alert,
  FormLabel,
  Box,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import instance from "../axiosConfig";
import { useRouter } from "next/router";

function ResetPassword({ t, uid }) {
  const { register, handleSubmit } = useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendResetPasswordLink = async (data) => {
    setSuccess("");
    setError("");
    try {
      await instance.post("/auth/sendResetPasswordLink", { email: data.email });
      setSuccess("email_sent");
    } catch (err) {
      setError("email_sent_error");
      console.error(err);
    }
  };

  const handleSubmitResetPassword = async (data) => {
    setSuccess("");
    setError("");
    if (data.password !== data.confirmPassword) return;
    try {
      await instance.post(`/auth/resetpassword?t=${t}&uid=${uid}`, {
        password: data.password,
      });
      setSuccess("password_reset");
      router.push("/login");
    } catch (err) {
      setError("password_reset_error");
      console.error(err);
    }
  };

  if (t && uid) {
    return (
      <VStack spacing={3} h="100vh" justify={"center"} align="center">
        <Container
          border={"1px solid"}
          borderRadius={7}
          p={3}
          w={["full", "full", "80%"]}
          textAlign={"center"}
        >
          <VStack spacing={3}>
            {success == "password_reset" && (
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="100px"
                borderRadius={7}
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Password Reseted!
                </AlertTitle>
              </Alert>
            )}
            {error == "password_reset_error" && (
              <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                borderRadius={7}
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Verification Link Sent!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  A vetification Link sent to your email. Please check You
                  mailbox
                </AlertDescription>
              </Alert>
            )}
            <Heading fontWeight={"light"} fontSize="6xl">
              Reset Password
            </Heading>
            <form onSubmit={handleSubmit(handleSubmitResetPassword)}>
              <VStack spacing={3}>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder="Password"
                    w={"full"}
                    _placeholder={{ color: "black" }}
                    _focus={{ borderColor: "blue.300", borderWidth: "2px" }}
                    {...register("password", { required: true })}
                    autoFocus={false}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder="Confirm Password"
                    w={"full"}
                    _placeholder={{ color: "black" }}
                    _focus={{ borderColor: "blue.300", borderWidth: "2px" }}
                    {...register("confirmPassword", { required: true })}
                    autoFocus={false}
                  />
                </FormControl>
                <Button
                  bgColor={"blue.300"}
                  _hover={{ backgroundColor: "blue.500" }}
                  color="white"
                  type="submit"
                >
                  Reset Password
                </Button>
              </VStack>
            </form>
          </VStack>
        </Container>
      </VStack>
    );
  }

  return (
    <VStack spacing={3} h="100vh" justify={"center"} align={"center"}>
      <Container
        border={"1px solid"}
        borderRadius={7}
        p={3}
        w={["full", "full", "80%"]}
        textAlign={"center"}
      >
        <VStack spacing={3}>
          {success == "email_sent" && (
            <Alert
              status="info"
              variant="subtle"
              boxSize={"md"}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              borderRadius={7}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Verification Link Sent!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                A vetification Link sent to your email. Please check You mailbox
              </AlertDescription>
            </Alert>
          )}
          {error == "email_sent_error" && (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              borderRadius={7}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Error!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                It seems no account exist under the given email
              </AlertDescription>
            </Alert>
          )}

          <Heading fontWeight={"light"} fontSize="6xl">
            Reset Password
          </Heading>
          <Text color={"gray.500"}>
            Enter your email address and we'll send you an email with
            instructions to reset your password.
          </Text>
          <form
            style={{ width: "80%" }}
            onSubmit={handleSubmit(handleSendResetPasswordLink)}
          >
            <VStack spacing={3}>
              <FormControl>
                <Input
                  type={"email"}
                  placeholder="Email"
                  w={"full"}
                  _placeholder={{ color: "black" }}
                  _focus={{ borderColor: "blue.300", borderWidth: "2px" }}
                  {...register("email", { required: true })}
                  autoFocus={false}
                />
              </FormControl>
              <Button
                type="submit"
                bgColor={"blue.300"}
                _hover={{ backgroundColor: "blue.500" }}
                color="white"
              >
                Reset
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </VStack>
  );
}

export default function ForgotPasswordForm({ t, uid }) {
  const { register, handleSubmit } = useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const handleSendResetPasswordLink = async (data) => {
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      await instance.post("/auth/sendResetPasswordLink", { email: data.email });
      setLoading(false);
      setSuccess("email_sent");
    } catch (err) {
      setLoading(false);
      setError("email_sent_error");
      console.error(err);
    }
  };

  const handleSubmitResetPassword = async (data) => {
    setSuccess("");
    setError("");
    setLoading(true);
    if (data.password !== data.confirmPassword) return;
    try {
      await instance.post(`/auth/resetpassword?t=${t}&uid=${uid}`, {
        password: data.password,
      });
      setLoading(false);
      setSuccess("password_reset");
      router.push("/login");
    } catch (err) {
      setError("password_reset_error");
      setLoading(false);
      console.error(err);
    }
  };
  if (t && uid) {
    return (
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {success == "password_reset" && (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="100px"
              borderRadius={7}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Password Reseted!
              </AlertTitle>
            </Alert>
          )}
          {error == "password_reset_error" && (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              borderRadius={7}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Verification Link Sent!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                A vetification Link sent to your email. Please check You mailbox
              </AlertDescription>
            </Alert>
          )}

          <Heading size={"xl"} fontWeight="semibold" my={3} color={"gray.600"}>
            New Password
          </Heading>

          <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit(handleSubmitResetPassword)}
          >
            <Stack spacing={4}>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", { required: true, minLength: 8 })}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  {...register("confirmPassword", { required: true })}
                />
              </FormControl>
              <Stack spacing={6}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                  isLoading={isLoading}
                >
                  Reset Password
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit(handleSendResetPasswordLink)}
        >
          <FormControl id="email" mb={3}>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              {...register("email", { required: true })}
              type="email"
            />
          </FormControl>
          <Stack spacing={4}>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
              isLoading={isLoading}
            >
              Request Reset
            </Button>
            <Button as={"a"} href="/">
              Back home page
            </Button>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
}

export async function getServerSideProps(ctx) {
  const t = ctx.query.t ? ctx.query.t : null;
  const uid = ctx.query.uid ? ctx.query.uid : null;
  if (t && uid) {
    return {
      props: {
        t,
        uid,
      },
    };
  }
  return {
    props: {},
  };
}
