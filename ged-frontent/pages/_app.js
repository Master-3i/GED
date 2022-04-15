import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient, useQueryClient } from "react-query";
import { useEffect } from "react";
import { setAuthorizationHeader } from "../axiosConfig";

const queryClient = new QueryClient();

MyApp.getInitialProps = ({ ctx }) => {
  return {
    token: ctx.req.cookies.gid ? ctx.req.cookies.gid : null,
  };
};

function MyApp({ Component, pageProps, token }) {
  useEffect(() => {
    if (token) {
      setAuthorizationHeader(token);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
