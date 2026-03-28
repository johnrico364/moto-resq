"use client";
import { usePageRouter } from "../PageRouter/usePageRouter";

interface LoginProps {
  email: string;
  password: string;
}

export function useAuth() {
  const { navigate } = usePageRouter();

  const login = async ({ email, password }: LoginProps) => {
    try {
      const data = await fetch("http://localhost:4000/api/users/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(JSON.stringify(data));
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return { login };
}

