/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { redirect } from "next/navigation";

export default function ErrorPage({ error, reset }: {error: string, reset: any}) {
  return (
    <>
      <h2>{error || 'Something went wrong, Please try again after sometime.'}</h2>
      <div className="flex gap-2">

      <button onClick={() => reset()}>Try Again</button>
      <button onClick={() => redirect('/')}>Home </button>

      </div>
      
    </>
  );
}
