"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { authService } from "@/services/Authentication.service";
import { useLoader } from "@/providers/LoadingProvider";
import { useAuth, User } from "@/providers/AuthProvider";
import { TermsAndConditions } from "@/components/login/TermsAndConditions";

// ── Icons ─────────────────────────────────────────────────────────────────────

function EyeOpen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ── Password rules ────────────────────────────────────────────────────────────

interface Rule { label: string; test: (v: string) => boolean; }

const PASSWORD_RULES: Rule[] = [
  { label: "Uppercase letter",  test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase letter",  test: (v) => /[a-z]/.test(v) },
  { label: "Number",            test: (v) => /[0-9]/.test(v) },
  { label: "Symbol (!@#$…)",    test: (v) => /[^A-Za-z0-9\s]/.test(v) },
  { label: "No spaces",         test: (v) => v.length > 0 && !/\s/.test(v) },
  { label: "8 – 12 characters", test: (v) => v.length >= 8 && v.length <= 12 },
];

function RuleItem({ passed, label }: { passed: boolean; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold shrink-0 transition-all duration-200
        ${passed ? "bg-emerald-500 text-white scale-110" : "bg-gray-200 text-gray-400"}`}>
        {passed ? "✓" : "·"}
      </span>
      <span className={`text-[11px] transition-colors duration-200 ${passed ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
        {label}
      </span>
    </li>
  );
}

// ── Password input ────────────────────────────────────────────────────────────

function PasswordInput({ name, value, placeholder, onChange, onBlur }: {
  name: string; value: string; placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur:   (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative flex items-center">
      <input name={name} value={value} onChange={onChange} onBlur={onBlur}
        type={visible ? "text" : "password"}
        className="outline-0 border p-2 pr-9 border-gray-200 rounded-md bg-white text-sm h-8 text-gray-600 w-full"
        placeholder={placeholder}
      />
      <button type="button" tabIndex={-1} onClick={() => setVisible(v => !v)}
        className="absolute right-2.5 text-gray-400 hover:text-amber-600 transition-colors cursor-pointer">
        {visible ? <EyeOpen /> : <EyeClosed />}
      </button>
    </div>
  );
}

// ── OTP input ─────────────────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) { onChange(pasted); inputs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i] === " " ? "" : digits[i] || ""}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-10 h-10 text-center border border-gray-200 rounded-lg bg-white text-sm font-bold text-cyan-900 outline-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-all"
        />
      ))}
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function useCountdown(seconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!active) { setRemaining(seconds); return; }
    setRemaining(seconds);
    const id = setInterval(() => setRemaining(r => {
      if (r <= 1) { clearInterval(id); return 0; }
      return r - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [active, seconds]);
  return remaining;
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {[1, 2].map(n => (
        <div key={n} className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${step === n ? "bg-amber-600 text-white" : step > n ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
            {step > n ? "✓" : n}
          </div>
          <span className={`text-xs font-medium ${step === n ? "text-cyan-900" : "text-gray-400"}`}>
            {n === 1 ? "Identity" : "Credentials"}
          </span>
          {n < 2 && <div className={`h-px w-8 ${step > 1 ? "bg-emerald-400" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function SignUp(props: any) {
  const { handleIsLogin, sendMessage, onSuccess, isTermsShown } = props;
  const { showLoader, hideLoader } = useLoader();
  const { setUser } = useAuth();

  const [step, setStep]               = useState<1 | 2>(1);
  const [showTerms, setShowTerms]     = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Email OTP
  const [emailBlurred,   setEmailBlurred]   = useState(false);
  const [otpSending,     setOtpSending]     = useState(false);
  const [otpSent,        setOtpSent]        = useState(false);
  const [otpValue,       setOtpValue]       = useState("");
  const [otpVerifying,   setOtpVerifying]   = useState(false);
  const [emailVerified,  setEmailVerified]  = useState(false);

  const [formData, setFormData] = useState({
    fullname: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullname: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const countdown  = useCountdown(120, otpSent);
  const emailValid = /\S+@\S+\.\S+/.test(formData.email);

  const passwordRulesPassed = PASSWORD_RULES.map(r => r.test(formData.password));
  const allRulesPassed      = passwordRulesPassed.every(Boolean);
  const passedCount         = passwordRulesPassed.filter(Boolean).length;

  // Hide password panel as soon as all rules pass
  const showPasswordRules = passwordTouched && formData.password.length > 0 && !allRulesPassed;

  const strengthBarColor =
    passedCount <= 2 ? "bg-red-400" : passedCount <= 4 ? "bg-amber-400" : "bg-emerald-500";

  const showSendOtpBtn = emailBlurred && emailValid && !emailVerified;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordTouched(true);
    if (name === "email") {
      setEmailVerified(false); setOtpSent(false);
      setOtpValue(""); setErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";
    if (name === "email") setEmailBlurred(true);
    switch (name) {
      case "fullname":        if (!value.trim()) error = "Full name is required."; break;
      case "email":           if (!value.trim()) error = "Email is required.";
                              else if (!emailValid) error = "Enter a valid email address."; break;
      case "phone":           if (!value.trim()) error = "Phone number is required.";
                              else if (!/^\d{10}$/.test(value)) error = "Enter a valid 10-digit number."; break;
      case "password":        if (!value) error = "Password is required.";
                              else if (!allRulesPassed) error = "Password does not meet all requirements."; break;
      case "confirmPassword": if (!value) error = "Please confirm your password.";
                              else if (value !== formData.password) error = "Passwords do not match."; break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // ── Send OTP ────────────────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    if (!emailValid || otpSending) return;
    setOtpSending(true);
    setErrors(prev => ({ ...prev, email: "" }));
    try {
      const res = await authService.sendOtp(formData.email);
      if (!res.success) throw new Error(res.data?.message || res.error || "Failed to send OTP");
      setOtpSent(true); setOtpValue("");
    } catch (err: any) {
      setErrors(prev => ({ ...prev, email: err.message }));
    } finally {
      setOtpSending(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────

  const handleVerifyOtp = async () => {
    if (otpValue.replace(/ /g, "").length !== 6 || otpVerifying) return;
    setOtpVerifying(true);
    setErrors(prev => ({ ...prev, email: "" }));
    try {
      const res = await authService.verifyOtp(formData.email, otpValue.replace(/ /g, ""));
      if (!res.success) throw new Error(res.data?.message || "Verification failed");
      setEmailVerified(true); setOtpSent(false);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, email: err.message }));
      setOtpValue("");
    } finally {
      setOtpVerifying(false);
    }
  };

  // ── Step 1 → 2 ──────────────────────────────────────────────────────────────

  const handleContinue = () => {
    const e: any = {};
    if (!formData.fullname.trim()) e.fullname = "Full name is required.";
    if (!formData.email.trim())    e.email    = "Email is required.";
    else if (!emailValid)          e.email    = "Enter a valid email address.";
    if (!emailVerified)            e.email    = e.email || "Please verify your email first.";
    setErrors(prev => ({ ...prev, ...e }));
    if (Object.keys(e).length === 0 && emailVerified) setStep(2);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const validateStep2 = (): boolean => {
    const e: any = {};
    if (!formData.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone)) e.phone = "Enter a valid 10-digit number.";
    if (!formData.password) e.password = "Password is required.";
    else if (!allRulesPassed) e.password = "Password does not meet all requirements.";
    if (!formData.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(prev => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const handleSignUpClick = () => {
    setPasswordTouched(true);
    if (!validateStep2()) return;
    setShowTerms(true);
    isTermsShown(true);
  };

  const handleAgree = async (agreedOn: Date) => {
    const payload = {
      fullName: formData.fullname, email: formData.email,
      phoneNumber: formData.phone, password: formData.password,
      agreedOn: agreedOn.toISOString(), emailVerified,
    };
    showLoader();
    const result = await authService.signUp(payload);
    hideLoader();
    isTermsShown(false);
    if (result.error) {
      sendMessage({ text: result.error, severity: "error" });
      setShowTerms(false);
      return;
    }
    setUser(result.user as User);
    onSuccess(result.user as User);
    sendMessage({ text: "Sign Up Successful", severity: "success" });
  };

  const handleDisagree = () => { setShowTerms(false); isTermsShown(false); };

  if (showTerms) return <TermsAndConditions onAgree={handleAgree} onDisagree={handleDisagree} />;

  const otpComplete = otpValue.replace(/ /g, "").length === 6;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[90%] flex flex-col gap-4">

        <StepIndicator step={step} />

        {/* ══════════════ STEP 1 — Identity ══════════════ */}
        {step === 1 && (
          <div className="flex flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-950 text-sm font-medium">Full Name</label>
              <input name="fullname" value={formData.fullname}
                onChange={handleChange} onBlur={handleBlur}
                type="text" placeholder="Enter your first and last name"
                className="outline-0 border p-2 border-gray-200 rounded-md bg-white text-sm h-9 text-gray-600"
              />
              {errors.fullname && <span className="text-red-600 text-xs ml-0.5">{errors.fullname}</span>}
            </div>

            {/* Email + OTP */}
           {/* Email + OTP */}
<div className="flex flex-col gap-1">
  <label className="text-cyan-950 text-sm font-medium">Email</label>

  <div className="flex items-center gap-2">
    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
      onBlur={handleBlur}
      type="email"
      placeholder="Enter your email"
      disabled={emailVerified}
      className={`outline-0 border p-2 border-gray-200 rounded-md text-sm h-9 text-gray-600 flex-1 transition-all
        ${emailVerified ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white"}`}
    />

    {emailVerified ? (
      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold shrink-0">
        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
        Verified
      </span>
    ) : (
      <button
        type="button"
        onClick={() => {
          if (!emailValid) {
            setErrors(prev => ({ ...prev, email: "Enter a valid email address first." }));
            return;
          }
          handleSendOtp();
        }}
        disabled={otpSending || (otpSent && countdown > 0)}
        className={`shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-md text-xs font-semibold transition-all
          ${otpSending || (otpSent && countdown > 0)
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : emailValid
            ? "bg-amber-600 text-white hover:bg-amber-500 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
      >
        {otpSending
          ? <><Spinner /> Sending…</>
          : otpSent && countdown > 0
          ? `Resend in ${countdown}s`
          : otpSent
          ? "Resend OTP"
          : "Send OTP"}
      </button>
    )}
  </div>

  {errors.email && <span className="text-red-600 text-xs ml-0.5">{errors.email}</span>}

  {/* OTP panel */}
  {otpSent && !emailVerified && (
    <div className="mt-1 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 space-y-3">
      <p className="text-xs text-gray-500">
        Enter the 6-digit code sent to{" "}
        <span className="font-semibold text-cyan-900">{formData.email}</span>
      </p>
      <OtpInput value={otpValue} onChange={setOtpValue} />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={!otpComplete || otpVerifying}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all
            ${otpComplete && !otpVerifying
              ? "bg-cyan-900 text-white hover:bg-cyan-800 cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          {otpVerifying ? <><Spinner /> Verifying…</> : "Verify OTP"}
        </button>
        {countdown > 0
          ? <span className="text-[11px] text-gray-400">Expires in {countdown}s</span>
          : <button type="button" onClick={handleSendOtp}
              className="text-[11px] text-amber-600 hover:underline cursor-pointer font-medium">
              Resend code
            </button>}
      </div>
    </div>
  )}
</div>

            {/* Continue */}
            <button type="button" onClick={handleContinue}
              className={`w-full p-2.5 rounded-lg text-sm font-semibold transition-all
                ${emailVerified
                  ? "bg-amber-600 text-white hover:bg-amber-500 cursor-pointer hover:scale-[1.01]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              Continue →
            </button>

            <div className="flex items-center text-sm justify-center text-gray-700">
              Already a user?
              <a className="ml-2 text-amber-600 cursor-pointer underline" onClick={() => handleIsLogin(true)}>
                Sign In
              </a>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 2 — Credentials ══════════════ */}
        {step === 2 && (
          <form onSubmit={e => { e.preventDefault(); handleSignUpClick(); }}
            className="flex flex-col gap-4">

            {/* Summary of step 1 */}
            <div className="flex items-center justify-between bg-cyan-900 border border-cyan-900 rounded-xl px-4 py-2.5 mb-5">
              <div>
                <p className="text-xs text-cyan-50 font-semibold">{formData.fullname}</p>
                <p className="text-[11px] text-cyan-50">{formData.email} · <span className="text-emerald-200">Verified ✓</span></p>
              </div>
              <button type="button" onClick={() => setStep(1)}
                className="text-[11px] text-gray-400 hover:text-amber-600 transition-colors cursor-pointer underline underline-offset-2">
                Edit
              </button>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-950 text-sm font-medium">Phone Number</label>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-amber-600 font-semibold">+91</span>
                <input name="phone" value={formData.phone}
                  onChange={handleChange} onBlur={handleBlur}
                  type="text" placeholder="10-digit mobile number"
                  className="outline-0 border p-2 border-gray-200 rounded-md bg-white text-sm h-9 text-gray-600 flex-1"
                />
              </div>
              {errors.phone && <span className="text-red-600 text-xs ml-0.5">{errors.phone}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-950 text-sm font-medium">Password</label>
              <PasswordInput name="password" value={formData.password}
                placeholder="Create a password" onChange={handleChange} onBlur={handleBlur} />
              {errors.password && !showPasswordRules && (
                <span className="text-red-600 text-xs ml-0.5">{errors.password}</span>
              )}

              {/* Rules panel — disappears once all pass */}
              {showPasswordRules && (
                <div className="mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Password requirements
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {PASSWORD_RULES.map((rule, i) => (
                      <RuleItem key={rule.label} passed={passwordRulesPassed[i]} label={rule.label} />
                    ))}
                  </ul>
                  {/* Strength bar */}
                  <div className="mt-2.5 flex gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${passedCount > i ? strengthBarColor : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className={`text-[10px] mt-1 text-right font-semibold
                    ${passedCount <= 2 ? "text-red-500" : passedCount <= 4 ? "text-amber-500" : "text-emerald-600"}`}>
                    {passedCount <= 2 ? "Weak" : passedCount <= 4 ? "Fair" : "Almost there"}
                  </p>
                </div>
              )}

              {/* Subtle confirmation when password is good */}
              {allRulesPassed && formData.password && (
                <p className="text-[11px] text-emerald-600 ml-0.5 flex items-center gap-1 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                  Password looks good
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-950 text-sm font-medium">Confirm Password</label>
              <PasswordInput name="confirmPassword" value={formData.confirmPassword}
                placeholder="Re-enter your password" onChange={handleChange} onBlur={handleBlur} />
              {errors.confirmPassword && (
                <span className="text-red-600 text-xs ml-0.5">{errors.confirmPassword}</span>
              )}
              {/* Live match indicator */}
              {formData.confirmPassword && formData.password && (
                formData.confirmPassword === formData.password
                  ? <p className="text-[11px] text-emerald-600 ml-0.5 flex items-center gap-1 font-medium">
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                      Passwords match
                    </p>
                  : <p className="text-[11px] text-red-500 ml-0.5">Passwords do not match yet</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit"
              className="w-full p-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-all hover:scale-[1.01] cursor-pointer">
              Create Account →
            </button>

            <div className="flex items-center text-sm justify-center text-gray-700">
              Already a user?
              <a className="ml-2 text-amber-600 cursor-pointer underline" onClick={() => handleIsLogin(true)}>
                Sign In
              </a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}