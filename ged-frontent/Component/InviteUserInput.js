import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import instance from "../axiosConfig";

export default function InviteUserInput({ group }) {
  const [email, setEmail] = useState("");
  const handleInvite = async () => {
    await instance.get("/group/inviteUser/" + group._id + "/" + email);
  };
  return (
    <InputGroup size={"md"} w="full">
      <Input
        type={"email"}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputRightElement w={"4.5rem"}>
        <Button
          h="1.75rem"
          size="sm"
          disabled={email.length <= 0}
          onClick={(e) => handleInvite()}
        >
          Invite
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
