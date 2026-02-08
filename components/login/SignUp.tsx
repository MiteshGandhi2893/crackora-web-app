"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { authService } from "@/services/Authentication.service";
import Image from "next/image";

export function SignUp(props: any) {
  const { handleIsLogin, sendMessage } = props;

const handleSingUp = async () => {
  // Run validation for all fields
  const newErrors: any = {};

  if (!formData.fullname.trim()) newErrors.fullname = "Full Name is required.";
  if (!formData.email.trim()) newErrors.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(formData.email))
    newErrors.email = "Enter a valid email address.";

  if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
  else if (!/^\d{10}$/.test(formData.phone))
    newErrors.phone = "Enter a valid 10-digit phone number.";

  if (!formData.password) newErrors.password = "Password is required.";
  else if (formData.password.length < 6)
    newErrors.password = "Password must be at least 6 characters.";

  if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm your password.";
  else if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match.";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    // There are validation errors, so don't submit
    return;
  }

  // No validation errors, proceed to send data
  const signUpPayload = JSON.parse(JSON.stringify(formData));
  delete signUpPayload.confirmPassword;

  const result = await authService.signUp(signUpPayload);
  let message = "Sign Up Successful";

  if (result.error) {
    message = result.error;
  }

  sendMessage({
    text: message,
    messageType: `${result.error ? "Error" : "Success"}`,
  });
};
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "fullname":
        if (!value.trim()) error = "Full Name is required.";
        break;
      case "email":
        if (!value.trim()) error = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value))
          error = "Enter a valid email address.";
        break;
      case "phone":
        if (!value.trim()) error = "Phone number is required.";
        else if (!/^\d{10}$/.test(value))
          error = "Enter a valid 10-digit phone number.";
        break;
      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 6)
          error = "Password must be at least 6 characters.";
        break;
      case "confirmPassword":
        if (!value) error = "Confirm your password.";
        else if (value !== formData.password) error = "Passwords do not match.";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields once again before submit
    const allFieldsValid = Object.values(errors).every((err) => err === "");
    if (!allFieldsValid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    console.log("Form submitted", formData);
    // Submit to backend or handle next step here
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex w-full justify-center text-cyan-950 mt-5 text-sm">
        CREATE ACCOUNT
      </div>
      <form onSubmit={handleSubmit} className="w-[90%] flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm opacity-80">Full Name</label>
          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            className="outline-0 border p-2 border-gray-200 rounded text-sm h-8 text-gray-600"
            placeholder="Enter your first and last name"
          />
          {errors.fullname && (
            <span className="text-red-700 text-xs ml-1 mt-1">{errors.fullname}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm opacity-80">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            className="outline-0 border p-2 border-gray-200 rounded text-sm h-8 text-gray-600"
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-red-700 text-xs ml-1 mt-1">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm opacity-80">Phone Number</label>
          <div className="flex w-full gap-2 items-center">
            <span className="text-sm text-amber-600">+91</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
            className="outline-0 border p-2 border-gray-200 rounded text-sm h-8 text-gray-600 w-full"
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && (
            <span className="text-red-700 text-xs ml-1 mt-1">{errors.phone}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm opacity-80">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            className="outline-0 border p-2 border-gray-200 rounded text-sm h-8 text-gray-600"
            placeholder="Enter password"
          />
          {errors.password && (
            <span className="text-red-700 text-xs ml-1 mt-1">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm opacity-70">Confirm Password</label>
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            className="outline-0 border p-2 border-gray-200 rounded text-sm h-8 text-gray-600"
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <span className="text-red-700 text-xs ml-1 mt-1">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <button
            onClick={() => handleSingUp()}
            type="submit"
            className="p-2 bg-cyan-800 text-white rounded cursor-pointer hover:scale-105"
          >
            Sign Up
          </button>
        </div>

        <div className="flex items-center text-md justify-center">
          Already a{" "}
          <div className="relative w-25 h-15 flex items-center">
                     <Image
                       src="/crackora-logo.svg"
                       alt="Crackora"
                       fill
                     />
                   </div>
          user?
          <a
            className="ml-2 text-amber-600 cursor-pointer underline text-sm"
            onClick={() => handleIsLogin(true)}
          >
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
}
