import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient, useQueryClient } from "react-query";
import { useEffect } from "react";
import instance, { setAuthorizationHeader } from "../axiosConfig";
import axios from "axios";
import { refreshAccessToken } from "../token";

const queryClient = new QueryClient();

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    token: ctx.req?.cookies.gid ? ctx.req?.cookies.gid : null,
  };
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    window.addEventListener("beforeunload", refreshAccessToken);
    return () => () => {
      window.removeEventListener("beforeunload", refreshAccessToken);
    };
  }, []);

  refreshAccessToken();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
