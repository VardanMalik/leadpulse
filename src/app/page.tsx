"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddLeadForm from "@/components/AddLeadForm";
import LeadCard from "@/components/LeadCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import { Lead } from "@/lib/types";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchLeads();
  }, [status, fetchLeads]);

  async function handleFavorite(id: string) {
    const previous = leads;
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l))
    );

    try {
      const res = await fetch(`/api/leads/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to update");
    } catch {
      setLeads(previous);
    }
  }

  async function handleDelete(id: string) {
    const previous = leads;
    setLeads((prev) => prev.filter((l) => l.id !== id));

    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch {
      setLeads(previous);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-indigo-600">LeadPulse</span>
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                {session?.user?.name?.[0] ?? "?"}
              </div>
            )}
            <span className="hidden text-sm text-gray-700 sm:inline">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className="rounded-md px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <AddLeadForm onLeadAdded={fetchLeads} />

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Leads</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">
            {leads.length} leads
          </span>
        </div>

        {error && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">Failed to load leads. Please refresh.</p>
            <button
              onClick={() => {
                setIsLoading(true);
                fetchLeads();
              }}
              className="ml-4 shrink-0 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {leads.map((lead, i) => (
                <div
                  key={lead.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <LeadCard
                    lead={lead}
                    onFavorite={handleFavorite}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
