/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAuth, User } from "@/providers/AuthProvider";
import { authService } from "@/services/Authentication.service";

// ── Icons ─────────────────────────────────────────────────────────────────────
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
function CheckCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PasswordInput({ name, value, placeholder, onChange }: {
  name: string; value: string; placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative flex items-center">
      <input
        name={name} value={value} onChange={onChange}
        type={visible ? "text" : "password"}
        className="outline-none border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 p-2 pr-9 rounded-lg bg-white text-sm h-10 text-gray-700 w-full transition-all"
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button type="button" tabIndex={-1} onClick={() => setVisible(v => !v)}
        className="absolute right-2.5 text-gray-400 hover:text-amber-600 transition-colors cursor-pointer">
        {visible ? <EyeOpen /> : <EyeClosed />}
      </button>
    </div>
  );
}

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
        ${passed ? "bg-emerald-500 text-white scale-110" : "bg-gray-100 text-gray-400"}`}>
        {passed ? "✓" : "·"}
      </span>
      <span className={`text-[11px] transition-colors duration-200 ${passed ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
        {label}
      </span>
    </li>
  );
}

function SectionCard({ icon, title, badge, children }: {
  icon: React.ReactNode; title: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            {icon}
          </span>
          <h2 className="text-cyan-950 text-sm font-semibold">{title}</h2>
        </div>
        {badge && (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg
      ${type === "success"
        ? "bg-cyan-950 text-white"
        : "bg-red-50 border border-red-200 text-red-700"}`}>
      {type === "success" && <CheckCircle />}
      {message}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(p => p[0]?.toUpperCase()).filter(Boolean).slice(0, 2).join("");
  return (
    <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 text-xl font-bold shrink-0 shadow-sm">
      {initials || "?"}
    </div>
  );
}

// ── Icons (small) ──────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ── Main Account Page ─────────────────────────────────────────────────────────
export default function AccountPage() {
  const { user, setUser } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile fields
  const [fullname, setFullname] = useState(user?.fullname ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password change
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordErrors, setPasswordErrors] = useState({ current: "", newPass: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const passwordRulesPassed = PASSWORD_RULES.map(r => r.test(passwords.newPass));
  const allRulesPassed = passwordRulesPassed.every(Boolean);
  const passedCount = passwordRulesPassed.filter(Boolean).length;
  const strengthBarColor = passedCount <= 2 ? "bg-red-400" : passedCount <= 4 ? "bg-amber-400" : "bg-emerald-500";
  const strengthLabel =
    !passwords.newPass ? null
    : passedCount <= 2 ? { text: "Weak", cls: "text-red-500" }
    : passedCount <= 4 ? { text: "Fair", cls: "text-amber-500" }
    : allRulesPassed ? { text: "Strong ✓", cls: "text-emerald-600" }
    : { text: "Almost", cls: "text-amber-500" };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = async () => {
    if (!fullname.trim()) { setProfileError("Full name is required."); return; }
    setProfileError("");
    setSavingProfile(true);
    try {
      await authService.updateProfile({ fullname });
      setUser({ ...user, fullname } as User);
      showToast("Profile updated successfully", "success");
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    const errs = { current: "", newPass: "", confirm: "" };
    if (!passwords.current) errs.current = "Current password is required.";
    if (!passwords.newPass) errs.newPass = "New password is required.";
    else if (!allRulesPassed) errs.newPass = "Password does not meet all requirements.";
    if (!passwords.confirm) errs.confirm = "Please confirm your new password.";
    else if (passwords.newPass !== passwords.confirm) errs.confirm = "Passwords do not match.";
    if (passwords.current && passwords.current === passwords.newPass) errs.newPass = "New password must differ from current.";
    setPasswordErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass });
      setPasswords({ current: "", newPass: "", confirm: "" });
      setPasswordTouched(false);
      showToast("Password changed successfully", "success");
    } catch (e: any) {
      if (e?.message?.includes("incorrect") || e?.status === 401) {
        setPasswordErrors(prev => ({ ...prev, current: "Current password is incorrect." }));
      } else {
        showToast("Failed to change password", "error");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* ── Page header ── */}
        <div className="mb-2">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
            Settings
          </p>
          <h1 className="text-2xl font-bold text-cyan-950">My Account</h1>
          <div className="h-0.5 w-10 bg-amber-500 mt-2" />
        </div>

        {/* ── Profile Hero ── */}
        <div className="bg-cyan-950 rounded-2xl p-6 flex items-center gap-5 shadow-md">
          <Avatar name={user?.fullname ?? ""} />
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-white text-lg font-bold truncate">{user?.fullname}</h2>
            <p className="text-cyan-400 text-sm truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full w-fit capitalize">
              {user?.roles?.[0] ?? "student"}
            </span>
          </div>
        </div>

        {/* ── Profile Info ── */}
        <SectionCard icon={<UserIcon />} title="Profile Information">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-cyan-950 text-sm font-medium">Full Name</label>
              <input
                value={fullname}
                onChange={e => { setFullname(e.target.value); setProfileError(""); }}
                type="text"
                placeholder="Your full name"
                className="outline-none border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 p-2 rounded-lg bg-white text-sm h-10 text-gray-700 transition-all"
              />
              {profileError && <span className="text-red-500 text-xs">{profileError}</span>}
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="self-start flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              {savingProfile ? <><Spinner /> Saving…</> : "Save Changes"}
            </button>
          </div>
        </SectionCard>

        {/* ── Contact Details ── */}
        <SectionCard icon={<MailIcon />} title="Contact Details" badge="Verified">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-cyan-950 text-sm font-medium flex items-center gap-1.5">
                Email
                <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                  <LockIcon /> locked
                </span>
              </label>
              <input
                value={user?.email ?? ""}
                disabled
                className="outline-none border border-gray-100 p-2 rounded-lg bg-gray-50 text-sm h-10 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
              <p className="font-semibold mb-1">Need to change your email?</p>
              <p className="text-amber-700">These fields are verified and locked for security. Contact our support team to request a change.</p>
              <a href="mailto:support@crackora.com" className="mt-2 inline-block text-amber-600 underline font-semibold">
                Contact Support →
              </a>
            </div>
          </div>
        </SectionCard>

        {/* ── Change Password ── */}
        <SectionCard icon={<ShieldIcon />} title="Change Password">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-cyan-950 text-sm font-medium">Current Password</label>
              <PasswordInput
                name="current" value={passwords.current} placeholder="Enter your current password"
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              />
              {passwordErrors.current && <span className="text-red-500 text-xs">{passwordErrors.current}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-cyan-950 text-sm font-medium">New Password</label>
              <PasswordInput
                name="newPass" value={passwords.newPass} placeholder="Enter new password"
                onChange={e => { setPasswords(p => ({ ...p, newPass: e.target.value })); setPasswordTouched(true); }}
              />
              {passwordErrors.newPass && <span className="text-red-500 text-xs">{passwordErrors.newPass}</span>}

              {passwordTouched && passwords.newPass && (
                <div className="mt-1 bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password requirements</p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {PASSWORD_RULES.map((rule, i) => (
                      <RuleItem key={rule.label} passed={passwordRulesPassed[i]} label={rule.label} />
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${passedCount > i ? strengthBarColor : "bg-gray-100"}`} />
                    ))}
                  </div>
                  {strengthLabel && (
                    <p className={`text-[10px] mt-1 text-right font-semibold ${strengthLabel.cls}`}>{strengthLabel.text}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-cyan-950 text-sm font-medium">Confirm New Password</label>
              <PasswordInput
                name="confirm" value={passwords.confirm} placeholder="Re-enter new password"
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              />
              {passwordErrors.confirm && <span className="text-red-500 text-xs">{passwordErrors.confirm}</span>}
            </div>

            <button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className="self-start flex items-center gap-2 bg-cyan-950 hover:bg-cyan-900 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              {savingPassword ? <><Spinner /> Updating…</> : "Update Password"}
            </button>
          </div>
        </SectionCard>

        {/* ── Danger Zone ── */}
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-4 bg-red-500 rounded-full" />
            <h2 className="text-red-600 text-sm font-semibold">Danger Zone</h2>
          </div>
          <p className="text-gray-400 text-xs mb-4 ml-3.5">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border border-red-200 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
            >
              Delete Account
            </button>
          ) : (
            <div className="flex flex-col gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-xs text-red-700 font-medium">
                Type <span className="font-bold">DELETE</span> to confirm
              </p>
              <input
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                className="outline-none border border-red-200 focus:border-red-400 p-2 rounded-lg bg-white text-sm h-9 text-gray-700"
                placeholder="Type DELETE"
              />
              <div className="flex gap-2">
                <button
                  disabled={deleteInput !== "DELETE"}
                  className="bg-red-600 disabled:opacity-40 text-white text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer transition-all"
                  onClick={() => {
                    showToast("Account deletion requested", "error");
                    setShowDeleteConfirm(false);
                  }}
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                  className="text-gray-500 border border-gray-200 text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}