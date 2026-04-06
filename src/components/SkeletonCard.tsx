export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
      <div className="h-5 w-3/5 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-2/5 rounded bg-gray-200" />

      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-4/5 rounded bg-gray-200" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-5 rounded bg-gray-200" />
        <div className="h-5 w-5 rounded bg-gray-200" />
      </div>
    </div>
  );
}
