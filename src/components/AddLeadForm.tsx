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
      const createRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: companyName.trim(), companyUrl: companyUrl.trim() || undefined }),
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        throw new Error(data.error || "Failed to create lead");
      }

      const { lead } = await createRes.json();

      const analyzeRes = await fetch("/api/leads/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      });

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json();
        throw new Error(data.error || "Failed to analyze lead");
      }

      setCompanyName("");
      setCompanyUrl("");
      onLeadAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            className="rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
            placeholder="https://example.com"
            className="rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700 ${
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
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
