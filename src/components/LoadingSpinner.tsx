const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function LoadingSpinner({
  size = "md",
  text,
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizes[size]} rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}
