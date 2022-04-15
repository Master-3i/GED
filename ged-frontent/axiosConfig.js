import axios from "axios";

export const setAuthorizationHeader = (token) => {
  instance.defaults.headers = {
    Authorization: "Bearer " + token,
    Accept: "application/json",
  };
};

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json", "content-type": "application/json" },
  withCredentials: true
});

export default instance;
