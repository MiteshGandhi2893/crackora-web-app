export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit
) {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    // if (typeof window !== "undefined") {
    //   window.dispatchEvent(new Event("unauthorized"));
    // }
    return null;
  }

  return res.json();
}