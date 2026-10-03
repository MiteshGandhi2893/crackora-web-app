"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { emailService } from "@/services/email.service";
import { useLoader } from "@/providers/LoadingProvider";
import { useSnackbar } from "@/providers/SnackbarProvider";


interface RequestCallbackProps {
  sourcePage: "exam-info" | "paperset";
  sourceSlug: string;
}

export function RequestCallback({ sourcePage, sourceSlug }: RequestCallbackProps) {
  const { showLoader, hideLoader } = useLoader();
  const { showMessage } = useSnackbar();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({});

  const resetForm = () => {
    setFormData({ fullname: "", email: "", phone: "", message: "" });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.fullname.trim())
      newErrors.fullname = "Full Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    showLoader();
    const res = await emailService.sendCallbackEmail({
      ...formData,
      sourcePage,
      sourceSlug,
      sourceUrl: typeof window !== "undefined" ? window.location.href : "",
    });
    hideLoader();

    if (res.data?.success) {
      showMessage(res.data?.message || "We'll call you back soon!", "success");
      resetForm();
    } else {
      showMessage(res.data?.message || "Something went wrong.", "error");
    }
  };

  return (
    <div className="w-full h-full border border-gray-200 bg-white shadow-xs shadow-amber-500 p-3 rounded-xl">
      <h1 className="text-center text-xl font-semibold text-amber-700">
        Request Callback
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2 py-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950 text-sm">Full Name</label>
          <input
            name="fullname"
            onChange={handleChange}
            value={formData.fullname}
            type="text"
            className="outline-0 border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-600"
            placeholder="Enter your first and last name"
          />
          {errors.fullname && (
            <span className="text-red-700 text-xs ml-1">{errors.fullname}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950 text-sm">Email ID</label>
          <input
            name="email"
            value={formData.email}
            type="email"
            onChange={handleChange}
            className="outline-0 border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-600"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <span className="text-red-700 text-xs ml-1">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950 text-sm opacity-80">
            Phone Number
          </label>
          <div className="flex w-full gap-2 items-center">
            <span className="text-sm text-amber-600 font-medium">+91</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="outline-0 w-full border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-600"
              placeholder="10-digit phone number"
            />
          </div>
          {errors.phone && (
            <span className="text-red-700 text-xs ml-1">{errors.phone}</span>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950 text-sm opacity-80">
            Message <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={2}
            className="outline-0 w-full border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm text-gray-600 resize-none"
            placeholder="What would you like to talk about?"
          />
        </div>

        <button
          type="submit"
          className="w-full text-center border border-amber-700 rounded shadow text-white cursor-pointer text-base bg-amber-700 mt-2 py-1.5 hover:bg-amber-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
