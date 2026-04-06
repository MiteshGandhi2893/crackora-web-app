/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { authService } from "@/services/Authentication.service";
import { useLoader } from "@/providers/LoadingProvider";
import { useAuth, User } from "@/providers/AuthProvider";
import { TermsAndConditions } from "@/components/login/TermsAndConditions";

// ── Eye icons ─────────────────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosed() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ── Password rules ────────────────────────────────────────────────────────────
interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const PASSWORD_RULES: Rule[] = [
  { label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "Number", test: (v) => /[0-9]/.test(v) },
  { label: "Symbol (!@#$…)", test: (v) => /[^A-Za-z0-9\s]/.test(v) },
  { label: "No spaces", test: (v) => v.length > 0 && !/\s/.test(v) },
  { label: "8 – 12 characters", test: (v) => v.length >= 8 && v.length <= 12 },
];

function RuleItem({ passed, label }: { passed: boolean; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        className={`flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold shrink-0 transition-all duration-200 ${passed ? "bg-emerald-500 text-white scale-110" : "bg-gray-200 text-gray-400"}`}
      >
        {passed ? "✓" : "·"}
      </span>
      <span
        className={`text-[11px] transition-colors duration-200 ${passed ? "text-emerald-600 font-medium" : "text-gray-400"}`}
      >
        {label}
      </span>
    </li>
  );
}

// ── Password input with eye toggle ────────────────────────────────────────────
function PasswordInput({
  name,
  value,
  placeholder,
  onChange,
  onBlur,
}: {
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative flex items-center">
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={visible ? "text" : "password"}
        className="outline-0 border p-2 pr-9 border-gray-200 rounded-md bg-white text-sm h-8 text-gray-600 w-full"
        placeholder={placeholder}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2.5 text-gray-400 hover:text-amber-600 transition-colors cursor-pointer"
      >
        {visible ? <EyeOpen /> : <EyeClosed />}
      </button>
    </div>
  );
}

// ── OTP input — 6 individual boxes ───────────────────────────────────────────
function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const updated = [...digits];
      updated[i] = " ";
      onChange(updated.join("").trimEnd());
      if (i > 0) inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const updated = [...digits];
    updated[i] = char;
    onChange(updated.join("").replace(/ /g, ""));
    if (i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted) {
      onChange(pasted);
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-start">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === " " ? "" : digits[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-9 h-9 text-center border border-gray-200 rounded-md bg-white text-sm font-bold text-cyan-900 outline-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-all"
        />
      ))}
    </div>
  );
}

// ── Countdown timer ───────────────────────────────────────────────────────────
function useCountdown(seconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!active) {
      setRemaining(seconds);
      return;
    }
    setRemaining(seconds);
    const id = setInterval(
      () =>
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(id);
            return 0;
          }
          return r - 1;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [active, seconds]);
  return remaining;
}

// ── Main SignUp ───────────────────────────────────────────────────────────────
export function SignUp(props: any) {
  const { handleIsLogin, sendMessage, onSuccess, isTermsShown } = props;
  const { showLoader, hideLoader } = useLoader();
  const { setUser } = useAuth();

  const [showTerms, setShowTerms] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Email OTP state
  const [emailBlurred, setEmailBlurred] = useState(false); // has user left the email field?
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

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

  const countdown = useCountdown(120, otpSent);

  // Derived password checks
  const passwordRulesPassed = PASSWORD_RULES.map((r) =>
    r.test(formData.password),
  );
  const allRulesPassed = passwordRulesPassed.every(Boolean);
  const passedCount = passwordRulesPassed.filter(Boolean).length;

  const strengthLabel = !formData.password
    ? null
    : passedCount <= 2
      ? { text: "Weak", cls: "text-red-500" }
      : passedCount <= 4
        ? { text: "Fair", cls: "text-amber-500" }
        : allRulesPassed
          ? { text: "Strong ✓", cls: "text-emerald-600" }
          : { text: "Almost", cls: "text-amber-500" };

  const strengthBarColor =
    passedCount <= 2
      ? "bg-red-400"
      : passedCount <= 4
        ? "bg-amber-400"
        : "bg-emerald-500";

  const emailValid = /\S+@\S+\.\S+/.test(formData.email);

  // Show the Send OTP button only after the user has blurred the field
  // AND the email is syntactically valid AND not yet verified
  const showSendOtpBtn = emailBlurred && emailValid && !emailVerified;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordTouched(true);
    if (name === "email") {
      // Reset OTP state if they edit the email
      setEmailVerified(false);
      setOtpSent(false);
      setOtpValue("");
      setOtpError("");
      // Keep emailBlurred true so the button re-appears as soon as valid again
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "email") setEmailBlurred(true);

    switch (name) {
      case "fullname":
        if (!value.trim()) error = "Full Name is required.";
        break;
      case "email":
        if (!value.trim()) error = "Email is required.";
        else if (!emailValid) error = "Enter a valid email address.";
        break;
      case "phone":
        if (!value.trim()) error = "Phone number is required.";
        else if (!/^\d{10}$/.test(value))
          error = "Enter a valid 10-digit phone number.";
        break;
      case "password":
        if (!value) error = "Password is required.";
        else if (!allRulesPassed)
          error = "Password does not meet all requirements.";
        break;
      case "confirmPassword":
        if (!value) error = "Confirm your password.";
        else if (value !== formData.password) error = "Passwords do not match.";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const e: any = {};
    if (!formData.fullname.trim()) e.fullname = "Full Name is required.";
    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!emailValid) e.email = "Enter a valid email address.";
    if (!formData.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone))
      e.phone = "Enter a valid 10-digit phone number.";
    if (!formData.password) e.password = "Password is required.";
    else if (!allRulesPassed)
      e.password = "Password does not meet all requirements.";
    if (!formData.confirmPassword) e.confirmPassword = "Confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Send OTP ────────────────────────────────────────────────────────────────
  // ── Remove this state entirely ────────────────────────────────────────────────
  // const [otpError, setOtpError] = useState("");

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!emailValid || otpSending) return;
    setOtpSending(true);
    setErrors((prev) => ({ ...prev, email: "" })); // clear before sending
    try {
      const res = await authService.sendOtp(formData.email);
      if (!res.success)
        throw new Error(res.data?.message || res.error || "Failed to send OTP");
      setOtpSent(true);
      setOtpValue("");
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, email: err.message })); // show under email field
    } finally {
      setOtpSending(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otpValue.replace(/ /g, "").length !== 6 || otpVerifying) return;
    setOtpVerifying(true);
    setErrors((prev) => ({ ...prev, email: "" })); // clear before verifying
    try {
      const res = await authService.verifyOtp(
        formData.email,
        otpValue.replace(/ /g, ""),
      );
      if (!res.success)
        throw new Error(res.data?.message || "Verification failed");
      setEmailVerified(true);
      setOtpSent(false);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, email: err.message })); // show under email field
      setOtpValue("");
    } finally {
      setOtpVerifying(false);
    }
  };
  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSignUpClick = () => {
    setPasswordTouched(true);
    if (!validateAll()) return;
    if (!emailVerified) {
      setErrors((prev) => ({
        ...prev,
        email: "Please verify your email first.",
      }));
      return;
    }
    setShowTerms(true);
    isTermsShown(true);
  };

  const handleAgree = async (agreedOn: Date) => {
    const signUpPayload = {
      fullName: formData.fullname,
      email: formData.email,
      phoneNumber: formData.phone,
      password: formData.password,
      agreedOn: agreedOn.toISOString(),
      emailVerified,
    };

    showLoader();
    const result = await authService.signUp(signUpPayload);
    hideLoader();
    isTermsShown(false);

    if (result.error) {
      // Stay on sign-up, show the error — do NOT call onSuccess
      sendMessage({ text: result.error, severity: "error" });
      setShowTerms(false);
      return; // <── bail before onSuccess
    }

    // Happy path — user was created
    setUser(result.user as User);
    onSuccess(result.user as User);
    sendMessage({ text: "Sign Up Successful", severity: "success" });
  };

  const handleDisagree = () => {
    setShowTerms(false);
    isTermsShown(false);
  };

  if (showTerms) {
    return (
      <TermsAndConditions onAgree={handleAgree} onDisagree={handleDisagree} />
    );
  }

  const otpComplete = otpValue.replace(/ /g, "").length === 6;

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUpClick();
        }}
        className="w-[90%] flex flex-col gap-4"
      >
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm">Full Name</label>
          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            placeholder="Enter your first and last name"
            className="outline-0 border p-2 border-gray-200 rounded-md bg-white text-sm h-8 text-gray-600"
          />
          {errors.fullname && (
            <span className="text-red-700 text-xs ml-1">{errors.fullname}</span>
          )}
        </div>

        {/* ── Email ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950 text-sm">Email</label>

          <div className="flex items-center gap-2">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              placeholder="Enter your email"
              disabled={emailVerified}
              className={`outline-0 border p-2 border-gray-200 rounded-md bg-white text-sm h-8 text-gray-600 flex-1 transition-all
                ${emailVerified ? "bg-emerald-50 border-emerald-300 text-emerald-700" : ""}`}
            />

            {/* ✓ Verified badge */}
            {emailVerified && (
              <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold shrink-0">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                Verified
              </span>
            )}

            {/* Send OTP / Resend — only after valid blur */}
            {showSendOtpBtn && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || (otpSent && countdown > 0)}
                className={`shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-semibold transition-all ${
                  otpSending || (otpSent && countdown > 0)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-amber-600 text-white hover:bg-amber-500 cursor-pointer"
                }`}
              >
                {otpSending ? (
                  <>
                    <Spinner /> Sending…
                  </>
                ) : otpSent && countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : otpSent ? (
                  "Resend OTP"
                ) : (
                  "Send OTP"
                )}
              </button>
            )}
          </div>

          {errors.email && (
            <span className="text-red-700 text-xs ml-1">{errors.email}</span>
          )}

          {/* ── OTP entry panel ─────────────────────────────────────────────── */}
          {/* ── OTP entry panel ─────────────────────────────────────────────── */}
          {otpSent && !emailVerified && (
            <div className="mt-1 bg-white border border-amber-200 rounded-lg px-3 py-3 shadow-sm space-y-2.5">
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-cyan-900">
                  {formData.email}
                </span>
              </p>

              <OtpInput value={otpValue} onChange={setOtpValue} />

              {/* ── deleted: {otpError && <p ...>{otpError}</p>} ── */}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={!otpComplete || otpVerifying}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  otpComplete && !otpVerifying
                    ? "bg-cyan-900 text-white hover:bg-cyan-800 cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {otpVerifying ? (
                  <>
                    <Spinner /> Verifying…
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm">Phone Number</label>
          <div className="flex w-full gap-2 items-center">
            <span className="text-sm text-amber-600">+91</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              placeholder="Enter your phone number"
              className="outline-0 border p-2 border-gray-200 rounded-md bg-white text-sm h-8 text-gray-600 w-full"
            />
          </div>
          {errors.phone && (
            <span className="text-red-700 text-xs ml-1">{errors.phone}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-cyan-950 text-sm">Password</label>
          <PasswordInput
            name="password"
            value={formData.password}
            placeholder="Enter password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && !passwordTouched && (
            <span className="text-red-700 text-xs ml-1">{errors.password}</span>
          )}

          {passwordTouched && (
            <div className="mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Password requirements
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {PASSWORD_RULES.map((rule, i) => (
                  <RuleItem
                    key={rule.label}
                    passed={passwordRulesPassed[i]}
                    label={rule.label}
                  />
                ))}
              </ul>
              <div className="mt-2.5 flex gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${passedCount > i ? strengthBarColor : "bg-gray-200"}`}
                  />
                ))}
              </div>
              {strengthLabel && (
                <p
                  className={`text-[10px] mt-1 text-right font-semibold ${strengthLabel.cls}`}
                >
                  {strengthLabel.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label className="text-cyan-950 text-sm">Confirm Password</label>
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Re-enter password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.confirmPassword && (
            <span className="text-red-700 text-xs ml-1">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Submit — visually disabled until email verified */}
        <div className="flex flex-col">
          <button
            type="submit"
            disabled={!emailVerified}
            className={`p-2 text-white rounded transition-all text-sm font-semibold ${
              emailVerified
                ? "bg-amber-600 hover:scale-105 cursor-pointer"
                : "bg-amber-600 text-amber-400 cursor-not-allowed opacity-50"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="flex items-center text-md justify-center">
          Already a user?
          <a
            className="ml-2 text-amber-600 cursor-pointer underline text-md"
            onClick={() => handleIsLogin(true)}
          >
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
}
