"use client";
import { usePageRouter } from "../PageRouter/usePageRouter";

interface LoginProps {
  email: string;
  password: string;
}

export function useAuth() {
  const { navigate } = usePageRouter();

  const login = ({ email, password }: LoginProps) => {
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return { login };
}
