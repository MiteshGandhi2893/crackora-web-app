"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Entrance, Exam } from "../interfaces/entrance-interface";
import { BiCalendar } from "react-icons/bi";
import DatePicker from "react-datepicker";
import { addDays, isAfter } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { examLevels } from "@/data/examlevels";
// import { useNavigate } from "react-router-dom";
import { useExams } from "@/providers/ExamsProvider";
import Image from "next/image";
import { studyPlannerService } from "@/services/StudyPlan.service";
import { useAuth } from "@/providers/AuthProvider";
import { useLoader } from "@/providers/LoadingProvider";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useRouter } from "next/navigation";
/**
 * Chat-style Study Planner Modal
 *
 * - Step-by-step chat inside the existing Dialog
 * - Typing animation for bot replies
 * - Preserves all your existing logic & validations
 *
 * Replace your existing file with this component.
 */

export function StudyPlannerModal(props: any) {
  const { onClose } = props;
  const router = useRouter();
  // const navigate = useNavigate();
  const data = useExams();
  const { user, openAuth, setPostAuthAction } = useAuth();
  const { hideLoader, showLoader } = useLoader();
  const { showMessage } = useSnackbar();

  // Core study plan data (same as original)
  const [studyPlan, setStudyPlan] = useState({
    entrance: undefined as Entrance | undefined,
    exam: undefined as Exam | undefined,
    examDate: null as Date | null,
    prepStartDate: null as Date | null,
    hoursPerWeekday: 4,
    hoursPerWeekend: 4,
    examPrepLevel: "intermediate",
  });

  const [entrances, setEntrances] = useState<Entrance[]>(data.entrances);
  const [examPrepLevels, setExamPrepLevels] = useState(examLevels);
  const [error, setError] = useState("");

  // Chat states
  type Message = { sender: "bot" | "user"; text: string; id?: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<number>(1); // chat step pointer
  const chatRef = useRef<HTMLDivElement | null>(null);

  // helper: scroll to bottom
  const scrollToEnd = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 80);
  };

  // BOT messaging with typing simulation
  const botReply = (text: string, delay = 700) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text }]);
      setIsTyping(false);

      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }, delay);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [step]);

  // Initialize conversation on mount
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);

    setTimeout(() => {
      botReply("Hi! Let's create your study plan 👋", 600);

      setTimeout(() => {
        setStep(1);
        botReply("Which entrance are you preparing for?");
      }, 900);
    }, 200);
  }, []);

  // When step changes, we may want to show follow-ups (kept minimal since botReply is called on actions).
  useEffect(() => {
    scrollToEnd();
  }, [messages, isTyping]);

  // Utility to push user message bubble
  const pushUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    scrollToEnd();
  };

  // Handlers updated to also push chat bubbles and navigate steps
  const handleSelectEntrance = (selectedEntrance: Entrance) => {
    const updatedEntrances = entrances.map((entrance) => ({
      ...entrance,
      isActive: entrance.title === selectedEntrance.title,
    }));
    setEntrances(updatedEntrances);
    setStudyPlan((prevPlan) => ({
      ...prevPlan,
      entrance: { ...selectedEntrance, isActive: true },
      exam: undefined, // clear exam if entrance changed
    }));
    pushUserMessage(selectedEntrance.title);
    // next step: ask for exam
    setTimeout(() => {
      botReply(
        `Great — you picked ${selectedEntrance.title}. Which specific exam?`,
      );
      setStep(2);
    }, 500);
  };

  const handleSelectExam = (exam: Exam) => {
    if (!studyPlan.entrance) return;
    const updatedExams = studyPlan.entrance.exams.map((ex) =>
      ex.title === exam.title
        ? { ...ex, isActive: true }
        : { ...ex, isActive: false },
    );

    setStudyPlan((prev) => ({
      ...prev,
      exam: { ...exam, isActive: true },
      entrance: {
        ...prev.entrance!,
        exams: updatedExams,
      },
    }));
    pushUserMessage(exam.title);

    // next: ask for prep start date
    setTimeout(() => {
      botReply(
        "Nice. When would you like to start your preparation? (pick a date)",
      );
      setStep(3);
    }, 500);
  };

  const handlePrepStartDate = (date: Date | null) => {
    if (!date) return;
    setStudyPlan((prevPlan) => ({ ...prevPlan, prepStartDate: date }));
    pushUserMessage(`Prep start: ${date.toLocaleDateString()}`);

    // ask for exam date
    setTimeout(() => {
      botReply("Cool. When is your target exam date?");
      setStep(4);
    }, 500);
  };

  const handleExamDate = (date: Date | null) => {
    if (!date) return;
    setStudyPlan((prevPlan) => ({ ...prevPlan, examDate: date }));
    pushUserMessage(`Exam date: ${date.toLocaleDateString()}`);

    // ask for weekday hours
    setTimeout(() => {
      botReply(
        "How many hours can you study each weekday (Mon-Fri)? Slide to select.",
      );
      setStep(5);
    }, 500);
  };

  // NOTE: These functions are now used when user CONFIRMS (not on slider change)
  const handleWeekdayHours = (hours: number) => {
    // we already updated state on slider change; still set again to be safe
    setStudyPlan((prevPlan) => ({ ...prevPlan, hoursPerWeekday: hours }));
    pushUserMessage(`${hours} hour${hours > 1 ? "s" : ""} per weekday`);

    // ask for weekend hours
    setTimeout(() => {
      botReply("And how many hours on weekend days (Sat-Sun)?");
      setStep(6);
    }, 450);
  };

  const handleWeekendHours = (hours: number) => {
    setStudyPlan((prevPlan) => ({ ...prevPlan, hoursPerWeekend: hours }));
    pushUserMessage(`${hours} hour${hours > 1 ? "s" : ""} per weekend day`);

    // ask for prep level
    setTimeout(() => {
      botReply(
        `Got it. What's your current preparation level for ${
          studyPlan.exam?.title || "this exam"
        }?`,
      );
      setStep(7);
    }, 450);
  };

  const handleExamPrepLevel = (level: string) => {
    const updated = examPrepLevels.map((l) => ({
      ...l,
      selected: l.name === level,
    }));
    setExamPrepLevels(updated);
    setStudyPlan((prevPlan) => ({
      ...prevPlan,
      examPrepLevel: level.toLowerCase(),
    }));
    pushUserMessage(level);

    // show summary and ask to generate
    setTimeout(() => {
      botReply(
        "Perfect — here's a quick summary. If this looks good, click 'Generate Plan'.",
      );
      setStep(8);
    }, 450);
  };

  // Plan creation - same validations as original
  const handlePlanCreation = async () => {
    const generatePlan = async () => {
      const {
        entrance,
        exam,
        examDate,
        prepStartDate,
        hoursPerWeekday,
        hoursPerWeekend,
      } = studyPlan;

      if (!entrance) return setError("Please select an entrance exam.");
      if (!exam) return setError("Please select a specific exam.");
      if (!prepStartDate)
        return setError("Please select preparation start date.");
      if (!examDate) return setError("Please select your exam date.");
      if (!isAfter(examDate, prepStartDate!))
        return setError("Exam date must be after preparation start date.");
      if (hoursPerWeekday < 1 || hoursPerWeekend < 1)
        return setError("Study hours must be at least 1 per day.");

      setError("");
      sessionStorage.setItem("tempStudyPlan", JSON.stringify(studyPlan));
      pushUserMessage("Generate Plan");
      botReply("Generating your plan... ✅", 600);

      await studyPlannerService.generateStudyPlan(studyPlan);

      setTimeout(() => {
        onClose();
        showMessage("Study plan generated Successfully!");
        router.push("/dashboard");
      }, 900);
    };
    // Check if user is loggedin if not then ask them to login or signup
    // if the status is successful then generate it and take them to the dashboard
    /* 
    TODO: 
      check two flows 
      1. after login 
      2. after signup
    */

    if (!user || !user.username) {
      onClose();
      showLoader();

      setPostAuthAction(() => generatePlan);
      hideLoader();
      openAuth();
      return;
    }

    await generatePlan();
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // small helper to render entrance options in chat
  const renderEntranceOptions = () => {
    if (!entrances || entrances.length === 0) {
      return (
        <div className="text-sm text-gray-500 ml-4">Loading entrances...</div>
      );
    }
    return (
      <div className="flex gap-3 flex-wrap ml-10">
        {entrances.map((entrance, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectEntrance(entrance)}
            className={`px-3 py-2 rounded-md shadow-sm text-sm border ${
              entrance.isActive
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-cyan-900 border-neutral-200"
            } hover:scale-105`}
          >
            {entrance.title}
          </button>
        ))}
      </div>
    );
  };

  const renderExamOptions = () => {
    const exams = studyPlan.entrance?.exams || [];
    if (exams.length === 0) {
      return (
        <div className="text-sm text-gray-500 ml-4">
          No exams found for this entrance.
        </div>
      );
    }
    return (
      <div className="flex gap-3 flex-wrap ml-10">
        {exams.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleSelectExam(ex)}
            className={`px-3 py-2 rounded-md shadow-sm text-sm border ${
              ex.isActive
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-cyan-900 border-neutral-200"
            } hover:scale-105`}
          >
            {ex.title}
          </button>
        ))}
      </div>
    );
  };

  // chat bubble renderer
  const ChatBubble = ({ m }: { m: Message }) => {
    if (m.sender === "bot") {
      return (
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 relative">
            <Image
              src="/monogram.svg"
              alt=""
              className="w-7 h-7 rounded-full mt-1"
              fill
              priority
            />
          </div>

          <div className="text-gray-100 bg-cyan-800  p-3 rounded-2xl max-w-[78%]">
            {m.text}
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-end">
        <div className="bg-amber-600 text-white p-3 rounded-2xl max-w-[78%]">
          {m.text}
        </div>
      </div>
    );
  };

  // small compact summary card for final step
  const SummaryCard = () => {
    return (
      <div className="border p-3 rounded shadow bg-white text-sm">
        <div className="mb-2">
          <strong>Entrance:</strong> {studyPlan.entrance?.title || "-"}
        </div>
        <div className="mb-2">
          <strong>Exam:</strong> {studyPlan.exam?.title || "-"}
        </div>
        <div className="mb-2">
          <strong>Prep Start:</strong>{" "}
          {studyPlan.prepStartDate
            ? studyPlan.prepStartDate.toLocaleDateString()
            : "-"}
        </div>
        <div className="mb-2">
          <strong>Exam Date:</strong>{" "}
          {studyPlan.examDate ? studyPlan.examDate.toLocaleDateString() : "-"}
        </div>
        <div className="mb-2">
          <strong>Weekday hrs:</strong> {studyPlan.hoursPerWeekday}
        </div>
        <div className="mb-2">
          <strong>Weekend hrs:</strong> {studyPlan.hoursPerWeekend}
        </div>
        <div>
          <strong>Level:</strong> {studyPlan.examPrepLevel}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog
        open
        disableEscapeKeyDown
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            height: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
        onClose={(event, reason) => {
          console.log(event);
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          onClose();
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
        }}
      >
        <DialogTitle className="sticky top-0 z-1 border-b border-b-gray-300 h-15 text-white bg-cyan-950 text-lg">
          <div className="flex justify-between ">
            <span>Study Planner</span>
            <span
              className="cursor-pointer hover:scale-105"
              onClick={() => onClose()}
            >
              X
            </span>
          </div>
        </DialogTitle>

        <DialogContent sx={{ overflow: "auto" }}>
          <Box>
            <div className="lg:p-4 flex flex-col gap-4 h-full">
              {/* Chat container */}
              <div
                ref={chatRef}
                className="flex-1 p-3 bg-white rounded shadow-inner"
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {messages.map((m, i) => (
                  <div key={i}>
                    <ChatBubble m={m} />
                    {/* Insert contextual UI after specific bot messages */}
                    {m.sender === "bot" &&
                      m.text.includes("Which entrance") &&
                      step === 1 && (
                        <div className="mt-3">{renderEntranceOptions()}</div>
                      )}

                    {m.sender === "bot" &&
                      m.text.includes("specific exam") &&
                      step === 2 && (
                        <div className="mt-3">{renderExamOptions()}</div>
                      )}

                    {m.sender === "bot" &&
                      m.text.includes("start your preparation") &&
                      step === 3 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <div className="absolute top-5.5 left-12 z-50">
                                <BiCalendar className="w-5 h-5 text-cyan-900" />
                              </div>
                              <DatePicker
                                selected={studyPlan.prepStartDate}
                                onChange={(date: any) =>
                                  handlePrepStartDate(date)
                                }
                                placeholderText="Select date"
                                minDate={addDays(new Date(), 1)}
                                className="bg-white ml-10 mt-3 border h-10 border-gray-300 text-gray-900 text-md rounded-lg ps-10 p-2.5 shadow"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    {m.sender === "bot" &&
                      m.text.includes("target exam date") &&
                      step === 4 && (
                        <div className="mt-3">
                          <div className="relative">
                            <div className="absolute top-5.5 left-12 z-50">
                              <BiCalendar className="w-5 h-5 text-cyan-900" />
                            </div>
                            <DatePicker
                              selected={studyPlan.examDate}
                              onChange={(date: any) => handleExamDate(date)}
                              placeholderText="Select date"
                              minDate={
                                studyPlan.prepStartDate
                                  ? addDays(studyPlan.prepStartDate, 7)
                                  : addDays(new Date(), 7)
                              }
                              className="bg-white ml-10 mt-3 border h-10 border-gray-300 text-gray-900 text-md rounded-lg ps-10 p-2.5 shadow"
                            />
                          </div>
                        </div>
                      )}

                    {m.sender === "bot" &&
                      m.text.includes("weekday") &&
                      step === 5 && (
                        <div className="mt-3 ml-10">
                          {/* Slider updates local studyPlan but DOES NOT advance step */}
                          <input
                            id="studyHoursWeekday"
                            type="range"
                            min={2}
                            max={8}
                            step={1}
                            value={studyPlan.hoursPerWeekday}
                            onChange={(e) =>
                              setStudyPlan((prev) => ({
                                ...prev,
                                hoursPerWeekday: Number(e.target.value),
                              }))
                            }
                            className="w-full"
                          />
                          <div className="text-sm mt-2">
                            {studyPlan.hoursPerWeekday} hour(s) per weekday
                          </div>

                          {/* Confirm Button */}
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() =>
                                handleWeekdayHours(studyPlan.hoursPerWeekday)
                              }
                              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                // Optional: Reset to default or let them close
                                setStudyPlan((prev) => ({
                                  ...prev,
                                  hoursPerWeekday: 4,
                                }));
                              }}
                              className="px-4 py-2 rounded border"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      )}

                    {m.sender === "bot" &&
                      m.text.includes("weekend") &&
                      step === 6 && (
                        <div className="mt-3 ml-10">
                          <input
                            id="studyHoursWeekend"
                            type="range"
                            min={2}
                            max={8}
                            step={1}
                            value={studyPlan.hoursPerWeekend}
                            onChange={(e) =>
                              setStudyPlan((prev) => ({
                                ...prev,
                                hoursPerWeekend: Number(e.target.value),
                              }))
                            }
                            className="w-full"
                          />
                          <div className="text-sm mt-2">
                            {studyPlan.hoursPerWeekend} hour(s) per weekend day
                          </div>

                          {/* Confirm Button */}
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() =>
                                handleWeekendHours(studyPlan.hoursPerWeekend)
                              }
                              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                setStudyPlan((prev) => ({
                                  ...prev,
                                  hoursPerWeekend: 4,
                                }))
                              }
                              className="px-4 py-2 rounded border"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      )}

                    {m.sender === "bot" &&
                      m.text.includes("preparation level") &&
                      step === 7 && (
                        <div className="mt-3 flex gap-2 flex-wrap ml-10">
                          {examPrepLevels.map((level, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleExamPrepLevel(level.name)}
                              className={`px-3 py-2 rounded-md border ${
                                level.selected
                                  ? "bg-amber-600 text-white border-amber-600"
                                  : "bg-white text-cyan-900 border-neutral-200"
                              }`}
                            >
                              {level.name}
                            </button>
                          ))}
                        </div>
                      )}

                    {m.sender === "bot" &&
                      m.text.includes("summary") &&
                      step === 8 && (
                        <div className="mt-3">
                          <SummaryCard />
                        </div>
                      )}
                  </div>
                ))}

                {/* typing indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="relative w-7 h-7 overflow-hidden rounded-full shrink-0">
                      <Image
                        src="/monogram.svg"
                        alt=""
                        fill
                        draggable={false}
                        className="object-contain select-none"
                      />
                    </div>

                    <div className="bg-gray-100 p-2 rounded-2xl">
                      <div className="flex gap-1 items-center">
                        <div className="animate-bounce rounded-full w-2 h-2 bg-gray-400" />
                        <div className="animate-bounce rounded-full w-2 h-2 bg-gray-400 delay-75" />
                        <div className="animate-bounce rounded-full w-2 h-2 bg-gray-400 delay-150" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error & final action area */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  {error && (
                    <span className="text-red-700">Error: {error}</span>
                  )}
                </div>

                {/* Show Generate Plan button only at final step */}
                <div className="flex gap-2 items-center">
                  {step === 8 && (
                    <button
                      onClick={() => handlePlanCreation()}
                      className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Generate Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div ref={bottomRef} />
          </Box>
        </DialogContent>

        <DialogActions className="shadow-xl py-2 h-15 gap-2">
          <div className="justify-between flex w-full px-5 items-center">
            <div />
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
