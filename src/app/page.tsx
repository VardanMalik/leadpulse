"use client";

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">
        Welcome to LeadPulse, {session?.user?.name}
      </h1>
      <button
        onClick={() => signOut()}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
}
