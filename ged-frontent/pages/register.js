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
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import instance, { setAuthorizationHeader } from "../axiosConfig";

export default function Register() {
  const queryClient = useQueryClient();

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
      },
    }
  );

  const handleLogin = (data) => {
    try {
      registerUser.mutate(data);
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
                      _focus={{ borderColor: "purple.300", borderWidth: "2px" }}
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
                      _focus={{ borderColor: "purple.300", borderWidth: "2px" }}
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
