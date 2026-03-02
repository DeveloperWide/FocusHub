import axios from "axios";
import { getToken } from "./auth";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});
