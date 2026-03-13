import { AxiosError } from "axios";
import { http } from "@/api/http";
import type { AuthUser } from "@/contexts/AuthContext";

interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

function toError(error: unknown) {
  if (error instanceof AxiosError) {
    return new Error(error.response?.data?.message ?? "Request failed");
  }

  return error instanceof Error ? error : new Error("Request failed");
}

export async function signup(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const { data } = await http.post<AuthResponse>("/auth/signup", {
      email,
      password,
    } satisfies AuthPayload);
    return data;
  } catch (error) {
    throw toError(error);
  }
}

export async function signin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const { data } = await http.post<AuthResponse>("/auth/signin", {
      email,
      password,
    } satisfies AuthPayload);
    return data;
  } catch (error) {
    throw toError(error);
  }
}
