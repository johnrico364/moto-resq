"use client";
import { usePageRouter } from "../PageRouter/usePageRouter";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface LoginProps {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: unknown;
}

export function useAuth() {
  const { navigate } = usePageRouter();

  const login = async ({ email, password }: LoginProps) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    try {
      const response = await fetch(`${BASE_URL}/users/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      });
      console.log("Status:", response.status, response.statusText);

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.success) {
        return {
          success: false,
          message: result.message || "Unable to sign in.",
        };
      }

      navigate("/dashboard");
      return {
        success: true,
        message: result.message,
        token: result.token,
        data: result.data,
      };
    } catch (error) {
      console.log(
        `${BASE_URL}/users/auth/signin error:`,
        JSON.stringify(error),
      );
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error while signing in.";

      return {
        success: false,
        message,
      };
    }
  };

  return { login };
}
