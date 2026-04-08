"use client";

import { useState, FormEvent } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function AddLeadForm({
  onLeadAdded,
}: {
  onLeadAdded: () => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const trimmedName = companyName.trim();
      const trimmedUrl = companyUrl.trim();

      const createRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: trimmedName, companyUrl: trimmedUrl || undefined }),
      });

      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save lead");
      }

      const { lead } = await createRes.json();

      try {
        const analyzeRes = await fetch("/api/leads/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id }),
        });

        if (!analyzeRes.ok) {
          setError("Lead saved, but could not reach AI service. You can retry analysis later.");
        }
      } catch {
        setError("Lead saved, but could not reach AI service. You can retry analysis later.");
      }

      setCompanyName("");
      setCompanyUrl("");
      onLeadAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lead");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Research a Lead</h2>
      <form onSubmit={onSubmit} className="mt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Stripe, Notion, Figma"
            required
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <input
            type="text"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700 md:w-auto ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Analyzing...
              </>
            ) : (
              "Analyze & Save"
            )}
          </button>
        </div>
        <div
          className={`grid transition-all duration-200 ease-out ${
            error ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <p className="overflow-hidden text-sm text-red-600">{error}</p>
        </div>
      </form>
    </div>
  );
}
