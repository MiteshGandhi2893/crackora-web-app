"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useExams } from "@/providers/ExamsProvider";
import { Exam } from "@/interfaces/entrance-interface";
import { Logo } from "../header/Logo";

export function CounsellingForm() {
  const data = useExams();

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [exams, setExams] = useState<Exam[]>();
  const [selectedStateIso, setSelectedStateIso] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    entrance: "",
    exam: "",
  });

  const [errors, setErrors] = useState<any>({});

  /* ------------------ Load states (LAZY IMPORT) ------------------ */
  useEffect(() => {
    const loadStates = async () => {
      const { State } = await import("country-state-city");
      setStates(State.getStatesOfCountry("IN"));
    };

    loadStates();
  }, []);

  /* ------------------ Input change ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------ State change (LAZY IMPORT) ------------------ */
  const handleStateChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const isoCode = e.target.value;
    const stateObj = states.find((s) => s.isoCode === isoCode);

    setSelectedStateIso(isoCode);

    const { City } = await import("country-state-city");
    setCities(City.getCitiesOfState("IN", isoCode));

    setFormData((prev) => ({
      ...prev,
      state: stateObj?.name || "",
      city: "",
    }));
  };

  /* ------------------ Entrance change ------------------ */
  const handleEntranceChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const entrance = data.entrances.find(
      (v) => v.id === e.target.value
    );

    setFormData((prev) => ({
      ...prev,
      entrance: entrance?.title || "",
      exam: "",
    }));

    setExams(entrance?.exams);
  };

  /* ------------------ City change ------------------ */
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setFormData((prev) => ({ ...prev, city: cityName }));
  };

  /* ------------------ Exam change ------------------ */
  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const examName = e.target.value;
    setFormData((prev) => ({ ...prev, exam: examName }));
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.fullname.trim())
      newErrors.fullname = "Full Name is required.";
    if (!formData.email.trim())
      newErrors.email = "Email is required.";
    if (!formData.phone.trim())
      newErrors.phone = "Phone is required.";
    if (!formData.state)
      newErrors.state = "State is required.";
    if (!formData.city)
      newErrors.city = "City is required.";
    if (!formData.entrance)
      newErrors.entrance = "Entrance is required.";
    if (!formData.exam)
      newErrors.exam = "Exam is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("FORM DATA 👉", formData);
    }
  };

  return (
    <div className="w-full border border-gray-200 bg-white/70 shadow-lg p-4 rounded-xl text-cyan-950">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <Logo />
        <h3 className="sm:text-xl text-[18px] font-semibold text-amber-700">
          Free Counselling
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <input
          name="fullname"
          onChange={handleChange}
          value={formData.fullname}
          type="text"
          className="border p-2 rounded bg-gray-50 text-[13px] h-8"
          placeholder="Enter your First and Last name"
        />
        {errors.fullname && (
          <span className="text-red-700 text-xs">
            {errors.fullname}
          </span>
        )}

        {/* Email */}
        <input
          name="email"
          value={formData.email}
          type="text"
          onChange={handleChange}
          className="border p-2 rounded bg-gray-50 text-[13px] h-8"
          placeholder="Enter your Email ID"
        />
        {errors.email && (
          <span className="text-red-700 text-xs">
            {errors.email}
          </span>
        )}

        {/* Phone */}
        <div className="flex gap-2 items-center">
          <span className="font-semibold">+91</span>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="text"
            className="w-full border p-2 rounded bg-gray-50 text-[13px] h-8"
            placeholder="Enter your phone number"
          />
        </div>
        {errors.phone && (
          <span className="text-red-700 text-xs">
            {errors.phone}
          </span>
        )}

        {/* State + City */}
        <div className="grid grid-cols-2 gap-3">
          <select
            className="border p-2 h-8 text-[13px] rounded"
            value={selectedStateIso}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 h-8 text-[13px] rounded"
            value={formData.city}
            onChange={handleCityChange}
            disabled={!cities.length}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Entrance + Exam */}
        <div className="grid grid-cols-2 gap-3">
          <select
            className="border p-2 h-8 text-[13px] rounded"
            value={formData.entrance}
            onChange={handleEntranceChange}
          >
            <option value="">Select Entrance</option>
            {data.entrances.map((entrance) => (
              <option key={entrance.id} value={entrance.id}>
                {entrance.title}
              </option>
            ))}
          </select>

          <select
            className="border p-2 h-8 text-[13px] rounded"
            value={formData.exam}
            onChange={handleExamChange}
            disabled={!exams?.length}
          >
            <option value="">Select Exam</option>
            {exams?.map((exam) => (
              <option key={exam.title} value={exam.title}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-700 text-white rounded py-1 hover:bg-amber-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}