"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export function RequestCallback() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  return (
    <>
      <div className="w-full h-full border border-gray-200 bg-white shadow-lg p-3 rounded-xl">
        <h1 className="text-center text-xl font-semibold text-amber-700">
          Request Callback
        </h1>
        <form onSubmit={handleSubmit} className=" flex flex-col gap-3 p-2 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-cyan-950 text-sm ">Full Name</label>
            <input
              name="fullname"
              onChange={handleChange}
              value={formData.fullname}
              type="text"
              className="outline-0 border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-600"
              placeholder="Enter your first and last name"
            />
              {errors.fullname && (
              <span className="text-red-700 text-xs ml-1 mt-1">
                {errors.fullname}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cyan-950 text-sm ">Email Id</label>
            <input
              name="email"
              value={formData.email}
              type="text"
              onChange={handleChange}
              className="outline-0 border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-600"
              placeholder="Enter your first and last name"
            />
            {errors.email && (
              <span className="text-red-700 text-xs ml-1 mt-1">
                {errors.email}
              </span>
            )}
          </div>
          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-cyan-950 text-sm opacity-80">
              Phone Number
            </label>
            <div className="flex w-full gap-2 items-center">
              <span className="text-sm text-amber-600">+91</span>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="text"
                className="outline-0 w-full border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-600"
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && (
              <span className="text-red-700 text-xs ml-1 mt-1">
                {errors.phone}
              </span>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full text-center border border-amber-700 rounded shadow text-white cursor-pointer text-base bg-amber-700 mt-5 py-1"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
