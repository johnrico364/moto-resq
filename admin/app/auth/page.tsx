"use client";
import { useState } from "react";
import { ICONS } from "@/app/Shared/Constants/icons";
import { useAuth } from "@/app/Services/Auth/useAuth";
import { TextInput } from "../Components/auth/input/textInput";
import { LoginButton } from "../Components/auth/button/LoginButton";

export function Auth() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const data = { email, password };
    login(data);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-16"
        style={{ backgroundColor: "#1e88e5" }}
      >
        <div>
          <div className="w-8 h-8 bg-white rounded-full opacity-80" />
        </div>
        <div>
          <p className="text-white text-xs tracking-[0.3em] uppercase mb-4 opacity-60">
            Admin Dashboard
          </p>
          <h2 className="text-white text-5xl font-black leading-none tracking-tight">
            MOTO
            <br />
            RESQ
          </h2>
          <div className="mt-8 w-12 h-0.5 bg-white opacity-30" />
          <p className="mt-6 text-white text-sm opacity-50 leading-relaxed max-w-xs">
            Rapid response. Real-time dispatch. Every second counts.
          </p>
        </div>
        <p className="text-white text-xs opacity-30">© 2025 MotoResQ</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-12">
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ color: "#1e88e5" }}
            >
              MOTO RESQ
            </h1>
            <div
              className="mt-2 w-8 h-0.5"
              style={{ backgroundColor: "#1e88e5" }}
            />
          </div>
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-10">
            Sign in to continue
          </p>
          <TextInput
            label="Email"
            name="email"
            value={email}
            placeholder="you@example.com"
            error={errors.email}
            onChange={(value) => {
              setEmail(value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          <TextInput
            label="Password"
            name="password"
            showToggle={true}
            value={password}
            placeholder="••••••••"
            error={errors.password}
            onChange={(value) => {
              setPassword(value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />

          <LoginButton onPress={submit} text="Login" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
