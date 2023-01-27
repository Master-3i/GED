import {
  Box,
  Divider,
  Heading,
  HStack,
  Icon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import instance from "../../../axiosConfig";
import { PayPalButton } from "react-paypal-button-v2";

export default function Payment({ id, m, total, month }) {
  return (
    <Box
      w={"full"}
      h="100vh"
      bg={"gray.100"}
      display="flex"
      flexDir={"column"}
      justifyContent={"center"}
      alignItems="center"
    >
      <HStack
        w={["full", "full", "full", "50%"]}
        mb="3"
        _hover={{ cursor: "pointer" }}
      >
        <Box
          p={3}
          borderRadius="md"
          bg={"white"}
          onClick={() => window.history.back()}
        >
          <HStack>
            <Icon as={AiOutlineArrowLeft} w={4} h={4} color="black" />
            <Text fontWeight={"semibold"}>Back</Text>
          </HStack>
        </Box>
      </HStack>
      <Box
        w={["full", "full", "full", "50%"]}
        bg="white"
        p={3}
        borderRadius="md"
        boxShadow={"md"}
      >
        <Heading
          size={"2xl"}
          textAlign={"center"}
          fontWeight="thin"
          mt={3}
          mb={3}
        >
          Order Details
        </Heading>
        <Box
          w={["full"]}
          textAlign="center"
          display={"flex"}
          flexDir="column"
          alignItems={"center"}
        >
          <Box
            borderRadius={"md"}
            w={["full", "full", "full", "80%"]}
            bg={"gray.100"}
            p={4}
          >
            <Box mb={3}>
              <HStack>
                <Text>Plan</Text>
                <Spacer />
                <Text>Price</Text>
              </HStack>
            </Box>
            <Divider colorScheme={"blackAlpha"} />
            <Box mb={3}>
              <HStack>
                <Text>Grown ({month}) </Text>
                <Spacer />
                <Text>{total}</Text>
              </HStack>
            </Box>
            <Divider colorScheme={"blackAlpha"} />
            <Box mb={3}>
              <HStack>
                <Text fontWeight={"bold"}>Total</Text>
                <Spacer />
                <Text fontWeight={"bold"}>{total}</Text>
              </HStack>
            </Box>
          </Box>
        </Box>
        <Box w="full" textAlign={"center"} mt={3}>
          <PayPalButton
            amount={total}
            currency="USD"
            onSuccess={async (details, data) => {
              console.log(details);
              alert("Transaction completed by " + details);
              return await instance.post("/history/success", {
                pack_id: id,
                m: parseInt(m),
                order_id: data.orderID,
                amount: total,
              });

              // OPTIONAL: Call your server to save the transaction
            }}
            onError={async (data) => {
              return console.log("data", data);
            }}
            options={{
              clientId:
                "AQbFrwKaxNfBe-RHxl8Au8M1dcCYKG0mY4KvO5bMQ1MDXP43zPMYFkV6XxDj0ybld2YYCGJHAuWh7x9w",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export async function getServerSideProps(ctx) {
  let total = 0;
  let month = "";
  let pack = null;
  const { data } = await axios.get(
    "http://localhost:8000/api/packs/" + ctx.query.pack,
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + ctx.req.cookies.gid,
      },
    }
  );
  if (data.pack) {
    pack = data.pack;
    switch (ctx.query.m) {
      case "1":
        month = "Month";
        total = data.pack.price_month;
        break;
      case "6":
        month = "6 Months";
        total = data.pack.price_6_month;
        break;
      case "12":
        month = "Annually";
        total = data.pack.price_annually;
        break;
    }
  }
  console.log("mongth", total);
  return {
    props: {
      id: ctx.query.pack,
      m: ctx.query.m,
      total: total,
      month: month,
    },
  };
}
