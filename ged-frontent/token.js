import axios from "axios";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js/core";
import { setAuthorizationHeader } from "./axiosConfig";

const isBrowser = () => typeof Window !== "undefined";

export const Encrypted = (data) => {
  return AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_GED_PASSPHRASE
  ).toString();
};

export const Decrypted = (ciphertext) => {
  let bytes = AES.decrypt(ciphertext, process.env.NEXT_PUBLIC_GED_PASSPHRASE);
  let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return {
    user: decryptedData.user,
    userPack: decryptedData.userPack,
    token: decryptedData.token,
  };
};

export const logout = () => {
  localStorage.removeItem("GED_TOKEN");
};

export const setToken = (data) => {
  if (data) {
    localStorage.setItem("GED_TOKEN", Encrypted(data));
    console.log(localStorage.getItem("GED_TOKEN"));
  }
};

export const getToken = () => {
  let GED_TOKEN =
     localStorage.getItem("GED_TOKEN")
      ? Decrypted(localStorage.getItem("GED_TOKEN"))
      : { user: null, userPack: null, token: null };
  return GED_TOKEN;
};

export const refreshAccessToken = async () => {
  const token = getToken()?.token;
  if (!token) return;
  const { data } = await axios.get(
    "http://localhost:8000/api/auth/refresh?token=" + token
  );
  setAuthorizationHeader(token);
  localStorage.setItem("GED_TOKEN", Encrypted(data));
};
