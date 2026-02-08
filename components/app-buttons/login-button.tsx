"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/providers/AuthProvider";
import { BiLogIn } from "react-icons/bi";

export function LoginStatus(props: any) {
  const { mobile } = props;
  const { openAuth } = useAuth();
  return (
    <>
      <div
        className={`flex gap-2 ${
          mobile ? "text-cyan-900 text-2xl" : "text-gray-300"
        }  items-center text-sm font-normal`}
      >
        <div className="flex gap-2 justify-center items-center cursor-pointer">
          <BiLogIn className="text-amber-600 w-6 h-6 font-semibold" />
          <div
            className="text-cyan-900 text-[15px] font-medium"
            onClick={openAuth}
          >
            Log In
          </div>
        </div>
      </div>
    </>
  );
}
