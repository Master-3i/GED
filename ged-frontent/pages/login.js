import {
  Container,
  Heading,
  HStack,
  VStack,
  Text,
  FormControl,
  Input,
  Spacer,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import instance, { setAuthorizationHeader } from "../axiosConfig";
import { useRouter } from "next/router";
import { setToken } from "../token";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginUser = useMutation(
    async ({ email, password }) => {
      const { data } = await instance.post("/auth/login", {
        email: email,
        password,
      });
      return data;
    },
    {
      onSuccess: (data, variables, context) => {
        console.log("data : ", data);
        queryClient.setQueryData("user", data);
        setAuthorizationHeader(data.token);
        setToken(data)
        router.push("/my-ged");
      },
    }
  );

  const handleLogin = async (data) => {
    try {
      const response =  await loginUser.mutate({ email: data.email, password: data.password });
      console.log("response : ", response)
      
    } catch (err) {
      console.error(err);
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
                    _focus={{ borderColor: "purple.300", borderWidth: "2px" }}
                    {...register("email", { required: true })}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder={"Password"}
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "purple.300", borderWidth: "2px" }}
                    {...register("password", { required: true, minLength: 8 })}
                  />
                </FormControl>
                <Button
                  bgColor={"purple.300"}
                  _hover={{ backgroundColor: "purple.500" }}
                  color="white"
                  type="submit"
                >
                  Sign in
                </Button>
                <Text color={"purple.300"} as="a" fontWeight={"semibold"}>
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
