/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState } from "react";
import { authService } from "@/services/Authentication.service";
import { useAuth, User } from "@/providers/AuthProvider";
import { Severity } from "@/interfaces/authentication-interface";

// ── Eye icons ────────────────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeClosed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
      <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold shrink-0 transition-all duration-200 ${passed ? "bg-emerald-500 text-white scale-110" : "bg-gray-200 text-gray-400"}`}>
        {passed ? "✓" : "·"}
      </span>
      <span className={`text-[11px] transition-colors duration-200 ${passed ? "text-emerald-600 font-medium" : "text-gray-400"}`}>{label}</span>
    </li>
  );
}

// ── OTP Input ────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const updated = [...digits]; updated[i] = " ";
      onChange(updated.join("").trimEnd());
      if (i > 0) inputs.current[i - 1]?.focus();
    }
  };
  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const updated = [...digits]; updated[i] = char;
    onChange(updated.join("").replace(/ /g, ""));
    if (i < 5) inputs.current[i + 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) { onChange(pasted); inputs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-start">
      {Array.from({ length: 6 }).map((_, i) => (
        <input key={i} ref={el => { inputs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
          value={digits[i] === " " ? "" : digits[i] || ""}
          onChange={e => handleChange(i, e)} onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}
          className="w-10 h-10 text-center border border-gray-200 rounded-md bg-white text-sm font-bold text-cyan-900 outline-0 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-all"
        />
      ))}
    </div>
  );
}

// ── Password input with eye ───────────────────────────────────────────────────
function PasswordInput({ name, value, placeholder, onChange }: {
  name: string; value: string; placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative flex items-center">
      <input name={name} value={value} onChange={onChange} type={visible ? "text" : "password"}
        className="outline-0 border p-2 pr-9 border-gray-300 bg-white rounded-md text-sm w-full"
        placeholder={placeholder} autoComplete="new-password"
      />
      <button type="button" tabIndex={-1} onClick={() => setVisible(v => !v)}
        className="absolute right-2.5 text-gray-400 hover:text-amber-600 transition-colors cursor-pointer">
        {visible ? <EyeOpen /> : <EyeClosed />}
      </button>
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────
import { useEffect, useRef as React_useRef } from "react";
import React from "react";

function useCountdown(seconds: number, active: boolean) {
  const [remaining, setRemaining] = React.useState(seconds);
  useEffect(() => {
    if (!active) { setRemaining(seconds); return; }
    setRemaining(seconds);
    const id = setInterval(() => setRemaining(r => { if (r <= 1) { clearInterval(id); return 0; } return r - 1; }), 1000);
    return () => clearInterval(id);
  }, [active, seconds]);
  return remaining;
}

// ── Types ────────────────────────────────────────────────────────────────────
type ForgotStep = "idle" | "email" | "otp" | "newPassword" | "done";

interface SignInProps {
  handleIsLogin: (val: boolean) => void;
  sendMessage: (msg: { text: string; severity: Severity }) => void;
  onSuccess: (user: User) => void;
}

// ── SignIn Component ──────────────────────────────────────────────────────────
export function SignIn({ handleIsLogin, sendMessage, onSuccess }: SignInProps) {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "", submit: "" });
  const [loading, setLoading] = useState(false);

  // Forgot password flow
  const [forgotStep, setForgotStep] = useState<ForgotStep>("idle");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [newPasswords, setNewPasswords] = useState({ pass: "", confirm: "" });
  const [newPassErrors, setNewPassErrors] = useState({ pass: "", confirm: "" });
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [savingNewPass, setSavingNewPass] = useState(false);

  const countdown = useCountdown(120, otpSent);

  const passwordRulesPassed = PASSWORD_RULES.map(r => r.test(newPasswords.pass));
  const allRulesPassed = passwordRulesPassed.every(Boolean);
  const passedCount = passwordRulesPassed.filter(Boolean).length;
  const strengthBarColor = passedCount <= 2 ? "bg-red-400" : passedCount <= 4 ? "bg-amber-400" : "bg-emerald-500";
  const strengthLabel =
    !newPasswords.pass ? null
    : passedCount <= 2 ? { text: "Weak", cls: "text-red-500" }
    : passedCount <= 4 ? { text: "Fair", cls: "text-amber-500" }
    : allRulesPassed ? { text: "Strong ✓", cls: "text-emerald-600" }
    : { text: "Almost", cls: "text-amber-500" };

  // ── Normal sign-in ──────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";
    if (name === "username" && !value.trim()) error = "Email is required.";
    if (name === "username" && value && !/\S+@\S+\.\S+/.test(value)) error = "Enter a valid email address.";
    if (name === "password" && !value) error = "Password is required.";
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  const validateForm = () => {
    const newErrors = { username: "", password: "", submit: "" };
    if (!formData.username.trim()) newErrors.username = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.username)) newErrors.username = "Enter a valid email address.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.values(newErrors).every(err => err === "");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const result = await authService.signIn({ username: formData.username, password: formData.password });
    setLoading(false);
    if (result.error) {
      setErrors({ ...errors, submit: result?.error?.split(":")[1]?.trim() ?? result.error });
      return;
    }
    setUser(result.user as User);
    onSuccess(result.user as User);
    sendMessage({ text: "Signed in successfully", severity: "success" });
  };

  // ── Forgot password steps ───────────────────────────────────────────────────
const handleSendForgotOtp = async () => {
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
        setForgotEmailError("Enter a valid email address.");
        return;
    }
    setForgotEmailError("");
    setOtpSending(true);

    try {
        // ✅ use the correct forgot-password route (checks email exists first)
        const res = await authService.forgotPasswordSendOtp(forgotEmail);

        if (!res.success) throw new Error(res.error || "Failed to send OTP");

        if (res.data?.alreadySent) {
            // OTP is still live — jump straight to entry, don't resend
            setForgotStep("otp");
            setOtpValue("");
            // Note: countdown won't be accurate here but the user just needs to enter the old code
            return;
        }

        // Fresh OTP sent
        setOtpSent(true);
        setForgotStep("otp");
        setOtpValue("");

    } catch (err: any) {
        setForgotEmailError(err.message || "Could not send OTP. Check the email address.");
    } finally {
        setOtpSending(false);
    }
};

  const handleVerifyForgotOtp = async () => {
    if (otpValue.replace(/ /g, "").length !== 6 || otpVerifying) return;
    setOtpVerifying(true);
    setOtpError("");
    try {
      // POST /user/forgot-password/verify-otp  { email, otp }
      const res = await authService.forgotPasswordVerifyOtp(forgotEmail, otpValue.replace(/ /g, ""));
      if (!res.success) throw new Error(res.data?.message || "Verification failed");
      setForgotStep("newPassword");
    } catch (err: any) {
      setOtpError(err.message || "Invalid OTP. Please try again.");
      setOtpValue("");
    } finally {
      setOtpVerifying(false);
    }
  };

 const handleSetNewPassword = async () => {
    const errs = { pass: "", confirm: "" };
    if (!newPasswords.pass) errs.pass = "Password is required.";
    else if (!allRulesPassed) errs.pass = "Password does not meet all requirements.";
    if (!newPasswords.confirm) errs.confirm = "Please confirm your password.";
    else if (newPasswords.pass !== newPasswords.confirm) errs.confirm = "Passwords do not match.";
    setNewPassErrors(errs);
    if (errs.pass || errs.confirm) return;

    setSavingNewPass(true);
    try {
        const res = await authService.resetPassword({
            email: forgotEmail,
            newPassword: newPasswords.pass,
        });
        if (!res.success) throw new Error(res.error || "Failed to reset password.");
        setForgotStep("done");
    } catch (err: any) {
        setNewPassErrors(prev => ({ ...prev, pass: err.message }));
    } finally {
        setSavingNewPass(false);
    }
};
  const resetForgotFlow = () => {
    setForgotStep("idle");
    setForgotEmail(""); setForgotEmailError("");
    setOtpValue(""); setOtpError(""); setOtpSent(false);
    setNewPasswords({ pass: "", confirm: "" }); setNewPassErrors({ pass: "", confirm: "" });
    setPasswordTouched(false);
  };

  // ── Render: Normal sign-in ──────────────────────────────────────────────────
  if (forgotStep === "idle") {
    return (
      <div className="flex flex-col lg:mt-10 items-center">
        <form onSubmit={handleSubmit} className="lg:w-[80%] w-[90%] flex flex-col gap-4 mt-4" noValidate>
          <div className="flex flex-col gap-1">
            <label className="text-cyan-950">Email</label>
            <input name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur}
              type="email" placeholder="Enter your registered email"
              className="outline-0 border p-2 border-gray-300 bg-white rounded-md text-sm" />
            {errors.username && <span className="text-red-700 text-sm">{errors.username}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-cyan-950">Password</label>
              <button
                type="button"
                onClick={() => setForgotStep("email")}
                className="text-xs text-amber-600 hover:text-amber-500 underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <input name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur}
              type="password" placeholder="Enter your password"
              className="outline-0 border p-2 border-gray-300 bg-white rounded-md text-sm" />
            {errors.password && <span className="text-red-700 text-sm">{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading}
            className="bg-amber-600 text-white p-2 rounded mt-2 hover:scale-105 disabled:opacity-50 cursor-pointer">
            {loading ? "Signing in…" : "Sign In"}
          </button>
          {errors.submit && <span className="text-red-700 text-sm">**{errors.submit}</span>}

          <div className="flex items-center justify-center text-md relative mt-2">
            Not a user?
            <span className="ml-2 text-amber-600 cursor-pointer underline" onClick={() => handleIsLogin(false)}>
              Sign Up
            </span>
          </div>
        </form>
      </div>
    );
  }

  // ── Render: Forgot — enter email ───────────────────────────────────────────
  if (forgotStep === "email") {
    return (
      <div className="flex flex-col lg:mt-10 items-center">
        <div className="lg:w-[80%] w-[90%] flex flex-col gap-4 mt-4">
          <div>
            <h2 className="text-cyan-950 font-semibold text-lg">Reset Password</h2>
            <p className="text-gray-400 text-sm">Enter your registered email and we`ll send you a verification code.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cyan-950 text-sm">Email</label>
            <div className="flex gap-2">
              <input
                value={forgotEmail} onChange={e => { setForgotEmail(e.target.value); setForgotEmailError(""); }}
                type="email" placeholder="Enter your email"
                className="outline-0 border p-2 border-gray-300 bg-white rounded-md text-sm flex-1"
              />
              <button
                type="button" onClick={handleSendForgotOtp}
                disabled={otpSending || !forgotEmail}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 text-white text-xs font-semibold rounded-md disabled:opacity-50 cursor-pointer hover:bg-amber-500"
              >
                {otpSending ? <><Spinner /> Sending…</> : "Send OTP"}
              </button>
            </div>
            {forgotEmailError && <span className="text-red-700 text-xs">{forgotEmailError}</span>}
          </div>

          <button type="button" onClick={resetForgotFlow} className="text-xs text-gray-400 hover:text-gray-600 underline self-start cursor-pointer">
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Forgot — verify OTP ────────────────────────────────────────────
  if (forgotStep === "otp") {
    const otpComplete = otpValue.replace(/ /g, "").length === 6;
    return (
      <div className="flex flex-col lg:mt-10 items-center">
        <div className="lg:w-[80%] w-[90%] flex flex-col gap-4 mt-4">
          <div>
            <h2 className="text-cyan-950 font-semibold text-lg">Check your inbox</h2>
            <p className="text-gray-400 text-sm">We sent a 6-digit code to <span className="font-semibold text-cyan-900">{forgotEmail}</span></p>
          </div>

          <div className="bg-white border border-amber-200 rounded-lg px-3 py-3 space-y-3">
            <OtpInput value={otpValue} onChange={setOtpValue} />
            {otpError && <p className="text-red-600 text-xs">{otpError}</p>}

            <div className="flex items-center gap-3">
              <button type="button" onClick={handleVerifyForgotOtp} disabled={!otpComplete || otpVerifying}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer
                  ${otpComplete && !otpVerifying ? "bg-cyan-900 text-white hover:bg-cyan-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                {otpVerifying ? <><Spinner /> Verifying…</> : "Verify OTP"}
              </button>
              <button type="button" onClick={() => setForgotStep("email")} disabled={otpSending || (otpSent && countdown > 0)}
                className="text-xs text-amber-600 underline disabled:text-gray-400 disabled:no-underline cursor-pointer">
                {otpSent && countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
            </div>
          </div>

          <button type="button" onClick={resetForgotFlow} className="text-xs text-gray-400 hover:text-gray-600 underline self-start cursor-pointer">
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Forgot — set new password ─────────────────────────────────────
  if (forgotStep === "newPassword") {
    return (
      <div className="flex flex-col lg:mt-10 items-center">
        <div className="lg:w-[80%] w-[90%] flex flex-col gap-4 mt-4">
          <div>
            <h2 className="text-cyan-950 font-semibold text-lg">Set New Password</h2>
            <p className="text-gray-400 text-sm">Choose a strong password for your account.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cyan-950 text-sm">New Password</label>
            <PasswordInput name="pass" value={newPasswords.pass} placeholder="Enter new password"
              onChange={e => { setNewPasswords(p => ({ ...p, pass: e.target.value })); setPasswordTouched(true); }} />
            {newPassErrors.pass && <span className="text-red-700 text-xs">{newPassErrors.pass}</span>}
            {passwordTouched && newPasswords.pass && (
              <div className="mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password requirements</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {PASSWORD_RULES.map((rule, i) => <RuleItem key={rule.label} passed={passwordRulesPassed[i]} label={rule.label} />)}
                </ul>
                <div className="mt-2.5 flex gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${passedCount > i ? strengthBarColor : "bg-gray-200"}`} />
                  ))}
                </div>
                {strengthLabel && <p className={`text-[10px] mt-1 text-right font-semibold ${strengthLabel.cls}`}>{strengthLabel.text}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cyan-950 text-sm">Confirm Password</label>
            <PasswordInput name="confirm" value={newPasswords.confirm} placeholder="Re-enter new password"
              onChange={e => setNewPasswords(p => ({ ...p, confirm: e.target.value }))} />
            {newPassErrors.confirm && <span className="text-red-700 text-xs">{newPassErrors.confirm}</span>}
          </div>

          <button type="button" onClick={handleSetNewPassword} disabled={savingNewPass}
            className="bg-amber-600 text-white p-2 rounded hover:scale-105 disabled:opacity-50 text-sm font-semibold cursor-pointer">
            {savingNewPass ? <span className="flex items-center justify-center gap-2"><Spinner /> Saving…</span> : "Set New Password"}
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Done ──────────────────────────────────────────────────────────
  if (forgotStep === "done") {
    return (
      <div className="flex flex-col lg:mt-10 items-center">
        <div className="lg:w-[80%] w-[90%] flex flex-col items-center gap-4 mt-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl">
            ✓
          </div>
          <h2 className="text-cyan-950 font-semibold text-lg">Password Reset!</h2>
          <p className="text-gray-400 text-sm">Your password has been updated. You can now sign in with your new password.</p>
          <button type="button" onClick={resetForgotFlow}
            className="bg-amber-600 text-white px-6 py-2 rounded hover:scale-105 text-sm font-semibold cursor-pointer">
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
}