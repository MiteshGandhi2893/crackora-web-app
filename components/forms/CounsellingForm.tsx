"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Image from "next/image";
import { State, City, IState, ICity } from "country-state-city";
import { useExams } from "@/providers/ExamsProvider";
import { Exam } from "@/interfaces/entrance-interface";

export function CounsellingForm() {
  const entrances = useExams();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
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

  /* ------------------ Load states ------------------ */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  /* ------------------ Input change ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ------------------ State change ------------------ */
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const stateObj = states.find((s) => s.isoCode === isoCode);

    setSelectedStateIso(isoCode);
    setCities(City.getCitiesOfState("IN", isoCode));

    setFormData({
      ...formData,
      state: stateObj?.name || "",
      city: "",
    });
  };

  const handleEntranceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const entrance = entrances.find((v) => v.id === e.target.value);
    setFormData({ ...formData, entrance: entrance?.title || "" });
    setExams(entrance?.exams);  
  };

  /* ------------------ City change ------------------ */
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setFormData({ ...formData, city: cityName });
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!formData.fullname.trim())
      newErrors.fullname = "Full Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.entrance) newErrors.entrance = "Entrance is required.";
    if (!formData.exam) newErrors.exam = "Exam is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("FORM DATA 👉", formData);
    }
  };

  return (
    <div className="w-full border border-gray-200 bg-white/70 shadow-lg p-4 rounded-xl text-cyan-950">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-32 h-12">
          <Image src="/crackora-logo.svg" alt="crackora counselling" fill />
        </div>
        <h3 className="text-xl font-semibold text-amber-700">
          Free Counselling
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          {" "}
          <input
            name="fullname"
            onChange={handleChange}
            value={formData.fullname}
            type="text"
            className="outline-0 border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-800"
            placeholder="Enter your First and Last name"
          />{" "}
          {errors.fullname && (
            <span className="text-red-700 text-xs ml-1 mt-1">
              {" "}
              {errors.fullname}{" "}
            </span>
          )}{" "}
        </div>
        <div className="flex flex-col gap-1">
          {" "}
          <input
            name="email"
            value={formData.email}
            type="text"
            onChange={handleChange}
            className="outline-0 border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-800"
            placeholder="Enter your Email ID"
          />{" "}
          {errors.email && (
            <span className="text-red-700 text-xs ml-1 mt-1">
              {" "}
              {errors.email}{" "}
            </span>
          )}{" "}
        </div>{" "}
        {/* Phone */}{" "}
        <div className="flex flex-col gap-1">
          {" "}
          <div className="flex w-full gap-2 items-center">
            {" "}
            <span className="text-sm text-cyan-900 font-semibold">
              +91
            </span>{" "}
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="outline-0 w-full border p-2 border-gray-200 rounded shadow bg-gray-50 text-sm h-8 text-gray-800"
              placeholder="Enter your phone number"
            />{" "}
          </div>{" "}
          {errors.phone && (
            <span className="text-red-700 text-xs ml-1 mt-1">
              {" "}
              {errors.phone}{" "}
            </span>
          )}{" "}
        </div>
        {/* State + City */}
        <div className="grid grid-cols-2 gap-3">
          <select
            className="select border text-sm border-gray-300 p-2 bg-white rounded"
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
            className="select border text-sm border-gray-300 p-2 bg-white rounded"
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
        <div className="grid grid-cols-2 gap-3">
          <select
            className="select border border-gray-300 text-sm p-2 bg-white rounded"
            value={selectedStateIso}
            onChange={handleEntranceChange}
          >
            <option value="">Select Entrance</option>
            {entrances.map((entrance, index) => (
              <option key={index} value={entrance.id}>
                {entrance.title}
              </option>
            ))}
          </select>

          <select
            className="select border border-gray-300 p-2 text-sm bg-white rounded"
            value={formData.exam}
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
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-amber-700 text-white rounded py-2 hover:bg-amber-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

/* Utility Tailwind classes */
