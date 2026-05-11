"use client";
import { useCallback } from "react";
import { useAuthSession } from "./AuthSessionProvider";
import type { AuthUser } from "./authSession";
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
  const { setSession, clearSession } = useAuthSession();

  const signOut = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

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

      if (
        typeof result.token !== "string" ||
        !result.data ||
        typeof result.data !== "object"
      ) {
        return {
          success: false,
          message: "Invalid response from server.",
        };
      }

      setSession({
        token: result.token,
        user: result.data as AuthUser,
      });
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

  return { login, signOut };
}
