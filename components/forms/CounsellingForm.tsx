"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useExams } from "@/providers/ExamsProvider";
import { Exam } from "@/interfaces/entrance-interface";
import { emailService } from "@/services/email.service";
import { useLoader } from "@/providers/LoadingProvider";
import { useSnackbar } from "@/providers/SnackbarProvider";

const CATEGORIES = [
  { value: "MCA Entrance Prep",    label: "MCA Entrance Prep",  icon: "🎯" },
  { value: "College & Admissions", label: "College & Admissions", icon: "🏫" },
  { value: "MCA Academics",        label: "MCA Academics",       icon: "📖" },
  { value: "Skills & Placement",   label: "Skills & Placement",  icon: "⚡" },
];

export function CounsellingForm() {
  const data = useExams();
  const { showLoader, hideLoader } = useLoader();
  const { showMessage } = useSnackbar();
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
    category: "", // replaces "entrance" pill selection
    exam: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({});

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      phone: "",
      state: "",
      city: "",
      category: "",
      exam: "",
      message: "",
    });
    setSelectedStateIso("");
    setCities([]);
    setExams(undefined);
    setErrors({});
  };

  /* ------------------ Load states ------------------ */
  useEffect(() => {
    const loadStates = async () => {
      const { State } = await import("india-state-city");
      setStates(State.getAllStates());
    };
    loadStates();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const stateObj = states.find((s) => s.isoCode === isoCode);
    setSelectedStateIso(isoCode);
    const { City } = await import("india-state-city");
    setCities(City.getCitiesOfState(isoCode));
    setFormData((prev) => ({ ...prev, state: stateObj?.name || "", city: "" }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, city: e.target.value }));
  };

  /* ------------------ Category pill select ------------------ */
  const handleCategorySelect = (value: string) => {
    // If switching away from MCA Entrance, clear the exam
    const newExam = value === "MCA Entrance" ? formData.exam : "";
    setFormData((prev) => ({ ...prev, category: value, exam: newExam }));

    if (value === "MCA Entrance") {
      // Auto-set exams from first entrance group for now
      setExams(data.entrances?.[0]?.exams);
    } else {
      setExams(undefined);
    }
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, exam: e.target.value }));
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.fullname.trim()) newErrors.fullname = "Full Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (formData.category === "MCA Entrance" && !formData.exam)
      newErrors.exam = "Please select an exam.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    showLoader();
    const res = await emailService.sendCounsellingEmail(formData);
    hideLoader();

    if (res.data?.success) {
      showMessage(res.data?.message, "success");
      resetForm();
    } else {
      showMessage(res.data?.message || "Something went wrong.", "error");
    }
  };

  return (
    <div className="w-full border border-gray-200 bg-[#f8f7f4]/80 shadow-lg p-4 rounded-xl text-cyan-950">
      <h3 className="sm:text-xl text-[18px] font-semibold text-amber-700 mb-4">
        Free Counselling
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <input
            name="fullname"
            onChange={handleChange}
            value={formData.fullname}
            type="text"
            className="border border-gray-200 p-2 rounded bg-gray-50 text-[13px] h-8"
            placeholder="Enter your First and Last name"
          />
          {errors.fullname && (
            <span className="text-red-700 text-xs">{errors.fullname}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <input
            name="email"
            value={formData.email}
            type="email"
            onChange={handleChange}
            className="border border-gray-200 p-2 rounded bg-gray-50 text-[13px] h-8"
            placeholder="Enter your Email ID"
          />
          {errors.email && (
            <span className="text-red-700 text-xs">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-sm">+91</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="w-full border border-gray-200 p-2 rounded bg-gray-50 text-[13px] h-8"
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && (
            <span className="text-red-700 text-xs">{errors.phone}</span>
          )}
        </div>

        {/* State + City */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <select
              className="border border-gray-200 p-2 h-8 text-[13px] rounded bg-white"
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
            {errors.state && (
              <span className="text-red-700 text-xs">{errors.state}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <select
              className="border border-gray-200 p-2 h-8 text-[13px] rounded bg-white"
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
            {errors.city && (
              <span className="text-red-700 text-xs">{errors.city}</span>
            )}
          </div>
        </div>

        {/* ── Category pills ── */}
        <div className="flex flex-col gap-2 mt-5">
          <span className="text-[12px] text-cyan-900 font-semibold">
            I need help with
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategorySelect(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer
                  ${
                    formData.category === cat.value
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-white text-cyan-900 border-gray-200 hover:border-amber-400"
                  }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          {errors.category && (
            <span className="text-red-700 text-xs">{errors.category}</span>
          )}
        </div>

        {/* ── Exam dropdown — only shown for MCA Entrance ── */}
        {formData.category === "MCA Entrance" && (
          <div className="flex flex-col gap-1">
            <select
              className="border border-gray-200 p-2 h-8 text-[13px] rounded bg-white w-full"
              value={formData.exam}
              onChange={handleExamChange}
            >
              <option value="">Select Exam</option>
              {data.entrances.map((entrance) =>
                entrance.exams?.map((exam) => (
                  <option key={exam.title} value={exam.title}>
                    {exam.title}
                  </option>
                ))
              )}
            </select>
            {errors.exam && (
              <span className="text-red-700 text-xs">{errors.exam}</span>
            )}
          </div>
        )}

        {/* Message */}
        <div className="flex flex-col gap-1">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={2}
            className="border border-gray-200 p-2 rounded bg-gray-50 text-[13px] resize-none"
            placeholder="Anything specific you'd like help with? (optional)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 text-white rounded py-1.5 hover:bg-amber-700 transition cursor-pointer text-sm font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  );
}