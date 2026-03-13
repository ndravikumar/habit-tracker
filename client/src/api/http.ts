import axios from "axios";
import { getStoredToken } from "@/lib/authStorage";

export const API_BASE_URL = "http://localhost:8000/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
