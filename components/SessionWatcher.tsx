/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "@/providers/SnackbarProvider";

export default function SessionWatcher() {
  const { logout, openAuth } = useAuth();
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 Handle query param trigger
  useEffect(() => {
    const authStatus = searchParams.get("auth");

    if (authStatus === "expired") {
      logout();
      showMessage("Your session expired. Please login again.", "error");
      openAuth();

      // Clean URL after handling
      router.replace("/");
    }
  }, [searchParams, logout, openAuth, router, showMessage]);

  // 🔥 Handle client-side 401
  useEffect(() => {
    const handleUnauthorized = (event: any) => {
      const type = event.detail;
      if (type.includes('Unauthorized')) {
        logout();
      }
      router.push("/");
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [logout, openAuth, router, showMessage]);

  return null;
}





