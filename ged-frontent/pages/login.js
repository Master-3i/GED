import {
  Container,
  HStack,
  VStack,
  Text,
  FormControl,
  Spacer,
  Flex,
  Box,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import instance, { setAuthorizationHeader } from "../axiosConfig";
import { useRouter } from "next/router";
import { setToken } from "../token";
import { useState } from "react";

function Login() {
  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();
  const router = useRouter();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const loginUser = useMutation(
    async ({ email, password }) => {
      const { data } = await instance.post("/auth/login", {
        email: email,
        password,
      });
      return data;
    },
    {
      onSuccess: async (data, variables, context) => {
        queryClient.setQueryData("user", data);
        setAuthorizationHeader(data.token);
        setToken(data);
      },
    }
  );

  const handleLogin = async (data) => {
    try {
      const response = await loginUser.mutateAsync({
        email: data.email,
        password: data.password,
      });
      router.push("/my-ged");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <HStack justify={"center"} h="100vh" align={"center"}>
      <Container
        border={"1px"}
        p={3}
        borderRadius={7}
        w={["full", "full", "80%"]}
      >
        <VStack spacing={3}>
          <Heading fontWeight={"medium"}>Sign in</Heading>
          <Text color={"gray.500"}>Sign in to your account.</Text>
          <Container w={["full", "full", "60%"]}>
            <form
              style={{ width: "100%" }}
              onSubmit={handleSubmit(handleLogin)}
            >
              <VStack spacing={3}>
                <FormControl>
                  <Input
                    type={"email"}
                    placeholder={"Email Address"}
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "blue.300", borderWidth: "2px" }}
                    {...register("email", { required: true })}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder={"Password"}
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "blue.300", borderWidth: "2px" }}
                    {...register("password", { required: true, minLength: 8 })}
                  />
                </FormControl>
                <Button
                  bgColor={"blue.300"}
                  _hover={{ backgroundColor: "blue.500" }}
                  color="white"
                  type="submit"
                >
                  Sign in
                </Button>
                <Text color={"blue.300"} as="a" fontWeight={"semibold"}>
                  Forgot Password ?
                </Text>
                <HStack>
                  <Text color={"gray.500"}>
                    Create an account{"  "}
                    <a
                      href="/register"
                      style={{
                        color: "rgb(183, 148, 244)",
                        fontWeight: "semibold",
                      }}
                    >
                      {" "}
                      Register
                    </a>
                  </Text>
                </HStack>
              </VStack>
            </form>
          </Container>
        </VStack>
      </Container>
    </HStack>
  );
}

export default function SimpleCard() {
  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();
  const [err, setErr] = useState("");
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const loginUser = useMutation(
    async ({ email, password }) => {
      const { data } = await instance.post("/auth/login", {
        email: email,
        password,
      });
      return data;
    },
    {
      onSuccess: async (data, variables, context) => {
        queryClient.setQueryData("user", data);
        setAuthorizationHeader(data.token);
        setToken(data);
      },
    }
  );

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser.mutateAsync({
        email: data.email,
        password: data.password,
      });
      setLoading(false);
      router.push("/my-ged");
    } catch (err) {
      setErr(err.response.data.message);
      setLoading(false);
    }
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool{" "}
            <Link href={"/pricing"} color={"blue.400"}>
              Features
            </Link>{" "}
            ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {err && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}

          <form style={{ width: "100%" }} onSubmit={handleSubmit(handleLogin)}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", { required: true, minLength: 8 })}
                />
              </FormControl>
              <Stack spacing={4} textAlign="center">
                <Link color={"blue.400"} href="/resetpassword">
                  Forgot password?
                </Link>
                <Button
                  bg={"blue.400"}
                  type="submit"
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
                <Button as={"a"} href="/">
                  Back Home Page
                </Button>
                <Link color={"blue.400"} href="/register">
                  Don't have account, Sign up!
                </Link>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
