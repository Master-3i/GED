import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
});

export const setAuthorizationHeader = (token) => {
  if (token == null) return;
  instance.defaults.headers = {
    Authorization: "Bearer " + token,
    Accept: "application/json",
  };
};

export default instance;
