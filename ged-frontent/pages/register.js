import {
  Flex,
  Box,
  FormLabel,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  Container,
  Heading,
  HStack,
  VStack,
  Text,
  FormControl,
  Input,
  Spacer,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import instance, { setAuthorizationHeader } from "../axiosConfig";
import { useRouter } from "next/router";
import { setToken } from "../token";
import { useState } from "react";
import Link from "next/link";

function Register() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { register, handleSubmit } = useForm();

  const registerUser = useMutation(
    async (datafield) => {
      const { data } = await instance.post("/auth/register", datafield);
      return data;
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.setQueryData("user", data);
        setAuthorizationHeader(data.token);
        setToken(data);
      },
    }
  );

  const handleLogin = (data) => {
    try {
      registerUser.mutate(data);
      router.push("/my-ged");
    } catch (err) {
      console.error("register  error : ", err);
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
                <HStack spacing={3}>
                  <FormControl>
                    <Input
                      type={"first_name"}
                      placeholder={"First Name"}
                      _placeholder={{ color: "gray.500" }}
                      _focus={{ borderColor: "blue.300", borderWidth: "2px" }}
                      {...register("first_name", {
                        required: true,
                        minLength: 3,
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      type={"last_name"}
                      placeholder={"Last Name"}
                      _placeholder={{ color: "gray.500" }}
                      _focus={{ borderColor: "blue.300", borderWidth: "2px" }}
                      {...register("last_name", {
                        required: true,
                        minLength: 3,
                      })}
                    />
                  </FormControl>
                </HStack>
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
                  Register
                </Button>
                <HStack>
                  <Text color={"gray.500"}>
                    Already have an account ?{"  "}
                    <a
                      href="/login"
                      style={{
                        color: "rgb(183, 148, 244)",
                        fontWeight: "semibold",
                      }}
                    >
                      {" "}
                      Login
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

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [err, setErr] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const registerUser = useMutation(
    async (datafield) => {
      const { data } = await instance.post("/auth/register", datafield);
      return data;
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.setQueryData("user", data);
        setAuthorizationHeader(data.token);
        setToken(data);
      },
    }
  );

  const handleLogin = async (dataField) => {
    setLoading(true);
    try {
      const { data } = await registerUser.mutateAsync(dataField);
      setLoading(false);
      if (data) {
        router.push("/my-ged");
      }
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
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
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
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      {...register("first_name", {
                        required: true,
                        minLength: 3,
                      })}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      {...register("last_name", {
                        required: true,
                        minLength: 3,
                      })}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true, minLength: 8 })}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={4} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={isLoading}
                >
                  Sign up
                </Button>
                <Button as={"a"} href="/">
                  Back to home page
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link color={"blue.400"} href="/login">
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

// export async function getServerSideProps(ctx) {
//   console.log(ctx.req.cookies.gid);

//   const token = ctx.req.cookies.gid ? ctx.req.cookies.gid : null;
//   if (token) {
//     return {
//       redirect: {
//         direction: "/",
//         permanent: false,
//       },
//     };
//   }
//   return { props: {} };
// }
