import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient, useQueryClient } from "react-query";
import { useEffect } from "react";
import instance, { setAuthorizationHeader } from "../axiosConfig";

const queryClient = new QueryClient();

MyApp.getInitialProps = ({ ctx }) => {
  return {
    token: ctx.req?.cookies.gid ? ctx.req?.cookies.gid : null,
  };
};

const RefresherComponent = ({ token }) => {
  const q = useQueryClient();

  const setUserQuery = async () => {
    if (token) {
      const { data } = await instance.get("/auth/refresh");
      q.setQueryData("user", data);
      setAuthorizationHeader(token);
    }
  };

  useEffect(() => {
    setUserQuery();
  }, []);
  return (
    <>
    </>
  );
};

function MyApp({ Component, pageProps, token }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RefresherComponent token={token ? token : null} />
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
