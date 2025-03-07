export default function LoadingSpinner({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-t-primary border-r-primary border-b-primary border-l-transparent animate-spin`}
      ></div>
    </div>
  )
}

