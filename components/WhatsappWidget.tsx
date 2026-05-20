"use client";

import { useState } from "react";
import { BiLogoWhatsapp } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const chatOptions = [
  {
    label: "📘 MAH MCA CET Preparation",
    message:
      "Hi Crackora, I need help with MAH MCA CET preparation.",
  },
  {
    label: "🎯 Career Guidance",
    message:
      "Hi Crackora, I need career guidance regarding MCA and placements.",
  },
  {
    label: "🏫 College Selection",
    message:
      "Hi Crackora, I need help selecting colleges for MCA admission.",
  },
  {
    label: "📝 Entrance Exams",
    message:
      "Hi Crackora, I need help regarding MCA entrance exams.",
  },
  {
    label: "💰 Fees & Courses",
    message:
      "Hi Crackora, I want details about fees and available courses.",
  },
  {
    label: "🧪 Mock Tests",
    message:
      "Hi Crackora, I need help with mock tests.",
  },
  {
    label: "📊 CAP Rounds",
    message:
      "Hi Crackora, I need help with CAP rounds and counselling.",
  },
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  const phone = "919004782989";

  const sendMessage = (message: string) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <>
      {/* Chat Popup */}
      {open && (
        <div
          className="
            fixed bottom-24 right-5 z-50
            w-80 max-w-[calc(100vw-2rem)]
            bg-white rounded-2xl shadow-2xl
            overflow-hidden border border-gray-200
            animate-in fade-in slide-in-from-bottom-5 duration-300
          "
        >
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                Crackora Support
              </h3>

              <p className="text-sm opacity-90">
                Typically replies instantly
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              <IoClose size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-600">
              Hi 👋 How can we help you today?
            </p>

            {chatOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => sendMessage(option.message)}
                className="
                  w-full text-left p-3 rounded-xl
                  bg-gray-100 text-cyan-900
                  text-sm cursor-pointer
                  hover:bg-gray-200 transition
                "
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-5 right-5 z-50
          bg-green-500 text-white
          p-4 rounded-full shadow-xl
          hover:scale-105 transition
          cursor-pointer
        "
      >
        <BiLogoWhatsapp size={22} />
      </button>
    </>
  );
}