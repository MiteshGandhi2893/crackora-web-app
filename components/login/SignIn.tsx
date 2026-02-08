"use client";

import { useState } from "react";
import { authService } from "@/services/Authentication.service";
import { useAuth, User } from "@/providers/AuthProvider";
import Image from "next/image";

interface SignInProps {
  handleIsLogin: (val: boolean) => void;
  sendMessage: (msg: {
    text: string;
    messageType: "Success" | "Error";
  }) => void;
  onSuccess: (user: User) => void;
}

export function SignIn({ handleIsLogin, sendMessage, onSuccess }: SignInProps) {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "username" && !value.trim()) error = "Email is required.";
    if (name === "username" && value && !/\S+@\S+\.\S+/.test(value))
      error = "Enter a valid email address.";
    if (name === "password" && !value) error = "Password is required.";

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    if (!formData.username.trim()) newErrors.username = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.username))
      newErrors.username = "Enter a valid email address.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await authService.signIn({
      username: formData.username,
      password: formData.password,
    });
    setLoading(false);

    if (result?.error) {
      sendMessage({ text: result.error, messageType: "Error" });
      return;
    }

    setUser(result.user as User);
    onSuccess(result.user as User);
    sendMessage({ text: "Signed in successfully", messageType: "Success" });
  };

  return (
    <div className="flex flex-col lg:mt-10 items-center">
      <form
        onSubmit={handleSubmit}
        className="lg:w-[80%] w-[90%] flex flex-col gap-4 mt-4"
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950">Email</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            placeholder="Enter your registered email"
            className="outline-0 border p-2 border-gray-300 rounded text-sm"
          />
          {errors.username && (
            <span className="text-red-700 text-sm">{errors.username}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            placeholder="Enter your password"
            className="outline-0 border p-2 border-gray-300 rounded text-sm"
          />
          {errors.password && (
            <span className="text-red-700 text-sm">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-800 text-white p-2 rounded mt-2 hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex items-center justify-center text-sm relative mt-2">
          Not a{" "}
          <div className="relative w-25 h-15 flex items-center">
            <Image
              src="/crackora-logo.svg"
              alt="Crackora"
              fill
            />
          </div>
          user?
          <span
            className="ml-2 text-amber-600 cursor-pointer underline"
            onClick={() => handleIsLogin(false)}
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}
