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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>(
    {},
  );
  // const {login} = useLogin();

  const validate = () => {
    const newErrors: { email?: string; password?: string; form?: string } = {};
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!normalizedPassword) {
      newErrors.password = "Password is required.";
    } else if (normalizedPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (isSubmitting) return;
    if (!validate()) return;
    setIsSubmitting(true);
    const data = { email, password };
    const result = await login(data);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        form: result.message || "Unable to sign in. Please try again.",
      }));
      console.log(JSON.stringify(result.message));
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    setIsSubmitting(false);
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
          {errors.form ? (
            <p className="mb-4 text-sm text-red-500">{errors.form}</p>
          ) : null}
          <TextInput
            label="Email"
            name="email"
            value={email}
            placeholder="you@example.com"
            error={errors.email}
            onChange={(value) => {
              setEmail(value);
              if (errors.email || errors.form) {
                setErrors((prev) => ({
                  ...prev,
                  email: undefined,
                  form: undefined,
                }));
              }
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
              if (errors.password || errors.form) {
                setErrors((prev) => ({
                  ...prev,
                  password: undefined,
                  form: undefined,
                }));
              }
            }}
          />

          <LoginButton
            onPress={submit}
            text={isSubmitting ? "Signing In..." : "Login"}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default Auth;
