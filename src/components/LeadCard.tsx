"use client";

import { Lead } from "@/lib/types";

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function LeadCard({
  lead,
  onFavorite,
  onDelete,
}: {
  lead: Lead;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-lg font-semibold text-gray-900">
          {lead.companyName}
        </h3>
        <button
          onClick={() => onFavorite(lead.id)}
          className="shrink-0 transition"
        >
          {lead.isFavorite ? (
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-300 transition hover:text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          )}
        </button>
      </div>

      {lead.companyUrl && (
        <a
          href={lead.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block truncate text-sm text-indigo-600 hover:underline"
        >
          {lead.companyUrl}
        </a>
      )}

      <div className="mt-3 max-h-40 overflow-y-auto">
        {lead.aiBrief ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {lead.aiBrief}
          </p>
        ) : (
          <p className="text-sm italic text-gray-400">
            No analysis generated yet
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatRelativeTime(lead.createdAt)}
        </span>
        <button
          onClick={() => {
            if (window.confirm("Delete this lead?")) onDelete(lead.id);
          }}
          className="text-gray-400 transition hover:text-red-500"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
