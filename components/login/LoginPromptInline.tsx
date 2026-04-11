// components/auth/LoginPromptInline.tsx
// Uses your existing AuthProvider — calls openAuth() which triggers AuthModal.
// setPostAuthAction ensures the gate disappears automatically after login.

"use client";
import { useAuth } from "@/providers/AuthProvider";

interface Props {
  lockedCount: number;
  itemLabel?: string;
  onUnlock?: () => void;
}

export function LoginPromptInline({ lockedCount, itemLabel = "colleges", onUnlock }: Props) {
  const { openAuth, setPostAuthAction } = useAuth();

  function handleClick() {
    // postAuthAction fires inside AuthModal's handleSuccess after setUser + closeAuth.
    // This notifies the parent (e.g. CollegeCompareTool) to hide the gate.
    if (onUnlock) setPostAuthAction(() => onUnlock);
    openAuth();
  }

  return (
    <div className="relative rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm overflow-hidden">
      <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-indigo-200/30 blur-2xl" />
      <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center text-xl">
        🔓
      </div>
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="text-sm font-semibold text-cyan-900 leading-snug">
          {lockedCount} more {itemLabel} available — free, just sign in
        </p>
        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
          No paid plan needed. Sign in to unlock the full list of colleges.
        </p>
      </div>
      <button
        onClick={handleClick}
        className="shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-md transition-all shadow-sm whitespace-nowrap"
      >
        Sign in / Sign up →
      </button>
    </div>
  );
}