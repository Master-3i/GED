import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient, useQueryClient } from "react-query";
import { useEffect } from "react";
import instance, { setAuthorizationHeader } from "../axiosConfig";
import axios from "axios";
import { getToken, refreshAccessToken } from "../token";

const queryClient = new QueryClient();

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    token: ctx.req?.cookies.gid ? ctx.req?.cookies.gid : null,
  };
};

function MyApp({ Component, pageProps, token }) {
  useEffect(() => {
    refreshAccessToken();
  }, []);

  // refreshAccessToken();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <InitialComponent token={token}>
          <Component {...pageProps} token={token} />
        </InitialComponent>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

function InitialComponent({ children, token }) {
  setAuthorizationHeader(token);

  return <>{children}</>;
}

export default MyApp;
