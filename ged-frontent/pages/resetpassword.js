import {
  Container,
  Heading,
  VStack,
  Text,
  FormControl,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import instance from "../axiosConfig";
import { useRouter } from "next/router";

export default function ResetPassword({ t, uid }) {
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
                    _focus={{ borderColor: "purple.300", borderWidth: "2px" }}
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
                    _focus={{ borderColor: "purple.300", borderWidth: "2px" }}
                    {...register("confirmPassword", { required: true })}
                    autoFocus={false}
                  />
                </FormControl>
                <Button
                  bgColor={"purple.300"}
                  _hover={{ backgroundColor: "purple.500" }}
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
                  _focus={{ borderColor: "purple.300", borderWidth: "2px" }}
                  {...register("email", { required: true })}
                  autoFocus={false}
                />
              </FormControl>
              <Button
                type="submit"
                bgColor={"purple.300"}
                _hover={{ backgroundColor: "purple.500" }}
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
